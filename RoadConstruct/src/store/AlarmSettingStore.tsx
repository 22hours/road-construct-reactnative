import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {
  useEffect,
  Dispatch,
  createContext,
  useReducer,
  useContext,
} from 'react';
import {API_CALL} from '~/api';
import {useLoader} from '~/store/AppGlobalLoadingStore';
import {useLocationData} from '~/store/AppGlobalStore';
import {toastAlert} from '~/util';
import {useAuthStore} from './AuthStore';
let axiosSource = axios.CancelToken.source();

// ELEMENT TYPES

// STATE TYPES
type State = {
  isLoad: boolean;
  alarm_list: Array<{
    si: string;
    gu_list: Array<{gu: string; alarmed?: boolean}>;
  }>;
};

// ACTION TYPES
type Action =
  | {type: 'LOAD_START'}
  | {type: 'LOAD_END'}
  | {type: 'INIT'; data: State['alarm_list']}
  | {type: 'ADD_SI'; data: {target_si: string; isAllAlaremd: boolean}}
  | {type: 'REMOVE_SI'; data: {target_si: string; isAllAlaremd: boolean}}
  | {
      type: 'ADD_GU';
      data: {target_si: string; target_gu: string};
    }
  | {
      type: 'REMOVE_GU';
      data: {target_si: string; target_gu: string};
    };

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const AlarmSettingContext = React.createContext<{
  state: State['alarm_list'];
  isLoad: boolean;
  submitAction: () => any;
  AsyncDispatch: (action: Action) => void;
} | null>(null);
const AlarmSettingDispatchContext = createContext<ContextDispatch | null>(null);

// REDUCER
const toggleSi = (
  target_si: string,
  isAllAlaremd: boolean,
  state: State['alarm_list'],
  flag: boolean,
) => {
  console.log(target_si, flag);
  var res_list = state.slice();
  var target_si_idx = state.findIndex(it => it.si === target_si);
  if (target_si_idx !== -1) {
    res_list[target_si_idx].gu_list = res_list[target_si_idx].gu_list.map(
      gu_it => {
        return {
          gu: gu_it.gu,
          // alarmed: isAllAlaremd ? false : true,
          alarmed: flag,
        };
      },
    );
    return res_list;
  } else {
    return state;
  }
};
const toggleSiGu = (
  target_si: string,
  target_gu: string,
  state: State['alarm_list'],
  flag: boolean,
) => {
  var res_list = state.slice();
  var target_si_idx = state.findIndex(it => it.si === target_si);
  if (target_si_idx !== -1) {
    var cur_si_item = state[target_si_idx];
    var cur_gu_list = cur_si_item.gu_list;
    var target_gu_idx = cur_gu_list.findIndex(it => it.gu === target_gu);

    if (target_gu_idx !== -1) {
      // res_list[target_si_idx].gu_list[target_gu_idx].alarmed = !res_list[
      //   target_si_idx
      // ].gu_list[target_gu_idx].alarmed;
      res_list[target_si_idx].gu_list[target_gu_idx].alarmed = flag;
      return res_list;
    } else {
      return state;
    }
  } else {
    return state;
  }
};

export const AlarmSettingProvider = ({children}) => {
  const loaderDispatch = useLoader();

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'LOAD_START': {
        return {...state, isLoad: true};
      }
      case 'LOAD_END': {
        return {...state, isLoad: false};
      }
      case 'INIT': {
        return {...state, alarm_list: action.data};
      }
      case 'ADD_GU': {
        var {target_si, target_gu} = action.data;
        var res = toggleSiGu(target_si, target_gu, state.alarm_list, true);
        return {...state, alarm_list: res};
      }
      case 'REMOVE_GU': {
        var {target_si, target_gu} = action.data;
        var res = toggleSiGu(target_si, target_gu, state.alarm_list, false);
        return {...state, alarm_list: res};
      }
      case 'ADD_SI': {
        var {target_si, isAllAlaremd} = action.data;
        var res = toggleSi(target_si, isAllAlaremd, state.alarm_list, true);
        return {...state, alarm_list: res};
      }
      case 'REMOVE_SI': {
        var {target_si, isAllAlaremd} = action.data;
        var res = toggleSi(target_si, isAllAlaremd, state.alarm_list, false);
        return {...state, alarm_list: res};
      }
      default:
        throw new Error('ALARM SETTING REUCDER ERROR OCCURED');
    }
  };
  const naviagtion = useNavigation();
  const location = useLocationData();
  const [state, dispatch] = useReducer(reducer, {
    isLoad: false,
    alarm_list: [],
  });

  const submitAction = async () => {
    loaderDispatch({type: 'SHOW_LOADER'});
    setTimeout(() => {
      submitRealAction();
    }, 0);
  };

  const submitRealAction = async () => {
    var request_obj: Array<{si: string; gu: string}> = [];
    state.alarm_list.forEach(first_it => {
      first_it.gu_list.forEach(second_it => {
        if (second_it.alarmed) {
          request_obj.push({si: first_it.si, gu: second_it.gu});
        }
      });
    });
    console.log(JSON.stringify(request_obj, null, 2));
    const rest_data = await API_CALL(
      'post',
      'MAIN_HOST',
      'USER_ALARMED_LOCATION_LIST',
      undefined,
      request_obj,
      true,
    );
    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        loaderDispatch({type: 'HIDE_LOADER'});
        toastAlert('설정 완료');
        // naviagtion.goBack();
      } else {
        const msg = rest_data.msg;
        loaderDispatch({type: 'HIDE_LOADER'});
        toastAlert(msg);
      }
    }
  };

  const init = async () => {
    loaderDispatch({type: 'SHOW_LOADER'});
    var rest_data = await API_CALL(
      'get',
      'MAIN_HOST',
      'USER_ALARMED_LOCATION_LIST',
      undefined,
      undefined,
      true,
    );
    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        var api_response_list: Array<{
          si: string;
          gu_list: Array<string>;
        }> = rest_data.data;

        var res_list: State['alarm_list'] = location.alarmed_data.slice();

        api_response_list.forEach(cur_si_item => {
          var cur_si = cur_si_item.si;
          var cur_gu_list = cur_si_item.gu_list;

          var cur_si_idx = res_list.findIndex(it => it.si === cur_si);
          var compare_item = res_list[cur_si_idx];

          cur_gu_list.forEach(cur_gu => {
            var cur_gu_idx = compare_item.gu_list.findIndex(
              it => it.gu === cur_gu,
            );
            res_list[cur_si_idx].gu_list[cur_gu_idx].alarmed = true;
          });
        });

        loaderDispatch({type: 'HIDE_LOADER'});
        dispatch({type: 'INIT', data: res_list});
      }
    }
  };

  const AsyncDispatch = (action: Action) => {
    dispatch({type: 'LOAD_START'});
    dispatch(action);
  };

  useEffect(() => {
    if (state.isLoad) {
      dispatch({type: 'LOAD_END'});
    }
  }, [state.alarm_list]);

  useEffect(() => {
    init();
    return () => {
      if (axiosSource) {
        axiosSource.cancel('Landing Component got unmounted');
        loaderDispatch({type: 'HIDE_LOADER'});
      }
    };
  }, []);

  useEffect(() => {
    console.log('UPDATE');
  }, [state]);

  const store = {
    state: state.alarm_list,
    isLoad: state.isLoad,
    submitAction: submitAction,
    AsyncDispatch: AsyncDispatch,
  };

  return (
    <AlarmSettingContext.Provider value={store}>
      <AlarmSettingDispatchContext.Provider value={dispatch}>
        {children}
      </AlarmSettingDispatchContext.Provider>
    </AlarmSettingContext.Provider>
  );
};

export const useAlarmSettingState = () => {
  const state = useContext(AlarmSettingContext);
  if (!state) throw new Error('Cannot find AlarmSettingProvider');
  return state;
};

export const useAlarmSettingDispatch = () => {
  const state = useContext(AlarmSettingContext);
  if (!state) throw new Error('Cannot find AlarmSettingProvider');
  return state.AsyncDispatch;
};

// export const useAlarmSettingDispatch = () => {
//   const dispatch = useContext(AlarmSettingDispatchContext);
//   if (!dispatch) throw new Error('Cannot find AlarmSettingProvider');
//   return dispatch;
// };
