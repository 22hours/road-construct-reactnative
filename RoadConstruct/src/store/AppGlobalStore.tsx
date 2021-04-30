import React, {
  useState,
  useEffect,
  Dispatch,
  useReducer,
  useContext,
} from 'react';

import {useAsync} from '~/Hooks';
import {API_CALL} from '~/api';
import {useLoader} from './AppGlobalLoadingStore';

// ELEMENT TYPES

// STATE TYPES
type ContextState = {
  alarmed_data: Array<{
    si: string;
    gu_list: Array<{gu: string; alarmed?: Boolean}>;
  }>;
  origin_data: Array<{
    si: string;
    gu_list: Array<string>;
  }>;
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
        alarmed_data: action.data.map(first_it => {
          var si = first_it.si;
          var gu_list = first_it.gu_list.map(second_it => {
            var gu = second_it;
            var alarmed = false;
            return {
              gu: gu,
              alarmed: alarmed,
            };
          });
          return {
            si: si,
            gu_list: gu_list,
          };
        }),
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
  const loaderDispatch = useLoader();
  const {value, execute} = useAsync(getLocationInitData, []);
  const [locationData, dispatch] = useReducer(reducer, {
    alarmed_data: [],
    origin_data: [],
    si_list: [],
  });

  useEffect(() => {
    if (value) {
      dispatch({type: 'SET_LOCATION', data: value});
      loaderDispatch({type: 'HIDE_LOADER'});
    }
  }, [value]);

  useEffect(() => {
    loaderDispatch({type: 'SHOW_LOADER'});
  }, []);
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
