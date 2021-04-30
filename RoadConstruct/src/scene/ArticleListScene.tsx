import React from 'react';
import {View} from 'react-native';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

// MOLECULE
import TopTabMenu from '~/molecule/TopTabMenu';
import ArticleFilter from '~/molecule/ArticleFilter';

// ORGANISM
import ArticleFlatList from '~/organism/ArticleFlatList';

// STORE
import {ArticleListProvider} from '~/store/ArticleListStore';

const ListSection = ({children}) => {
  return <View style={{marginBottom: 15}}>{children}</View>;
};

const ArticleListScene = ({route}: {route?: any}) => {
  const initSi = route?.params?.initSi;

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
