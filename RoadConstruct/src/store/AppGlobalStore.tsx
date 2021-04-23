import React, {useState, useEffect} from 'react';

import {useAsync} from '~/Hooks';
import axios from 'axios';

const AppGlobalContext = React.createContext(null);
const AppGlobalProvider = ({children}) => {
  const getLocationInitData = () => {
    return axios.get('http://10.0.2.2:5000/locations');
  };
  const {value} = useAsync(getLocationInitData, []);

  const [state, setState] = useState({
    origin_data: [],
    si_list: [],
  });

  useEffect(() => {
    if (value) {
      setState({
        origin_data: value,
        si_list: value.map(it => it.si),
      });
    }
  }, [value]);
  const store = {state};
  return (
    <AppGlobalContext.Provider value={store}>
      {state && children}
    </AppGlobalContext.Provider>
  );
};
export {AppGlobalProvider, AppGlobalContext};

// TODO : 2021.04.23
// LOCATION OBJECT INIT & SET IN APP
