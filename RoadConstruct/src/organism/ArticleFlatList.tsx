import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

// HOOKS
import {useAsync} from '~/Hooks';

// ENUM
import GlobalEnum from '~/GlobalEnum';

// MOLEUCULES
import ArticleListItem from '~/molecule/ArticleListItem';
import Typho from '~/Typho';

type Select = '지자체' | '정부' | '언론' | '내 관심' | '지도보기';
type Props = {
  state: Select;
};

const getTabCountData = async (state): Promise<string> => {
  const rest_data = await axios.get('https://api.androidhive.info/contacts/');
  return rest_data?.data;
};

const ArticleFlatList = React.memo(({state}: Props) => {
  const {execute, status, value, error} = useAsync<string>(
    useCallback(() => getTabCountData(state), [state]),
    [state],
    true,
  );
  const dummyItemProp = {
    step: '의견 청취',
    title: '경기도 남양주시 (2021.02.26)',
    content:
      '도시관리계획(도로:소로2-266) 결정(안) 입안 및 주민공람-공고 계획보고',
  };
  const navigation = useNavigation();
  const dispatch = useCallback((type: string, param?: any) => {
    switch (type) {
      case 'VIEWMORE': {
        break;
      }
      case 'OPENDETAIL': {
        navigation.navigate(GlobalEnum.Route.ARTICLE_DETAIL, {id: param.id});
        break;
      }
      default:
        return;
    }
  }, []);
  return (
    <View>
      {['idle', 'pending'].indexOf(status) !== -1 && (
        <>
          {[1, 2, 3, 4, 5].map(it => (
            <>
              <ArticleListItem key={it} dispatch={dispatch} isSkeleton={true} />
            </>
          ))}
        </>
      )}
      {status === 'success' && (
        <ArticleListItem {...dummyItemProp} dispatch={dispatch} />
      )}
      {status === 'error' && (
        <>
          <Typho
            type={'CAPTION'}
            text={'에러가 발생하였습니다'}
            extraStyle={{textAlign: 'center', marginTop: 10, fontSize: 15}}
          />
          <Typho
            type={'CAPTION'}
            text={'다시 시도해 주세요'}
            extraStyle={{textAlign: 'center', marginTop: 10, fontSize: 20}}
          />
        </>
      )}
      <View>
        <Typho
          type={'CAPTION'}
          text={'더 이상 소식이 없습니다'}
          extraStyle={{textAlign: 'center', marginTop: 10}}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({});

export default ArticleFlatList;
