import React, {useEffect} from 'react';
import {
  SafeAreaView,
  PermissionsAndroid,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import {AppGlobalProvider} from '~/store/AppGlobalStore';

import Router from '~/Router';
import {AppGlobalLoadingProvider} from '~/store/AppGlobalLoadingStore';
import GlobalLoader from '~/organism/GlobalLoader';

import {AuthProvider} from '~/store/AuthStore';

const MemoizedRouter = React.memo(() => <Router />);

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the STROAGE');
    } else {
      Alert.alert(
        '저장공간 권한 실패',
        '이 앱은 저장공간 권한이 없을 경우 정상적으로 동작하지 않습니다\n앱을 다시 실행시켜 권한을 승인해주세요',
        [
          {
            text: 'OK',
            onPress: () => BackHandler.exitApp(),
          },
        ],
      );
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => {
  const checkGrant = () => {
    requestStoragePermission();
  };

  useEffect(() => {
    checkGrant();
  }, []);
  return (
    <AuthProvider>
      <AppGlobalLoadingProvider>
        <AppGlobalProvider>
          <SafeAreaView style={{flex: 1}}>
            <View style={{flex: 1}}>
              <MemoizedRouter />
              <GlobalLoader />
            </View>
          </SafeAreaView>
        </AppGlobalProvider>
      </AppGlobalLoadingProvider>
    </AuthProvider>
  );
};

export default App;
