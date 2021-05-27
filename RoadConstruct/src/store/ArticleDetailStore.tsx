import React, {
  useEffect,
  Dispatch,
  createContext,
  useReducer,
  useContext,
} from 'react';
import {api_types} from '@global_types';
import {API_CALL} from '~/api';
import {useLoader} from './AppGlobalLoadingStore';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
let axiosSource = axios.CancelToken.source();

// ELEMENT TYPES

// STATE TYPES
type State = api_types.api_response__article_detail;

// ACTION TYPES
type Action = {type: 'SET_STATE'; data: any};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const ArticleDetailContext = React.createContext<State | null>(null);
const ArticleDetailDispatchContext = createContext<ContextDispatch | null>(
  null,
);

// REDUCER
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return action.data;
    default:
      throw new Error('ARTICLE DETAIL STORE ERROR OCCURED IN :: REDUCER');
  }
};

export const ArticleDetailProvider = ({
  article_id,
  children,
}: {
  article_id: number;
  children: JSX.Element;
}) => {
  const navigation = useNavigation();
  const loadDispatch = useLoader();
  const [state, dispatch] = useReducer(reducer, {
    topic_content: {
      content: '',
      article_file_list: [],
    },
    related_address: {
      address_list: [],
      article_image_list: [],
    },
    article_step: {
      current_step_idx: 1,
      step_list: [],
    },
    related_contact: [],
    starred: false,
    article_id: article_id,
  });

  const getDetailData = async () => {
    console.log({article_id});
    loadDispatch({type: 'SHOW_LOADER'});
    const rest_data = await API_CALL(
      'get',
      'MAIN_HOST',
      'ARTICLE DETAIL',
      article_id,
      undefined,
      true,
    );
    loadDispatch({type: 'HIDE_LOADER'});

    if (rest_data) {
      if (rest_data?.result === 'SUCCESS') {
        dispatch({type: 'SET_STATE', data: rest_data.data});
      } else {
        Alert.alert('존재하지 않거나, 삭제된 소식입니다.');
        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    getDetailData();
    return () => {
      if (axiosSource) {
        loadDispatch({type: 'HIDE_LOADER'});
        axiosSource.cancel('Landing Component got unmounted');
      }
    };
  }, []);

  return (
    <ArticleDetailContext.Provider value={state}>
      <ArticleDetailDispatchContext.Provider value={dispatch}>
        {children}
      </ArticleDetailDispatchContext.Provider>
    </ArticleDetailContext.Provider>
  );
};

type Type =
  | 'TOPIC_CONTENT'
  | 'RELATED_ADDRESS'
  | 'ARTICLE_STEP'
  | 'RELATED_CONTACT'
  | 'STARRED';
export const useArticleDetailStoreState = (type: Type): any => {
  const state = useContext(ArticleDetailContext);
  if (!state) throw new Error('Cannot find ArticleDetailProvider');
  switch (type) {
    case 'TOPIC_CONTENT':
      return {...state.topic_content};
    case 'RELATED_ADDRESS':
      return state.related_address;
    case 'ARTICLE_STEP':
      return state.article_step;
    case 'RELATED_CONTACT':
      return state.related_contact;
    case 'STARRED':
      return state.starred;
    default:
      throw new Error('ARTICLE DETAIL STORE ERROR IN :: USE STORE STATE');
  }
};

export const useStoreDispatch = () => {
  const dispatch = useContext(ArticleDetailDispatchContext);
  if (!dispatch) throw new Error('Cannot find ArticleDetailProvider');
  return dispatch;
};
