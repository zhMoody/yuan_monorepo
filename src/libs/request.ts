import axios, {AxiosError} from 'axios';
import storage from 'store';
import {useNotification} from "naive-ui/lib";
import useUserStore from '@/stores/useUser'

const notification = useNotification()
const {VITE_APP_BASE_URL} = import.meta.env;

const request = axios.create({
  // API 请求的默认前缀
  baseURL: VITE_APP_BASE_URL,
  timeout: 10000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error: AxiosError) => {
  const status = error.response?.status;
  switch (status) {
    /* eslint-disable no-param-reassign */
    case 400:
      error.message = '请求错误';
      break;
    case 401:
      error.message = error.response!.data.errorMessage || '未授权'
      break;
    case 403:
      error.message = error.response!.data.errorMessage;
      break;
    case 404:
      error.message = error.response!.data.errorMessage;
      break;
    case 408:
      error.message = error.response!.data.errorMessage;
      break;
    case 412:
      error.message = error.response!.data.errorMessage;
      break;
    case 500:
      error.message = '服务器内部错误';
      break;
    case 501:
      error.message = '服务未实现';
      break;
    case 502:
      error.message = '网关错误';
      break;
    case 503:
      error.message = '服务不可用';
      break;
    case 504:
      error.message = '网关超时';
      break;
    case 505:
      error.message = 'HTTP版本不受支持';
      break;
    default:
      break;
  }
  return Promise.reject(error.message);
};

request.interceptors.request.use((config) => {
  // let token = storage.get('ACCESS_TOKEN')
  const userStore = useUserStore()
  let token = userStore.userInfo.token
  console.log('token==>', token)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  config.headers.Authorization = `bearer ${token}`;
  return config;
}, errorHandler);

// response interceptor
request.interceptors.response.use((response) => {
  const dataAxios = response.data;
  // 这个状态码是和后端约定的
  const {code} = dataAxios;
  // 根据 code 进行判断
  if (code === undefined) {
    // 如果没有 code 代表这不是项目后端开发的接口
    return dataAxios;
  }
  // 有 code 代表这是一个后端接口 可以进行进一步的判断
  switch (code) {
    case 200:
      // [ 示例 ] code === 0 代表没有错误
      return dataAxios;
    case 401:
      // [ 示例 ] 其它和后台约定的 code
      return '登录失败了';
    default:
      // 不是正确的 code
      return '不是正确的code';
  }
}, errorHandler);

export default request;
