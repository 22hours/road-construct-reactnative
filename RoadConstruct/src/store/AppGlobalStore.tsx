import React, {
  useState,
  useEffect,
  Dispatch,
  useReducer,
  useContext,
} from 'react';

import {useAsync} from '~/Hooks';
import {API_CALL} from '~/api';
import {useLoader} from './AppGlobalLoadingStore';
import SplashScreen from 'react-native-splash-screen';
import {Alert, BackHandler} from 'react-native';

// ELEMENT TYPES

// STATE TYPES
type ContextState = {
  alarmed_data: Array<{
    si: string;
    gu_list: Array<{gu: string; alarmed?: Boolean}>;
  }>;
  origin_data: Array<{
    si: string;
    gu_list: Array<string>;
  }>;
  si_list: Array<any>;
};

// ACTIONS TYPES
type Action =
  | {type: 'FETCH_LOCATION'}
  | {type: 'SET_LOCATION'; data: Array<any>};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const AppGlobalContext = React.createContext<ContextState | null>(null);

// REDUCER
const reducer = (state: ContextState, action: Action): ContextState => {
  switch (action.type) {
    case 'SET_LOCATION':
      var res = {
        alarmed_data: action.data.map(first_it => {
          var si = first_it.si;
          var gu_list = first_it.gu_list.map(second_it => {
            var gu = second_it;
            var alarmed = false;
            return {
              gu: gu,
              alarmed: alarmed,
            };
          });
          return {
            si: si,
            gu_list: gu_list,
          };
        }),
        origin_data: action.data,
        si_list: action.data.map(it => it.si),
      };
      SplashScreen.hide();
      return res;
    default:
      throw new Error('Unhandled action');
  }
};

export const AppGlobalProvider = ({children}: {children: React.ReactNode}) => {
  const loaderDispatch = useLoader();
  const [initData, setInitData] = useState();
  const [locationData, dispatch] = useReducer(reducer, {
    alarmed_data: [],
    origin_data: [],
    si_list: [],
  });

  const getLocationInitData = async () => {
    loaderDispatch({type: 'SHOW_LOADER'});
    const rest_data = await API_CALL('get', 'MAIN_HOST', 'LOCATION_LIST');
    loaderDispatch({type: 'HIDE_LOADER'});

    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        setInitData(rest_data.data);
      } else {
        Alert.alert(
          '서버 연결 오류',
          '초기 구성 데이터를 받아오는데 실패하였습니다.\n인터넷 환경을 확인하신 뒤, 다시 시도해주시기 바랍니다.',
          [{text: '종료하기', onPress: () => BackHandler.exitApp()}],
        );
      }
    }
  };

  useEffect(() => {
    if (initData) {
      dispatch({type: 'SET_LOCATION', data: initData});
      loaderDispatch({type: 'HIDE_LOADER'});
    }
  }, [initData]);

  useEffect(() => {
    getLocationInitData();
  }, []);
  return (
    <AppGlobalContext.Provider value={locationData}>
      {locationData && children}
    </AppGlobalContext.Provider>
  );
};

export const useLocationData = () => {
  const state = useContext(AppGlobalContext);
  if (!state) throw new Error('Cannot find SampleProvider');
  return state;
};
