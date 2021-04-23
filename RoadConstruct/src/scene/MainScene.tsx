import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// STORE
import {AppGlobalContext} from '~/store/AppGlobalStore';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
import GlobalEnum from '~/GlobalEnum';
import Typho from '~/Typho';
import Color from '~/Color';
type Props = {};

const SiBox = ({si}) => {
  return (
    <TouchableOpacity style={ST.sibox_container}>
      <Typho
        type={'SECTION_HEADER'}
        text={'NEW'}
        extraStyle={ST.sibox_new_text}
      />
      <Typho type={'H5'} text={si} extraStyle={ST.sibox_si_text} />
    </TouchableOpacity>
  );
};

const MainScene = (props: Props) => {
  const navigation = useNavigation();
  const {state} = useContext(AppGlobalContext);
  return (
    <SceneLayout isScrollAble={true}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          //   justifyContent: 'space-between',
        }}>
        {state?.si_list?.map(it => (
          <SiBox key={it} si={it} />
        ))}
      </View>
    </SceneLayout>
  );
};

const ST = StyleSheet.create({
  sibox_container: {
    width: '30%',
    marginHorizontal: '1.5%',
    backgroundColor: 'white',
    elevation: 11,
    borderRadius: 5,

    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 15,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
  sibox_new_text: {
    color: Color.PRIMARY,
    fontSize: 10,
  },
  sibox_si_text: {},
});

export default MainScene;
