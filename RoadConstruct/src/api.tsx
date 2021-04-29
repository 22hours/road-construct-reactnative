import axios, {AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toastAlert} from './util';
import {api_types, meta_types} from '@global_types';

export const DOMAIN = 'https://3543d13b2b1d.ngrok.io';

// GET
// export const LOCATION_LIST = '/locations';

const h22_axios = axios.create({});
h22_axios.interceptors.response.use(
  // SUCCESS INTERCEPT
  (response: any): any => {
    var status_code = response.status;
    var res: meta_types.api_response_type;

    switch (status_code) {
      case 200: {
        res = {result: 'SUCCESS', data: response.data};
        break;
      }
      case 201: {
        var location = response.headers.location;
        res = {result: 'SUCCESS', data: location || 'SUCCESS'};
        break;
      }
      case 204: {
        res = {result: 'SUCCESS', data: 'SUCCESS'};
        break;
      }
      default: {
        res = {result: 'SUCCESS', data: 'SUCCESS'};
        break;
      }
    }
    return res;
  },
  // ERROR INTERCEPT
  async error => {
    const customErrorCode = error.response?.data?.status;
    const error_msg = error.response?.data?.message;
    var res: meta_types.api_response_type;
    console.error(error);
    switch (customErrorCode) {
      case 701: {
        res = {result: 'ERROR', msg: error_msg};
        break;
      }
      case 702: {
        res = {result: 'ERROR', msg: error_msg};
        break;
      }
      case 705: {
        toastAlert(error_msg);
        res = {result: 'ERROR', msg: error_msg};
        break;
      }
      default: {
        res = {result: 'ERROR', msg: '서버와의 연결상태가 좋지 않습니다'};
        break;
      }
    }
    return res;
  },
);

const domain_reducer = (domain: params['domain']) => {
  switch (domain) {
    case 'GITHUB': {
      return 'https://github.com';
    }
    case 'MAIN_HOST': {
      return 'https://5cbca68277e4.ngrok.io';
    }
  }
};

type params_url =
  | 'LOCATION_LIST'
  | 'ARTICLE COUNT'
  | 'ARTICLE LIST'
  | 'MEDIA LIST'
  | 'STARRED LIST'
  | 'ARTICLE MARKER LIST'
  | 'ARTICLE DETAIL'
  | 'ARTICLE NEWS LIST';

const endpoint_reducer = (
  url: params['url'],
  url_query: params['url_query'],
) => {
  switch (url) {
    // GET :  LOCATION
    case 'LOCATION_LIST': {
      return '/locations';
    }
    // GET :  ARTICLE COUNT
    case 'ARTICLE COUNT': {
      return '/article_count';
    }
    case 'ARTICLE DETAIL': {
      return `/article_detail/${url_query}`;
    }
    case 'ARTICLE LIST': {
      return '/article_list';
    }
    case 'ARTICLE MARKER LIST': {
      return '/article_count';
    }
    case 'ARTICLE NEWS LIST': {
      return '/article_count';
    }
    case 'MEDIA LIST': {
      return '/media_list';
    }
  }
};

type params = {
  method: 'get' | 'post' | 'delete' | 'put';
  domain: 'MAIN_HOST' | 'GITHUB';
  url: params_url;
  url_query: any;
  data: any;
};

export const API_CALL = async (
  method: params['method'],
  domain: params['domain'],
  url: params['url'],
  url_query?: params['url_query'],
  data?: params['data'],
) => {
  var localData = await AsyncStorage.getItem('@auth');
  var header = localData ? JSON.parse(localData).access_token : undefined;

  var request_URL = `${domain_reducer(domain)}${endpoint_reducer(
    url,
    url_query,
  )}`;
  // console.log(request_URL);

  var axios_option = {
    method: method,
    url: request_URL,
    headers: {
      Authorization: `${header}`,
    },
    params: undefined,
    data: undefined,
  };
  if (data !== undefined) {
    method === 'get'
      ? (axios_option.params = data)
      : (axios_option.data = data);
  }
  return h22_axios(axios_option);
};
