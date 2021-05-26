import React, {useEffect, useReducer} from 'react';
import {View, FlatList} from 'react-native';

import {api_types, meta_types} from '@global_types';
import {API_CALL} from '~/api';

// STORE
import {useArticleListStoreState} from '~/store/ArticleListStore';

// MOLEUCULES
import ArticleListItem from '~/molecule/ArticleListItem';
import MediaListItem from '~/molecule/MediaListItem';

// ATOMS
import Typho from '~/Typho';
import {useLoader} from '~/store/AppGlobalLoadingStore';
import {toastAlert} from '~/util';

const REQUIRED_COUNT = 10;

type State = {
  nowTab: meta_types.list_scene__tab_type;
  page: number;
  data: Array<api_types.article_list_item | api_types.media_list_item>;
  isEnd: Boolean;
  isInited: Boolean;
};

type Action =
  | {type: 'APPEND_DATA'; data: State['data']; isEnd?: Boolean}
  | {type: 'INCREASE_PAGE'}
  | {type: 'SET_ISEND'; data: State['isEnd']}
  | {type: 'SET_PAGE'; data: State['page']}
  | {type: 'INIT_STATE'; data: meta_types.list_scene__tab_type}
  | {type: 'ERROR_OCCURED'};

const renderArticleItem = ({item}) => {
  return <ArticleListItem {...item} />;
};

const renderMediaItem = ({item}) => {
  return <MediaListItem {...item} />;
};

const MemoizedArticleFlatList = React.memo(
  ({data, fetchMore}: {data: State['data']; fetchMore: () => void}) => {
    return (
      <FlatList
        style={{marginHorizontal: 0}}
        keyExtractor={(item, index) => `ARTICLE_${index}`}
        data={data}
        renderItem={renderArticleItem}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
      />
    );
  },
);
const MemoizedMediaFlatList = React.memo(
  ({data, fetchMore}: {data: State['data']; fetchMore: () => void}) => {
    return (
      <FlatList
        style={{marginHorizontal: 0}}
        keyExtractor={(item, index) => `MEDIA_${index}`}
        data={data}
        renderItem={renderMediaItem}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
      />
    );
  },
);

const ArticleFlatListController = React.memo(
  ({
    pageState,
  }: {
    pageState: {
      nowTab: meta_types.list_scene__tab_type;
      filter: {
        si: string;
        gu: string;
      };
    };
  }) => {
    const dispatchLoader = useLoader();
    const reducer = (state: State, action: Action): State => {
      switch (action.type) {
        case 'APPEND_DATA': {
          return {
            ...state,
            data: state.data.concat(action.data),
            page: state.page + 1,
            isEnd: action.isEnd ? true : false,
            isInited: false,
          };
        }
        case 'INCREASE_PAGE': {
          return {
            ...state,
            page: state.page + 1,
          };
        }
        case 'SET_PAGE': {
          return {
            ...state,
            page: action.data,
          };
        }
        case 'SET_ISEND': {
          return {
            ...state,
            isEnd: action.data,
          };
        }
        case 'INIT_STATE': {
          return {
            nowTab: action.data,
            page: 1,
            data: [],
            isEnd: false,
            isInited: true,
          };
        }
        case 'ERROR_OCCURED': {
          toastAlert('데이터를 불러오는 중 문제가 발생하였습니다');
          return {
            ...state,
            page: 1,
            data: [],
            isEnd: true,
            isInited: false,
          };
        }
        default:
          throw new Error('FLAT LIST ERROR');
      }
    };
    const [state, dispatch] = useReducer(reducer, {
      nowTab: '지자체',
      page: 1,
      data: [],
      isEnd: false,
      isInited: true,
    });

    useEffect(() => {
      if (state.isInited) {
        fetchMore();
      }
    }, [state.isInited]);

    useEffect(() => {
      dispatch({type: 'INIT_STATE', data: pageState.nowTab});
    }, [pageState]);

    type endPoint = 'ARTICLE LIST' | 'MEDIA LIST' | 'STARRED LIST';
    const getEndPoint = (): endPoint => {
      switch (pageState.nowTab) {
        case '지자체':
          return 'ARTICLE LIST';
        case '언론':
          return 'MEDIA LIST';
        case '내 관심':
          return 'STARRED LIST';
        default:
          throw new Error('REDUCE END POINT ERROR :: ARTICLE FLAT LIST ');
      }
    };
    const fetchMore = async () => {
      if (state.isEnd) return;
      if (state.page === 1) {
        dispatchLoader({type: 'SHOW_LOADER'});
      }
      const res_data = await API_CALL(
        'get',
        'MAIN_HOST',
        getEndPoint(),
        undefined,
        {
          page: state.page,
          required_count: REQUIRED_COUNT,
          si: pageState.filter.si,
          gu: pageState.filter.gu,
        },
      );
      dispatchLoader({type: 'HIDE_LOADER'});

      if (res_data) {
        if (res_data.result === 'SUCCESS') {
          var res_data_length = res_data.data.length;
          var isEndFlag = false;
          if (REQUIRED_COUNT > res_data_length) {
            isEndFlag = true;
          }
          dispatch({
            type: 'APPEND_DATA',
            data: res_data.data,
            isEnd: isEndFlag,
          });
        } else {
          dispatch({type: 'ERROR_OCCURED'});
        }
      }
    };

    return (
      <View>
        {state.data.length >= 1 && (
          <>
            {state.nowTab === '지자체' ? (
              <MemoizedArticleFlatList
                data={state.data}
                fetchMore={fetchMore}
              />
            ) : (
              <MemoizedMediaFlatList data={state.data} fetchMore={fetchMore} />
            )}
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
  },
);

const ArticleFlatList = () => {
  const pageState = useArticleListStoreState('FLATLIST');

  return <ArticleFlatListController pageState={pageState} />;
};

export default ArticleFlatList;
