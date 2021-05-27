import React, {useState, useEffect, useCallback} from 'react';
import Geolocation from 'react-native-geolocation-service';

export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<any>,
  deps?: Array<any>,
  immediate = true,
) => {
  const [status, setStatus] = useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response: any) => {
        setValue(response?.data);
        setStatus('success');
      })
      .catch((error: any) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, deps);
  return {execute, status, value, error};
};

export const useTime = (time: string) => {
  var date = new Date(time);
  var YYMMDD = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  return YYMMDD;
};

export const useLocation = () => {
  const [state, setState] = useState<any>(null);
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setState({
          longitude: longitude,
          latitude: latitude,
        });
      },
      error => {},
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);
  return state;
};
