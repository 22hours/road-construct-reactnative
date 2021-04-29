import {api_types} from '@global_types';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Color from '~/Color';
import Typho from '~/Typho';

type Props = api_types.media_list_item;

const MediaListItem = (props: Props) => {
  return (
    <TouchableOpacity style={ST.container}>
      <View style={ST.left}>
        <Typho type={'H4'} text={props.title} extraStyle={{marginBottom: 10}} />
        <View style={{flexDirection: 'row'}}>
          <Typho
            type={'LABEL'}
            text={props.author}
            extraStyle={{marginRight: 10}}
          />
          <Typho type={'CAPTION'} text={props.create_date} />
        </View>
      </View>
      <View style={ST.right}>
        <FastImage source={{uri: props.thumbnail_uri}} style={ST.thumbnail} />
      </View>
    </TouchableOpacity>
  );
};

const ST = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: Color.LIST_SCENE.BORDER,
    borderWidth: 1,
    marginBottom: 5,
  },
  left: {flex: 1, padding: 5},

  right: {},
  thumbnail: {
    width: 100,
    height: 100,
  },
});

export default MediaListItem;
