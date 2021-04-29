import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useMemo,
} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// GLOBAL CONFIGS
import {meta_types} from '@global_types';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

// MOLECULE
import TopTabMenu from '~/molecule/TopTabMenu';
import ArticleFilter from '~/molecule/ArticleFilter';

// ORGANISM
import ArticleFlatList from '~/organism/ArticleFlatList';
import {
  ArticleListProvider,
  useArticleListStoreDispatch,
  useArticleListStoreState,
} from '~/store/ArticleListStore';

const ListSection = ({children}) => {
  return <View style={{marginBottom: 15}}>{children}</View>;
};

const ArticleListScene = ({route}: {route?: any}) => {
  const initSi = route?.params?.initSi;
  console.log(initSi);
  console.log(initSi || '서울시');
  return (
    <ArticleListProvider initSi={initSi}>
      <SceneLayout>
        <ListSection>
          <TopTabMenu />
        </ListSection>
        <ListSection>
          <ArticleFilter />
        </ListSection>
        <ListSection>
          <ArticleFlatList />
        </ListSection>
      </SceneLayout>
    </ArticleListProvider>
  );
};

export default ArticleListScene;
