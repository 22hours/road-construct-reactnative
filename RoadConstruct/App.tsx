import React, {useEffect, useRef} from 'react';
import {SafeAreaView, View} from 'react-native';
import {AppGlobalProvider} from '~/store/AppGlobalStore';

import Router from '~/Router';
import {AppGlobalLoadingProvider} from '~/store/AppGlobalLoadingStore';
import GlobalLoader from '~/organism/GlobalLoader';

const MemoizedRouter = React.memo(() => <Router />);

const App = () => {
  return (
    <AppGlobalProvider>
      <AppGlobalLoadingProvider>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1}}>
            <MemoizedRouter />
            <GlobalLoader />
          </View>
        </SafeAreaView>
      </AppGlobalLoadingProvider>
    </AppGlobalProvider>
  );
};

export default App;
