import {ToastAndroid} from 'react-native';

export const toastAlert = (msg: string) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};
