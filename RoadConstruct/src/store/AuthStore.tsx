import React, {
  useEffect,
  Dispatch,
  createContext,
  useReducer,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
import {Alert} from 'react-native';
import {API_CALL} from '~/api';

// STATE TYPES
type State = {};

// ACTION TYPES
type Action = {type: 'SET_ID'; data: string};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const AuthContext = React.createContext<State | null>(null);
const AuthDispatchContext = createContext<ContextDispatch | null>(null);

// REDUCER
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_ID': {
      AsyncStorage.setItem('ID', action.data);
      return action.data;
    }
    default:
      return '';
  }
};

export const AuthProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {});

  const getAuthInfo = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const deviceId = DeviceInfo.getUniqueId();
      const fcmToken = await messaging().getToken();

      const rest_data = await API_CALL('post', 'MAIN_HOST', 'AUTH', undefined, {
        device_id: deviceId,
        fcm_token: fcmToken,
        fcm_flag: true,
      });
      if (rest_data) {
        if (rest_data.result === 'SUCCESS') {
          const user_id = rest_data.data;
          dispatch({type: 'SET_ID', data: user_id});
        }
      }
    } else {
      Alert.alert(
        '권한 동의',
        '도로 신설 소식 어플리케이션을 정상 작동하기 위해선 알림 권한이 필요합니다',
      );
    }
  };

  const isAuthInfoExist = async () => {
    const id = await AsyncStorage.getItem('ID');
    if (id === null) {
      // ID 없음
      getAuthInfo();
    } else {
      console.log('id exitst : ', {id});
    }
  };

  useEffect(() => {
    // AsyncStorage.removeItem('ID');
    isAuthInfoExist();
  }, []);
  return (
    <AuthContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuthStore = () => {
  const state = useContext(AuthContext);
  if (!state) throw new Error('Cannot find AuthProvider');
  return state;
};

export const useStoreDispatch = () => {
  const dispatch = useContext(AuthDispatchContext);
  if (!dispatch) throw new Error('Cannot find AuthProvider');
  return dispatch;
};
