import React, {useState, useEffect} from 'react';
import {ToastAndroid, Platform, AlertIOS} from 'react-native';

export const toastAlert = (msg: string) => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    AlertIOS.alert(msg);
  }
};
