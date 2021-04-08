import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import BorderMap from '~/organism/BorderMap';
// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
type Props = {};

const MapScene = (props: Props) => {
  return <BorderMap />;
};

const styles = StyleSheet.create({});

export default MapScene;
