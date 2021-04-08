import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Typho from '~/Typho';

type Props = {
  scene?: any;
  previous?: any;
  navigation?: any;
};

const SceneHeader = (props: Props) => {
  return (
    <>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#1E3C72', '#2A5298']}
        style={[styles.linearGradient, styles.container]}>
        <Typho
          type={'H3'}
          text={'도로개발소식'}
          extraStyle={styles.buttonText}
        />
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    elevation: 7,
    flexDirection: 'row',
    alignItems: 'center',
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
