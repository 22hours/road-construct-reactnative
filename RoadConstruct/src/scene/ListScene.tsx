import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
// LAYOUT
import SceneHeader from '~/layout/SceneHeader';
import SceneLayout from '~/layout/SceneLayout';

const ListScene = () => {
  return (
    <>
      <SceneHeader />
      <SceneLayout>
        <Text>HI</Text>
      </SceneLayout>
    </>
  );
};

const styles = StyleSheet.create({});
export default ListScene;
