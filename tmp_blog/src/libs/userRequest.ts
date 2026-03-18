import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import storage from 'store';

const {VITE_APP_BASE_URL} = import.meta.env;

const request = axios.create({
  // API 请求的默认前缀
  baseURL: VITE_APP_BASE_URL,
  timeout: 10000,
});
// 添加请求拦截器
axios.interceptors.request.use(function (config: AxiosRequestConfig) {
  if (storage.get('ACCESS_TOKEN')) config.headers.Authorization = `bearer ${storage.get('ACCESS_TOKEN')}`;
  return config;
}, function (error) {
  console.log('err', error.response)
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response: AxiosResponse) {
  return response;
}, function (error) {
  console.log('err', error)
  return Promise.reject(error.response);
});

export default request
