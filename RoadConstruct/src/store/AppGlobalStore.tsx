import React, {
  useState,
  useEffect,
  Dispatch,
  useReducer,
  useContext,
} from 'react';

import {API_CALL} from '~/api';
import {useLoader} from './AppGlobalLoadingStore';
import SplashScreen from 'react-native-splash-screen';
import {Alert, BackHandler} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toastAlert} from '~/util';

// ELEMENT TYPES

// STATE TYPES
type ContextState = {
  alarmed_data: Array<{
    si: string;
    gu_list: Array<{gu: string; alarmed?: boolean}>;
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
    const rest_data = await API_CALL('get', 'MAIN_DOCS', 'LOCATION_LIST');
    loaderDispatch({type: 'HIDE_LOADER'});
    SplashScreen.hide();

    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        setInitData(rest_data.data);
        await AsyncStorage.setItem('LOCATION', JSON.stringify(rest_data.data));
      } else {
        const local_data = await AsyncStorage.getItem('LOCATION');
        toastAlert('??????????????? ???????????? ???????????????');
        try {
          if (local_data) {
            setInitData(JSON.parse(local_data));
          } else {
            Alert.alert(
              '?????? ?????? ??????',
              '?????? ?????? ???????????? ??????????????? ?????????????????????.\n????????? ????????? ???????????? ???, ?????? ?????????????????? ????????????.',
              [{text: '????????????', onPress: () => BackHandler.exitApp()}],
            );
          }
        } catch {
          Alert.alert(
            '?????? ?????? ??????',
            '?????? ?????? ???????????? ??????????????? ?????????????????????.\n????????? ????????? ???????????? ???, ?????? ?????????????????? ????????????.',
            [{text: '????????????', onPress: () => BackHandler.exitApp()}],
          );
        }
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
