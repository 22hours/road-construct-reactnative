import React, {useState, useEffect, useContext, useCallback} from 'react';
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
import {useLocationData} from '~/store/AppGlobalStore';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
import GlobalEnum from '~/GlobalEnum';
import Typho from '~/Typho';
import Color from '~/Color';
type Props = {};

const SiBox = ({si, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress(si)} style={ST.sibox_container}>
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
  const locationData = useLocationData();

  const handleClickItem = si => {
    navigation.navigate(GlobalEnum.Route.ARTICLE_LIST, {initSi: si});
  };
  return (
    <SceneLayout isScrollAble={true}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {locationData?.si_list?.map(it => (
          <SiBox key={it} si={it} onPress={handleClickItem} />
        ))}
      </View>
    </SceneLayout>
  );
};

const ST = StyleSheet.create({
  sibox_container: {
    width: '30%',
    marginHorizontal: '1.5%',
    backgroundColor: Color.MAIN_SCENE.ITEM_BACK,
    borderRadius: 5,

    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // aspectRatio: 1,
  },
  sibox_new_text: {
    color: Color.MAIN_SCENE.NEW_TEXT,
    fontSize: 10,
  },
  sibox_si_text: {},
});

export default MainScene;
