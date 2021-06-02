import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {toastAlert} from './util';
import {meta_types} from '@global_types';

export const DOMAIN = 'https://3543d13b2b1d.ngrok.io';

const h22_axios = axios.create({timeout: 5000});
h22_axios.defaults.timeout = 5000;
h22_axios.interceptors.response.use(
  // SUCCESS INTERCEPT
  (response: any): any => {
    var status_code = response.status;
    var res: meta_types.api_response_type;

    console.debug('SUCCESS : ', response);
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

    // console.debug('ERROR OCCURED!', error.config);
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
      return 'https://raw.githubusercontent.com/22hours/';
    }
    case 'MAIN_HOST': {
      // return 'http://3.36.37.99:8080/road-construct/';
      return 'http://192.168.0.10:8080';
    }
    case 'MAIN_DOCS': {
      return 'http://3.36.37.99:8080';
      // return 'http://192.168.0.10:8080';
    }
  }
};

type params_url =
  | 'AUTH'
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
  | 'USER_ALARMED_LOCATION_LIST'
  | 'STAR'
  | 'TEST';

const endpoint_reducer = (
  url: params['url'],
  url_query: params['url_query'],
) => {
  switch (url) {
    case 'TEST': {
      return '/';
    }
    case 'AUTH': {
      return 'user';
    }
    case 'NEW_SI_LIST': {
      return 'location/new';
    }
    // GET :  LOCATION
    case 'LOCATION_LIST': {
      return '/docs/location.json';
    }
    // GET :  ARTICLE COUNT
    case 'ARTICLE COUNT': {
      return 'location/count';
    }
    case 'ARTICLE DETAIL': {
      return `article/${url_query}`;
    }
    case 'ARTICLE LIST': {
      return 'article';
    }
    case 'ARTICLE MARKER LIST': {
      return 'address';
    }
    case 'ARTICLE_DETAIL_MARKER': {
      return `article/summary/${url_query}`;
    }
    case 'ARTICLE NEWS LIST': {
      return `article/media/${url_query}`;
    }
    case 'MEDIA LIST': {
      return 'media';
    }
    case 'STARRED LIST': {
      return 'user/article';
    }
    case 'USER_ALARMED_LOCATION_LIST': {
      return 'user/location';
    }
    case 'STAR': {
      const {article_id, flag} = url_query;
      return `article/star/${article_id}/${flag}`;
    }
    default:
      throw new Error('API EP REDUCER ERROR');
  }
};

type params = {
  method: 'get' | 'post' | 'delete' | 'put';
  domain: 'MAIN_HOST' | 'GITHUB' | 'MAIN_DOCS';
  url: params_url;
  url_query: any;
  data: any;
  header: any;
};

export const API_CALL = async (
  method: params['method'],
  domain: params['domain'],
  url: params['url'],
  url_query?: params['url_query'],
  data?: params['data'],
  isUserIDRequired?: boolean,
): Promise<{result: 'SUCCESS'; data: any} | {result: 'ERROR'; msg: any}> => {
  var user_id = await AsyncStorage.getItem('ID');

  var requestDOMAIN = domain_reducer(domain);
  var requestEP = endpoint_reducer(url, url_query);

  var request_URL = `${requestDOMAIN}${requestEP}`;
  const CancelToken = axios.CancelToken;
  let source = CancelToken.source();
  var axios_option = {
    method: method,
    url: request_URL,
    headers: {},
    params: undefined,
    data: undefined,
    cancelToken: source.token,
  };

  if (isUserIDRequired) {
    if (user_id) {
      axios_option.headers = {user_id: `${user_id}`};
    }
  }

  if (data !== undefined) {
    method === 'get'
      ? (axios_option.params = data)
      : (axios_option.data = data);
  }

  setTimeout(() => {
    source.cancel();
    console.log('요청 취소!');
    return {result: 'ERROR'};
  }, 5000);
  return h22_axios.request(axios_option);
};
