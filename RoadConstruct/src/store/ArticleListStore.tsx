import {meta_types} from '@global_types';
import React, {
  useState,
  useEffect,
  Dispatch,
  createContext,
  useReducer,
  useContext,
} from 'react';
import {API_CALL} from '~/api';

// ELEMENT TYPES

// STATE TYPES
type State = {
  nowTab: meta_types.list_scene__tab_type;
  filter: {
    si: string;
    gu: string;
  };
  filterData: {
    si_list: Array<string>;
    gu_list: Array<string>;
  };
};

// ACTION TYPES
type Action =
  | {type: 'SET_TAB'; data: meta_types.list_scene__tab_type}
  | {type: 'SET_FILTER'; data: State['filter']};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const ArticleListContext = React.createContext<State | null>(null);
const ArticleListDispatchContext = createContext<ContextDispatch | null>(null);

// REDUCER
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TAB': {
      return {
        ...state,
        nowTab: action.data,
      };
    }
    case 'SET_FILTER': {
      return {
        ...state,
        filter: action.data,
      };
    }

    default:
      throw new Error('Cannot find ArticleListProvider');
  }
};

export const ArticleListProvider = ({
  initSi,
  children,
}: {
  initSi?: string;
  children: JSX.Element;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    nowTab: '지자체',
    filter: {
      si: initSi || '서울시',
      gu: '전체',
    },
    filterData: {
      si_list: [],
      gu_list: [],
    },
  });

  return (
    <ArticleListContext.Provider value={state}>
      <ArticleListDispatchContext.Provider value={dispatch}>
        {children}
      </ArticleListDispatchContext.Provider>
    </ArticleListContext.Provider>
  );
};

type StateType = 'FLATLIST' | 'TOPTAB' | 'FILTER';
export const useArticleListStoreState = (type: StateType) => {
  const state = useContext(ArticleListContext);
  if (!state) throw new Error('Cannot find ArticleListProvider');
  switch (type) {
    case 'FLATLIST': {
      return {
        nowTab: state.nowTab,
        filter: state.filter,
      };
    }
    case 'TOPTAB': {
      return {
        nowTab: state.nowTab,
        filter: state.filter,
      };
    }
    case 'FILTER': {
      return {
        filter: state.filter,
      };
    }
    default:
      throw new Error('ARTICLE LIST STORE ERROR 126 LINE');
  }
};

export const useArticleListStoreDispatch = () => {
  const dispatch = useContext(ArticleListDispatchContext);
  if (!dispatch) throw new Error('Cannot find ArticleListProvider');
  return dispatch;
};
