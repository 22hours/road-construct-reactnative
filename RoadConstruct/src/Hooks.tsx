import React, {useState, useEffect, useCallback} from 'react';

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
    console.log('EXECUTED!');
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
