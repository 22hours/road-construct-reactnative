import React, {
  useState,
  useEffect,
  Dispatch,
  createContext,
  useReducer,
  useContext,
} from 'react';
import {api_types} from '@global_types';
import {API_CALL} from '~/api';

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
  const [state, dispatch] = useReducer(reducer, {
    topic_content: {
      content: 'content',
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
  });

  const getDetailData = async () => {
    console.log({article_id});
    const rest_data = await API_CALL(
      'get',
      'MAIN_HOST',
      'ARTICLE DETAIL',
      article_id,
    );
    if (rest_data) {
      if (rest_data?.result === 'SUCCESS') {
        dispatch({type: 'SET_STATE', data: rest_data.data});
      } else {
        console.error('API ERROR OCCURED');
      }
    }
  };

  useEffect(() => {
    getDetailData();
  }, []);

  useEffect(() => {
    console.log(state);
  }, [state]);

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
