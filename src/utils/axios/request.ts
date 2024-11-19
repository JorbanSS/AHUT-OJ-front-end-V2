import axios from "axios";
import { push } from "notivue";

import httpErrorHandler from "./httpErrorHandler";

// axios.defaults.baseURL = "https://angriliset.top:2024/api/notice/images";
// axios.defaults.baseURL = '/api/';
// axios.defaults.baseURL = "/";

export let host: string;
export let port: number;

if (import.meta.env.MODE == "production") {
  host = "/";
} else {
  host = "http://127.0.0.1:4433/";
}

// 请求头
export const contentType = [
  "application/json; charset=UTF-8",
  "application/x-www-form-urlencoded; charset=UTF-8",
  "multipart/form-data; charset=UTF-8",
];

const requestBaseURL = "api/";

// 创建 axios 请求实例
const Axios = axios.create({
  baseURL: host,
  // baseURL: "https://angriliset.top:2024",
  timeout: 2000, // 请求 2s 超时
  withCredentials: false, // 跨域请求是否需要携带 cookie
});

// 全局 http request 拦截
Axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    // console.log(token)
    if (token && config.headers) config.headers.Authorization = token;
    config.url = requestBaseURL + config.url;
    return config;
  },
  (err) => {
    push.error({
      title: `Error: ${err.response.data.Code}`,
      message: err.response.data.Msg,
    });
    return Promise.reject(err.response);
  }
);

// 全局 http response 拦截
Axios.interceptors.response.use(
  (res) => {
    let data = res.data;
    // 检查是否是文件下载请求
    if (res.config.responseType === 'blob') {
      return data;
    }

    if (data.Code == 0) {
      return data;
    } else {
      push.error({
        title: `Error: ${data.Code}`,
        message: data.Msg,
      });
      return Promise.reject(data);
    }
  },
  (err) => {
    push.error({
      title: `Error: ${err.name}`,
      message: err.message,
    });
    httpErrorHandler(err).then((msg) => {
      push.error({
        title: "请求错误",
        message: msg,
      });
    });
    return Promise.reject(err.response);
  }
);

export function Get(
  url: string,
  params: any,
  content = 0,
  timeout = Axios.defaults.timeout,
  isBlob = false
) {
  let req = {
    params,
    headers: { "Content-Type": contentType[content] },
    timeout: timeout,
  };
  if (isBlob) {
    req.responseType = "blob";
  }
  return Axios.get(url, req);
}

export function Post(
  url: string,
  data: any,
  content = 0,
  timeout = Axios.defaults.timeout
) {
  return Axios.post(url, data, {
    headers: { "Content-Type": contentType[content] },
    timeout: timeout,
  });
}

export function Del(
  url: string,
  data: any,
  content = 0,
  timeout = Axios.defaults.timeout
) {
  return Axios.delete(url, {
    data,
    headers: { "Content-Type": contentType[content] },
    timeout: timeout,
  });
}

export function Put(
  url: string,
  data: any,
  content = 0,
  timeout = Axios.defaults.timeout
) {
  return Axios.put(url, data, {
    headers: { "Content-Type": contentType[content] },
    timeout: timeout,
  });
}

export default Axios;
