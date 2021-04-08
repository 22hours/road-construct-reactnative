import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Typho from '~/Typho';
import Color from '~/Color';

type ItemProps = {
  id?: string;
  step?: string;
  title?: string;
  content?: string;
  dispatch: (type: string, param?: any) => void;
  isSkeleton?: Boolean;
};

const SekeltonItem = React.memo(() => {
  return (
    <SkeletonPlaceholder>
      <View style={[ST.container, {elevation: 0}]}></View>
    </SkeletonPlaceholder>
  );
});
const ArticleListItem = React.memo((props: ItemProps) => {
  if (props.isSkeleton) {
    return <SekeltonItem />;
  }
  return (
    <View style={ST.container}>
      <View>
        <TouchableOpacity onPress={() => props.dispatch('VIEWMORE')}>
          <Text style={ST.steppannel_top}>
            <Typho
              type={'LABEL'}
              text={'진행 상황'}
              extraStyle={{color: 'white'}}
            />
          </Text>
          <Text style={ST.steppannel_bottom}>
            <Typho
              type={'LABEL'}
              text={props.step}
              extraStyle={{color: 'white'}}
            />
          </Text>
          <Typho
            type={'LABEL'}
            text={'더 보기'}
            extraStyle={{
              marginTop: 5,
              color: 'gray',
              textAlign: 'center',
              fontSize: 12,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => props.dispatch('OPENDETAIL', {id: props.id})}
        style={ST.container_right}>
        <Typho type={'H4'} text={props.title} />
        <Typho type={'H5'} text={props.content} extraStyle={{marginTop: 10}} />
      </TouchableOpacity>
    </View>
  );
});

const ST = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    elevation: 10,
    minHeight: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    flexDirection: 'row',
    marginBottom: 15,
  },
  steppannel_top: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Color.SECONDARY,
    marginBottom: 5,
    borderRadius: 1,
  },
  steppannel_bottom: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Color.THIRD,
    borderRadius: 1,
  },
  container_right: {
    marginLeft: 15,
    flex: 1,
  },
});

export default ArticleListItem;
