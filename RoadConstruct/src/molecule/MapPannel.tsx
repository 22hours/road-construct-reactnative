import React, {useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Color from '~/Color';
import Typho from '~/Typho';

type mapType = 'normal' | 'hybrid' | 'terrain';
type Props = {
  mapType: mapType;
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
  const panel_list: Array<{
    label_text: string;
    map_type: mapType;
    onPress: () => void;
  }> = [
    {
      label_text: '지도',
      map_type: 'normal',
      onPress: useCallback(() => setMapType('normal'), []),
    },
    {
      label_text: '위성',
      map_type: 'hybrid',
      onPress: useCallback(() => setMapType('hybrid'), []),
    },
    {
      label_text: '지형도',
      map_type: 'terrain',
      onPress: useCallback(() => setMapType('terrain'), []),
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
    textAlign: 'center',
  },
  panel_button__text_on: {
    color: 'white',
  },
});

export default MapPannel;
