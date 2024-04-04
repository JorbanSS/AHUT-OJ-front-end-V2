import axios from "axios";
import { push } from "notivue";
import httpErrorHandler from "./httpErrorHandler";

// axios.defaults.baseURL = "http://127.0.0.1:4433";
// axios.defaults.baseURL = '/api/';
// axios.defaults.baseURL = "/";

export let host: string;
export let port: number;

if (import.meta.env.MODE == "production") {
  host = "/";
  port = 4433;
} else {
  host = "http://127.0.0.1:4433/";
  port = 8080;
}

// 请求头
const contentType = [
  "application/json; charset=UTF-8",
  "application/x-www-form-urlencoded; charset=UTF-8",
  "multipart/form-data; charset=UTF-8",
];

const requestBaseURL = "api/";

// 创建 axios 请求实例
const Axios = axios.create({
  baseURL: host,
  timeout: 2000, // 请求 2s 超时
  withCredentials: false, // 跨域请求是否需要携带 cookie
});

// 全局 http request 拦截
Axios.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    if (token && config.headers) config.headers.Authorization = token;
    config.url = requestBaseURL + config.url;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 全局 http response 拦截
Axios.interceptors.response.use(
  (res) => {
    let data = res.data;
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
    httpErrorHandler(err).then((msg) => {
      push.error({
        title: "请求错误",
        message: msg,
      });
    })
    return Promise.reject();
  }
);

export function Get(url: string, params: any, content = 0) {
  return Axios.get(url, {
    params,
    headers: { "Content-Type": contentType[content] },
  });
}

export function Post(url: string, data: any, content = 0) {
  return Axios.post(url, data, {
    headers: { "Content-Type": contentType[content] },
  });
}

export function Del(url: string, data: any, content = 0) {
  return Axios.delete(url, {
    data,
    headers: { "Content-Type": contentType[content] },
  });
}

export function Put(url: string, data: any, content = 0) {
  return Axios.put(url, data, {
    headers: { "Content-Type": contentType[content] },
  });
}

export default Axios;