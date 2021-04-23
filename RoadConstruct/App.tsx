import React, {useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {AppGlobalProvider} from '~/store/AppGlobalStore';

import Router from '~/Router';

const App = () => {
  return (
    <AppGlobalProvider>
      <SafeAreaView style={{flex: 1}}>
        <Router />
      </SafeAreaView>
    </AppGlobalProvider>
  );
};

export default App;
