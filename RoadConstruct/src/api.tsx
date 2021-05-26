import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toastAlert} from './util';
import {meta_types} from '@global_types';

export const DOMAIN = 'https://3543d13b2b1d.ngrok.io';

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
      return 'https://396a943f4594.ngrok.io';
    }
  }
};

type params_url =
  | 'NEW_SI_LIST'
  | 'LOCATION_LIST'
  | 'ARTICLE COUNT'
  | 'ARTICLE LIST'
  | 'MEDIA LIST'
  | 'STARRED LIST'
  | 'ARTICLE MARKER LIST'
  | 'ARTICLE DETAIL'
  | 'ARTICLE_DETAIL_MARKER'
  | 'ARTICLE NEWS LIST'
  | 'USER_ALARMED_LOCATION_LIST';

const endpoint_reducer = (
  url: params['url'],
  url_query: params['url_query'],
) => {
  switch (url) {
    case 'NEW_SI_LIST': {
      return '/new_si_list';
    }
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
      return '/article_marker_list';
    }
    case 'ARTICLE_DETAIL_MARKER': {
      return '/article_marker_detail';
    }
    case 'ARTICLE NEWS LIST': {
      return '/article_news';
    }
    case 'MEDIA LIST': {
      return '/media_list';
    }
    case 'STARRED LIST': {
      return '/starred_list';
    }
    case 'USER_ALARMED_LOCATION_LIST': {
      return '/user_alarmed_location_list';
    }
    default:
      throw new Error('API EP REDUCER ERROR');
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
): Promise<{result: 'SUCCESS'; data: any} | {result: 'ERROR'; msg: any}> => {
  var localData = await AsyncStorage.getItem('@auth');
  var header = localData ? JSON.parse(localData).access_token : undefined;

  var requestDOMAIN = domain_reducer(domain);
  var requestEP = endpoint_reducer(url, url_query);

  var request_URL = `${requestDOMAIN}${requestEP}`;

  console.debug();
  console.debug('API CALLED');
  console.debug(`EP : ${requestEP}`);
  console.debug(`DATA : ${data === undefined ? '' : data}`);

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
