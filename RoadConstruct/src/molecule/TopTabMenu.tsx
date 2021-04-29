import React, {useState, useEffect, useReducer, useCallback} from 'react';
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

// GLOBAL CONFIGS
import {api_types, meta_types} from '@global_types';
import GlobalEnum from '~/GlobalEnum';
import {
  useArticleListStoreDispatch,
  useArticleListStoreState,
} from '~/store/ArticleListStore';
import {API_CALL} from '~/api';
import {useAsync} from '~/Hooks';

type Select = meta_types.list_scene__tab_type;
const select_list: Array<Select> = ['지자체', '언론', '내 관심'];

const TopTabMenu = () => {
  const pageState = useArticleListStoreState('TOPTAB');
  const pageDispatch = useArticleListStoreDispatch();

  const setPageTab = useCallback(data => {
    pageDispatch({type: 'SET_TAB', data: data});
  }, []);

  const navigation = useNavigation();

  const getTabCount = async () => {
    return await API_CALL(
      'get',
      'MAIN_HOST',
      'ARTICLE COUNT',
      undefined,
      pageState.filter,
    );
  };

  const {value} = useAsync(getTabCount, [pageState.filter]);

  const switchTabCount = (kor_tab_name: Select) => {
    switch (kor_tab_name) {
      case '지자체':
        return value?.local_count | 0;
      case '언론':
        return value?.media_count | 0;
      case '내 관심':
        return value?.starred_count | 0;
      default:
        throw new Error('SWITCH TAB COUNT ERROR');
    }
  };

  return (
    <View style={ST.container}>
      {select_list.map((it: Select) => {
        var isSelected = it === pageState.nowTab;
        var textStyle = isSelected ? ST.tab_item__text_on : undefined;
        return (
          <TouchableOpacity
            style={[ST.tab_item, isSelected && ST.tab_item_on]}
            key={it}
            onPress={() => {
              setPageTab(it);
            }}>
            <Typho
              type={'LABEL'}
              text={it}
              extraStyle={[ST.tab_item__text, textStyle]}
            />
            <Typho
              type={'H3'}
              text={switchTabCount(it).toString()}
              extraStyle={[ST.tab_item__text, textStyle]}
            />
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(GlobalEnum.Route.MAP_SCENE, {
            type: 'ARTICLE_LIST',
          });
        }}
        style={[ST.tab_item, ST.map_item_box]}>
        <Typho
          type={'LABEL'}
          text={'지도보기'}
          extraStyle={[ST.tab_item__text, ST.map_item__text]}
        />
      </TouchableOpacity>
    </View>
  );
};

const ST = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    borderRadius: 2,
    overflow: 'hidden',
  },
  tab_item: {
    width: '20%',
    padding: 10,
    justifyContent: 'center',
    borderRadius: 5,
  },
  tab_item_on: {
    backgroundColor: Color.LIST_SCENE.TAB_ON,
  },
  tab_item__text: {
    color: 'gray',
    textAlign: 'center',
  },
  tab_item__text_on: {
    color: 'black',
  },
  map_item_box: {
    backgroundColor: Color.LIST_SCENE.TAB_MAP,
  },
  map_item__text: {
    color: 'white',
  },
});

export default TopTabMenu;
