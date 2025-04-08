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
    if (response.data.code === 401) {
      // token过期刷新token
      try {
        // 配置请求头
        const config = {
          headers: {
            "Tenant-id": localStorage.getItem("tenantId") // 添加自定义头部字段
          }
        };
        // const res = await axios.post(
        //   `${baseURL}/system/auth/refresh-token?refreshToken=${sessionStorage.getItem(
        //     "refreshToken"
        //   )}`,
        //   {
        //     refreshToken: sessionStorage.getItem("refreshToken")
        //   },
        //   config
        // );
        const parsedLocation = window.location.search
          .replace(/^\?/, "")
          .split("&")
          .map(pair => {
            const [key, value] = pair
              .split("=")
              .map(p => decodeURIComponent(p));
            return [key, value];
          });
        const search = Object.fromEntries(parsedLocation);
        const res = await axios.post(
          `${baseURL}/system/auth/refresh-token?ra=${search.ra ??
            localStorage
              .getItem("refreshToken")
              .slice(0, 5)}&rb=${search.rb ??
                localStorage.getItem("refreshToken").slice(5)}`,
          {
            ra: `${search.ra ??
              localStorage.getItem("refreshToken").slice(0, 5)}`,
            rb: `${search.rb ??
              localStorage.getItem("refreshToken").slice(5)}`
          },
          config
        );

        console.log("刷新token1成功", res.data);
        if (res.data.code === 0) {
          search.ta = res.data?.data?.accessToken.slice(0, 5);
          search.tb = res.data?.data?.accessToken.slice(5);
          search.ra = res.data?.data?.refreshToken.slice(0, 5);
          search.rb = res.data?.data?.refreshToken.slice(5);
          window.location.search = new URLSearchParams(search).toString();
          sessionStorage.setItem("refreshToken", res.data?.data?.refreshToken);
          sessionStorage.setItem("successToken", res.data?.data?.accessToken);
          return service(response.config);//刷新token后重新发送请求
        }
      } catch (error) {
        console.log("刷新token失败", error);
      }
    }
    return response.data;
  },
  async error => {
    // console.log("响应拦截器error", error);
    return Promise.reject(error);
  }
);

export default service;