import React, {useEffect, useRef} from 'react';
import {SafeAreaView, View} from 'react-native';
import {AppGlobalProvider} from '~/store/AppGlobalStore';

import Router from '~/Router';
import {AppGlobalLoadingProvider} from '~/store/AppGlobalLoadingStore';
import GlobalLoader from '~/organism/GlobalLoader';

import {AuthProvider} from '~/store/AuthStore';

const MemoizedRouter = React.memo(() => <Router />);

const App = () => {
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
