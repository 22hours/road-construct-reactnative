import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Color from '~/Color';
import Typho from '~/Typho';

// HOOKS
import {useAsync} from '~/Hooks';
import axios from 'axios';
import GlobalEnum from '~/GlobalEnum';

type Select = '지자체' | '정부' | '언론' | '내 관심' | '지도보기';
type Props = {
  state: Select;
  setState: (value: Select) => void;
};

const getTabCountData = async (): Promise<string> => {
  const rest_data = await axios.get('https://api.androidhive.info/contacts/');
  return rest_data?.data;
};

// USE IN ARTICLE LIST SCENE
const TopTabMenu = React.memo(({state, setState}: Props) => {
  const {execute, status, value, error} = useAsync<string>(
    getTabCountData,
    [],
    false,
  );
  const navigation = useNavigation();

  const select_list: Array<Select> = [
    '지자체',
    '정부',
    '언론',
    '내 관심',
    '지도보기',
  ];

  return (
    <View style={ST.container}>
      {select_list.map((it: Select) => {
        var isSelected = it === state;
        var textStyle = isSelected ? ST.tab_item__text_on : undefined;
        return (
          <TouchableOpacity
            style={[ST.tab_item, isSelected && ST.tab_item_on]}
            key={it}
            onPress={() => {
              if (it === '지도보기') {
                navigation.navigate(GlobalEnum.Route.MAP_SCENE, {
                  type: 'ARTICLE_LIST',
                });
              } else {
                setState(it);
              }
            }}>
            <Typho
              type={'LABEL'}
              text={it}
              extraStyle={[ST.tab_item__text, textStyle]}
            />
            {it !== '지도보기' && (
              <Typho
                type={'H3'}
                text={'12'}
                extraStyle={[ST.tab_item__text, textStyle]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

const ST = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 2,
    overflow: 'hidden',
  },
  tab_item: {
    width: '20%',
    padding: 10,
    justifyContent: 'center',
  },
  tab_item_on: {
    backgroundColor: Color.PRIMARY,
  },
  tab_item__text: {
    color: 'gray',
    textAlign: 'center',
  },
  tab_item__text_on: {
    color: 'white',
  },
});

export default TopTabMenu;
