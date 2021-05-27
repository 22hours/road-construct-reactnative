import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

type MainProps = {
  children?: JSX.Element | JSX.Element[] | undefined;
  isScrollAble?: Boolean;
};

const SceneLayout = ({children, isScrollAble}: MainProps) => {
  return (
    <>
      {isScrollAble ? (
        <ScrollView style={{backgroundColor: 'white', flex: 1}}>
          <SafeAreaView style={styles.container}>{children}</SafeAreaView>
        </ScrollView>
      ) : (
        <SafeAreaView style={styles.container}>{children}</SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
});

export default SceneLayout;
