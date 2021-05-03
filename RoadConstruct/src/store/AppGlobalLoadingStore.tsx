import React, {
  useState,
  useEffect,
  Dispatch,
  createContext,
  useReducer,
  useContext,
} from 'react';

// ELEMENT TYPES

// STATE TYPES
type State = {
  isLoading: Boolean;
  text?: string;
};

// ACTION TYPES
type Action = {type: 'SHOW_LOADER'; text?: string} | {type: 'HIDE_LOADER'};

// DISPATCH TYPES
type ContextDispatch = Dispatch<Action>;

// CONTEXT
const AppGlobalLoadingContext = React.createContext<State | null>(null);
const AppGlobalLoadingDispatchContext = createContext<ContextDispatch | null>(
  null,
);

// REDUCER
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SHOW_LOADER':
      console.log('SHOW');
      return {isLoading: true, text: action?.text};
    case 'HIDE_LOADER':
      console.log('HIDE');
      return {isLoading: false};
    default:
      throw new Error('GLOBAL LOADING STROE ERROR OCCURED!');
  }
};

export const AppGlobalLoadingProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, {
    isLoading: false,
  });
  return (
    <AppGlobalLoadingContext.Provider value={state}>
      <AppGlobalLoadingDispatchContext.Provider value={dispatch}>
        {children}
      </AppGlobalLoadingDispatchContext.Provider>
    </AppGlobalLoadingContext.Provider>
  );
};
export const useLoaderState = () => {
  const state = useContext(AppGlobalLoadingContext);
  if (!state) throw new Error('Cannot find AppGlobalLoadingContextProvider');
  return state;
};

export const useLoader = () => {
  const dispatch = useContext(AppGlobalLoadingDispatchContext);
  if (!dispatch) throw new Error('Cannot find AppGlobalLoadingProvider');
  return dispatch;
};
