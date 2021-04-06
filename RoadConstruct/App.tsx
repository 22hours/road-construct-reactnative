import React, {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

// LAYOUT
import SceneHeader from '~/layout/SceneHeader';
import SceneLayout from '~/layout/SceneLayout';

// SCENE
import ListScene from '~/scene/ListScene';

// ATOM
import AddressText from '~/molecule/AddressText';

// TEST
import PdfViewer from '~/organism/PdfViewer';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ListScene />
    </SafeAreaView>
  );
};

export default App;
