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

    console.log('SUCCESS : ', response);
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

    console.log('ERROR OCCURED!', error.response);
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
      return 'http://3.36.37.99:8080/road-construct/';
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
  | 'USER_ALARMED_LOCATION_LIST';

const endpoint_reducer = (
  url: params['url'],
  url_query: params['url_query'],
) => {
  switch (url) {
    case 'AUTH': {
      return 'user';
    }
    case 'NEW_SI_LIST': {
      return 'location/new';
    }
    // GET :  LOCATION
    case 'LOCATION_LIST': {
      return '/road-construct-reactnative/main/location.json';
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
      return 'article_marker_detail';
    }
    case 'ARTICLE NEWS LIST': {
      return `article/media/${url_query}`;
    }
    case 'MEDIA LIST': {
      return 'media';
    }
    case 'STARRED LIST': {
      return 'starred_list';
    }
    case 'USER_ALARMED_LOCATION_LIST': {
      return 'user/location';
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

  var axios_option = {
    method: method,
    url: request_URL,
    headers: {},
    params: undefined,
    data: undefined,
  };

  if (isUserIDRequired) {
    console.log(user_id);
    if (user_id) {
      axios_option.headers = {user_id: `${user_id}`};
    }
  }

  if (data !== undefined) {
    method === 'get'
      ? (axios_option.params = data)
      : (axios_option.data = data);
  }
  return h22_axios(axios_option);
};
