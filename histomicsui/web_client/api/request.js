/**
 * @author panyi
 * @date 2025-04-08
 * @description
 */

import axios from "axios";

const baseURL = "http://116.162.216.70:48080/admin-api";

const token = localStorage.getItem("girderToken");

const service = axios.create({
  baseURL: baseURL,
  timeout: 100000,
  headers: {
    Authorization: `Bearer ${token}`,
    "Tenant-id": localStorage.getItem("tenantId")
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem("girderToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  async response => {
    // console.log("响应拦截器", response);
    if (response.data.code !== 0) {
      // 如果code值不等于0，则表示请求失败，抛出异常
      return Promise.reject(response.data);
    }
    return response.data;
  },
  async error => {
    // console.log("响应拦截器error", error);
    return Promise.reject(error);
  }
);

export default service;