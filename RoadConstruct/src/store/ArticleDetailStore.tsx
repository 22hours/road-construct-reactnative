import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

// HOOKS
import {useAsync} from '~/Hooks';
import axios from 'axios';
import GlobalEnum from '~/GlobalEnum';

const getData = async (): Promise<string> => {
  const rest_data = await axios.get('https://api.androidhive.info/contacts/');
  return rest_data?.data;
};

const ArticleDetailContext = React.createContext(null);
const ArticleDetailProvider = ({article_id, children}) => {
  const {execute, status, value, error} = useAsync<string>(getData, [], false);
  const navigation = useNavigation();

  type Action =
    | {type: 'PDF'}
    | {type: 'MAP'}
    | {type: 'TOZI'}
    | {type: 'CALL'; phone_number: string}
    | {type: 'SHARE'}
    | {type: 'STAR'}
    | {type: 'NEWS'};

  var test_pdf =
    'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9ced86c3-a697-4531-96c0-895e0523c687/.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20210408%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20210408T073223Z&X-Amz-Expires=86400&X-Amz-Signature=46cb394e99c8fc9e4d3c0d6fe3e222b8cabd2c03fc8bbd2daebcd0ed8a619303&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22%25EB%258F%2584%25EC%258B%259C%25EA%25B4%2580%25EB%25A6%25AC%25EA%25B3%2584%25ED%259A%258D%25EA%25B2%25B0%25EC%25A0%2595%25EB%258F%2584.pdf%22';

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'PDF': {
        console.log('HA');
        navigation.navigate(GlobalEnum.Route.PDF_SCENE, {
          pdf_uri: test_pdf,
        });
      }
      case 'MAP': {
      }
      case 'TOZI': {
      }
      case 'CALL': {
      }
      case 'SHARE': {
      }
      case 'STAR': {
      }
      case 'NEWS': {
      }
    }
  };

  const store = {
    dispatch,
  };
  return (
    <ArticleDetailContext.Provider value={store}>
      {children}
    </ArticleDetailContext.Provider>
  );
};
export {ArticleDetailProvider, ArticleDetailContext};
1;
