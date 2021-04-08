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

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

// MOLECULE
import TopTabMenu from '~/molecule/TopTabMenu';
import ArticleSearchBar from '~/molecule/ArticleSearchBar';

// ORGANISM
import ArticleFlatList from '~/organism/ArticleFlatList';

type State = {
  select: Select;
  article_data: [];
};
type Select = '지자체' | '정부' | '언론' | '내 관심' | '지도보기';

const ListSection = ({children}) => {
  return <View style={{marginBottom: 15}}>{children}</View>;
};

const ArticleListScene = () => {
  type Action = {type: 'SELECT_CHANGE'; value: Select} | {type: 'RELOAD_LIST'};
  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'SELECT_CHANGE': {
        if (state.select !== action.value) {
          return {
            ...state,
            select: action.value,
          };
        } else {
          return state;
        }
      }
      case 'RELOAD_LIST': {
      }
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    select: '지자체',
    article_data: [],
  });

  const setMenuState = useCallback(
    (value: Select) => dispatch({type: 'SELECT_CHANGE', value: value}),
    [],
  );

  return (
    <SceneLayout>
      <ListSection>
        <TopTabMenu state={state.select} setState={setMenuState} />
      </ListSection>
      <ListSection>
        <ArticleSearchBar state={state.select} />
      </ListSection>
      <ListSection>
        <ArticleFlatList state={state.select} />
      </ListSection>
    </SceneLayout>
  );
};

export default ArticleListScene;
