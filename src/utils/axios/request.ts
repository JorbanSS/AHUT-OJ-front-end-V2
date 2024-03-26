import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:4433';
// axios.defaults.baseURL = '/api/';
axios.defaults.baseURL = '/';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

let host: string;
export let port: number;

if (import.meta.env.MODE == "production") {
  host = "/";
  port = 4433;
}
else {
  host = "http://127.0.0.1:4433/";
  port = 8080;
}

const instance = axios.create({
  baseURL: host,
  timeout: 2000,  // 请求 2s 超时
});


// axios.defaults.withCredentials = false;
// let token = '';
// axios.defaults.headers.common['token'] = token;

// 全局 http request 拦截
instance.interceptors.request.use(
  function(config) {
    let token = localStorage.getItem("token");

    config.headers.Authorization = token;
    return config;
  },
  function(err) {
    return Promise.reject(err);
  }
)


// 全局 http response 拦截
// 此处可以根据服务器返回的状态码做相应的处理
// 如根据请求状态码 404/401/500 等做相应的处理，页面跳转等
instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(err) {
    return Promise.reject(err);
  }
)

export function Get(url:string,params:any) {
  return instance.get(url,{
    params
  });
}

export function Post(url:string,data:any) {
  return instance.post(url,data);
}

export function Del(url:string) {
  return instance.delete(url);
}

export function Put(url:string,data:any) {
  return instance.put(url,data);
}