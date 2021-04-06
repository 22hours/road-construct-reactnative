import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Typho from '~/Typho';

const SceneHeader = () => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={['#1E3C72', '#2A5298']}
      style={[styles.linearGradient, styles.container]}>
      <Typho type={'H1'} text={'도로개발소식'} extraStyle={styles.buttonText} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    elevation: 7,
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonText: {
    color: 'white',
  },
});

export default SceneHeader;
