import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import Color from '~/Color';
import Typho from '~/Typho';

type Props = {
  mapType: number;
  setMapType: (param: any) => void;
  isCadastralLayerVisible: boolean;
  toggleCadastralLayerVisible: () => void;
};

const MapPannel = ({
  mapType,
  setMapType,
  isCadastralLayerVisible,
  toggleCadastralLayerVisible,
}: Props) => {
  const panel_list = [
    {
      label_text: '지도',
      map_type: 0,
      onPress: () => setMapType(0),
    },
    {
      label_text: '위성',
      map_type: 2,
      onPress: () => setMapType(2),
    },
    {
      label_text: '지적도',
      map_type: 4,
      onPress: () => setMapType(4),
    },
  ];
  return (
    <>
      <View style={ST.container}>
        {panel_list.map((it, idx) => {
          return (
            <TouchableOpacity
              style={[
                ST.panel_button,
                it.map_type === mapType && ST.panel_button_on,
              ]}
              onPress={() => it.onPress()}
              key={`MAPTYPEPANEL_${idx}`}>
              <Typho
                type={'LABEL'}
                text={it.label_text}
                extraStyle={[
                  ST.panel_button__text,
                  it.map_type === mapType && ST.panel_button__text_on,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={ST.cadastral_container}>
        <TouchableOpacity
          style={[
            ST.panel_button,
            isCadastralLayerVisible && ST.panel_button_on,
          ]}
          onPress={() => toggleCadastralLayerVisible()}>
          <Typho
            type={'LABEL'}
            text={'지적편집도'}
            extraStyle={[
              ST.panel_button__text,
              isCadastralLayerVisible && ST.panel_button__text_on,
            ]}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const ST = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 11,
    top: 10,
    left: 20,
    zIndex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  cadastral_container: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 11,
    top: 10,
    right: 20,
    zIndex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  panel_button: {
    padding: 10,
  },
  panel_button_on: {
    backgroundColor: Color.COMMON.PRIMARY,
  },
  panel_button__text: {
    color: 'black',
  },
  panel_button__text_on: {
    color: 'white',
  },
});

export default MapPannel;
