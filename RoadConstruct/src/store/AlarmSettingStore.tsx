import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import React, {
  useState,
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
let axiosSource = axios.CancelToken.source();

// ELEMENT TYPES

// STATE TYPES
type State = Array<{
  si: string;
  gu_list: Array<{gu: string; alarmed?: boolean}>;
}>;

// ACTION TYPES
type Action =
  | {type: 'INIT'; data: State}
  | {type: 'ADD_SI'; data: {target_si: string; isAllAlaremd: boolean}}
  | {type: 'REMOVE_SI'; data: {target_si: string; isAllAlaremd: boolean}}
  | {type: 'ADD_GU'; data: {target_si: string; target_gu: string}}
  | {type: 'REMOVE_GU'; data: {target_si: string; target_gu: string}};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const AlarmSettingContext = React.createContext<{
  state: State;
  submitAction: () => any;
} | null>(null);
const AlarmSettingDispatchContext = createContext<ContextDispatch | null>(null);

// REDUCER
const toggleSi = (target_si: string, isAllAlaremd: boolean, state: State) => {
  var res_list = state.slice();
  var target_si_idx = state.findIndex(it => it.si === target_si);
  if (target_si_idx !== -1) {
    res_list[target_si_idx].gu_list = res_list[target_si_idx].gu_list.map(
      gu_it => {
        return {
          gu: gu_it.gu,
          alarmed: isAllAlaremd ? false : true,
        };
      },
    );
    return res_list;
  } else {
    return state;
  }
};
const toggleSiGu = (target_si: string, target_gu: string, state: State) => {
  var res_list = state.slice();
  var target_si_idx = state.findIndex(it => it.si === target_si);
  if (target_si_idx !== -1) {
    var cur_si_item = state[target_si_idx];
    var cur_gu_list = cur_si_item.gu_list;
    var target_gu_idx = cur_gu_list.findIndex(it => it.gu === target_gu);

    if (target_gu_idx !== -1) {
      res_list[target_si_idx].gu_list[target_gu_idx].alarmed = !res_list[
        target_si_idx
      ].gu_list[target_gu_idx].alarmed;
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
      case 'INIT': {
        return action.data;
      }
      case 'ADD_GU': {
        var {target_si, target_gu} = action.data;
        var res = toggleSiGu(target_si, target_gu, state);
        return res;
      }
      case 'REMOVE_GU': {
        var {target_si, target_gu} = action.data;
        var res = toggleSiGu(target_si, target_gu, state);
        return res;
      }
      case 'ADD_SI': {
        var {target_si, isAllAlaremd} = action.data;
        var res = toggleSi(target_si, isAllAlaremd, state);
        return res;
      }
      case 'REMOVE_SI': {
        var {target_si, isAllAlaremd} = action.data;
        var res = toggleSi(target_si, isAllAlaremd, state);
        return res;
      }
      default:
        throw new Error('ALARM SETTING REUCDER ERROR OCCURED');
    }
  };
  const naviagtion = useNavigation();
  const location = useLocationData();
  const [state, dispatch] = useReducer(reducer, []);

  const submitAction = async () => {
    loaderDispatch({type: 'SHOW_LOADER'});
    setTimeout(() => {
      submitRealAction();
    }, 2000);
  };

  const submitRealAction = async () => {
    var request_obj: Array<{si: string; gu: string}> = [];
    state.forEach(first_it => {
      first_it.gu_list.forEach(second_it => {
        if (second_it.alarmed) {
          request_obj.push({si: first_it.si, gu: second_it.gu});
        }
      });
    });
    console.log(request_obj);
    setTimeout(() => {
      loaderDispatch({type: 'HIDE_LOADER'});
      toastAlert('설정 완료');
      naviagtion.goBack();
    }, 1500);
  };
  const init = async () => {
    loaderDispatch({type: 'SHOW_LOADER'});
    var rest_data = await API_CALL(
      'get',
      'MAIN_HOST',
      'USER_ALARMED_LOCATION_LIST',
      undefined,
      {},
    );
    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        var api_response_list: Array<{
          si: string;
          gu: string;
        }> = rest_data.data.slice();

        var res_list: State = location.alarmed_data.slice();

        api_response_list.forEach((item, idx) => {
          var cur_si = item.si;
          var cur_gu = item.gu;

          var siIdx = res_list?.findIndex(it => it.si === cur_si);

          if (siIdx !== -1) {
            var cur_first_item = res_list[siIdx];
            var guIdx = cur_first_item.gu_list.findIndex(
              it => it.gu === cur_gu,
            );
            if (guIdx !== -1) {
              cur_first_item.gu_list[guIdx].alarmed = true;
            }
          }
        });
        loaderDispatch({type: 'HIDE_LOADER'});
        dispatch({type: 'INIT', data: res_list});
      }
    }
  };

  useEffect(() => {
    init();
    return () => {
      if (axiosSource) {
        axiosSource.cancel('Landing Component got unmounted');
        loaderDispatch({type: 'HIDE_LOADER'});
      }
    };
  }, []);

  const store = {
    state: state,
    submitAction: submitAction,
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
  const dispatch = useContext(AlarmSettingDispatchContext);
  if (!dispatch) throw new Error('Cannot find AlarmSettingProvider');
  return dispatch;
};
