import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

type MainProps = {
  children?: JSX.Element | JSX.Element[] | undefined;
};

const SceneLayout = ({children}: MainProps) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default SceneLayout;
