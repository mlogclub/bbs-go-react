import axios from 'axios';
import qs from 'querystring';
import { getToken, TokenKey } from './storage';
import { redirectLogin } from './history';

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const request = axios.create({
  baseURL: '',
  timeout: 30000,
  cancelToken: source.token,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cache-Control': 'no-cache',
  },
});

request.interceptors.request.use(
  function (config) {
    // config.cancelToken = STORE_AXIOS_CANCEL_TOKEN.token; // 设置切换路由取消请求操作
    config.headers = {
      [TokenKey]: getToken() || '',
      ...config.headers,
    };
    config.cancelToken = source.token;
    config.xsrfCookieName = 'XSRF-TOKEN';
    config.xsrfHeaderName = 'X-XSRF-TOKEN';
    config.transformRequest = [
      function (data) {
        if (data instanceof FormData) {
          // 如果是FormData就不转换
          return data;
        }
        return qs.stringify(data);
      },
    ];
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  function (response) {
    // TODO: 直接返回body or 返回所有
    return response;
  },
  function (error) {
    if (error.response && error.response.status === 601) {
      redirectLogin();
    }
    // TODO: 错误处理？？怎么提示错误信息
    return Promise.reject(error.response);
  },
);

// type Keys = typeof Methods[number];
// type requestMethod = {
//   [key in Keys]: (url: string, opts?: AxiosRequestConfig) => AxiosInstance;
// };

export default request;

export const get = request.get;
export const post = request.post;
export const put = request.put;
export const del = request.delete;

// 取消请求
export const cancelSource = source;

//  通用的返回结构体
export interface ResponseData<T extends unknown> {
  code: number;
  data: T;
  msg: string;

  errorCode: number;
  message: string;
  success: boolean;
}

export interface ResponsePageResult<T extends unknown> {
  limit: number;
  nextPage: boolean;
  page: number;
  results: T[];
  total: number;
}

export type ResponseListResult<T extends unknown> = {
  page: {
    page: number;
    limit: number;
    total: number;
  };
  results?: T[];
};
