import React, {
  useState,
  useEffect,
  Dispatch,
  useReducer,
  useContext,
} from 'react';

import {useAsync} from '~/Hooks';
import axios from 'axios';
import {API_CALL} from '~/api';

// ELEMENT TYPES

// STATE TYPES
type ContextState = {
  origin_data: Array<any>;
  si_list: Array<any>;
};

// ACTIONS TYPES
type Action =
  | {type: 'FETCH_LOCATION'}
  | {type: 'SET_LOCATION'; data: Array<any>};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const AppGlobalContext = React.createContext<ContextState | null>(null);

// REDUCER
const reducer = (state: ContextState, action: Action): ContextState => {
  switch (action.type) {
    case 'SET_LOCATION':
      return {
        origin_data: action.data,
        si_list: action.data.map(it => it.si),
      };
    default:
      throw new Error('Unhandled action');
  }
};

export const AppGlobalProvider = ({children}: {children: React.ReactNode}) => {
  const getLocationInitData = () => {
    return API_CALL('get', 'MAIN_HOST', 'LOCATION_LIST');
  };
  const {value, execute} = useAsync(getLocationInitData, []);
  const [locationData, dispatch] = useReducer(reducer, {
    origin_data: [],
    si_list: [],
  });

  useEffect(() => {
    if (value) {
      dispatch({type: 'SET_LOCATION', data: value});
    }
  }, [value]);
  return (
    <AppGlobalContext.Provider value={locationData}>
      {locationData && children}
    </AppGlobalContext.Provider>
  );
};

export const useLocationData = () => {
  const state = useContext(AppGlobalContext);
  if (!state) throw new Error('Cannot find SampleProvider');
  return state;
};
