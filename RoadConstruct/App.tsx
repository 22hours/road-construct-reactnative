import React, {useEffect, useRef} from 'react';
import {SafeAreaView} from 'react-native';

import Router from '~/Router';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      {/* <ListScene /> */}
      <Router />
    </SafeAreaView>
  );
};

export default App;
