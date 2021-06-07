import {api_types} from '@global_types';
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import FastImage from 'react-native-fast-image';
import Color from '~/Color';
import {useTime} from '~/Hooks';
import Typho from '~/Typho';
import {toastAlert} from '~/util';

type Props = api_types.media_list_item;

const MediaListItem = (props: Props) => {
  const time = useTime(props.create_date);
  const RenderImage = () => {
    let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (regex.test(props.thumbnail_uri)) {
      return (
        <FastImage source={{uri: props.thumbnail_uri}} style={ST.thumbnail} />
      );
    } else {
      return <></>;
    }
  };
  return (
    <TouchableOpacity
      style={ST.container}
      onPress={() => {
        if (props.media_link) {
          Linking.openURL(props.media_link)
            .then(() => {})
            .catch(() => {
              toastAlert(
                '해당 링크는 정상적이지 않습니다\n관리자에게 문의하세요',
              );
            });
        } else {
          toastAlert('해당 링크는 정상적이지 않습니다\n관리자에게 문의하세요');
        }
      }}>
      <View style={ST.left}>
        <Typho type={'H4'} text={props.title} extraStyle={{marginBottom: 10}} />
        <View style={{flexDirection: 'row'}}>
          <Typho
            type={'LABEL'}
            text={props.site_name}
            extraStyle={{marginRight: 10}}
          />
          <Typho
            type={'LABEL'}
            text={props.author}
            extraStyle={{marginRight: 10}}
          />
          <Typho type={'CAPTION'} text={time.toString()} />
        </View>
      </View>
      <View style={ST.right}>
        <RenderImage />
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
