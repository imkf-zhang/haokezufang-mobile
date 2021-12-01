import axios from "axios";
import { BASE_URL } from "./url";
import { getToken,removeToken } from "./auth";

const API = axios.create({
  baseURL: BASE_URL,
});
// Add a request interceptor
API.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // startWith主要是为了判断是不是以其为开头的，因为有此情况dai参数的/user?abc=1
    // console.log(config, config.url);
    const { url } = config;
    if (
      url.startsWith("/user") &&
      !url.startsWith("/user/login") &&
      !url.startsWith("/user/registered")
    ) {
      // 添加请求头
      config.headers.Authorization = getToken();
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor
API.interceptors.response.use(
  function (response) {
    // Do something with response data
    // console.log("response",response);
    const { data:{ status } } = response;
    if(status === 400) {
      // 此时说明token失效,失效的话就删除token
      removeToken()
    }
    return response;
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default API;
