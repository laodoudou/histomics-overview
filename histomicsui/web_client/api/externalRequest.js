import $ from "jquery";

const externalApi = {
    baseUrl: "http://116.162.216.70:48080/admin-api",
    requestInterceptors: [],
    responseInterceptors: [],

    addRequestInterceptor: function (interceptor) {
        this.requestInterceptors.push(interceptor);
        return this;
    },

    addResponseInterceptor: function (interceptor) {
        this.responseInterceptors.push(interceptor);
        return this;
    },

    request: function (options) {
        // 应用请求拦截器
        let processedOptions = {};
        for (let key in options) {
            if (options.hasOwnProperty(key)) {
                processedOptions[key] = options[key];
            }
        }
        this.requestInterceptors.forEach((interceptor) => {
            processedOptions =
                interceptor(processedOptions) || processedOptions;
        });

        let url = this.baseUrl + (processedOptions.path || "");
        let data = null;
        let method = processedOptions.method || "GET";
        if (processedOptions.params) {
            // params则拼接参数到 URL 后面
            let queryParams = [];
            for (let paramKey in processedOptions.params) {
                if (processedOptions.params.hasOwnProperty(paramKey)) {
                    queryParams.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(processedOptions.params[paramKey]));
                }
            }
            if (queryParams.length > 0) {
                url += "?" + queryParams.join("&");
            }
        } else {
            // data则将参数放在 data 字段中
            data = JSON.stringify(processedOptions.data);
        }

        return $.ajax({
            url: url,
            type: method,
            headers: (function() {
                let headers = {
                    "Content-Type": "application/json"
                };
                for (let key in processedOptions.headers) {
                    if (processedOptions.headers.hasOwnProperty(key)) {
                        headers[key] = processedOptions.headers[key];
                    }
                }
                return headers;
            })(),
            data: data,
            dataType: "json",
        })
            .then((response) => {
                // 应用响应拦截器
                let processedResponse = response;
                this.responseInterceptors.forEach((interceptor) => {
                    processedResponse =
                        interceptor(processedResponse) || processedResponse;
                });
                return processedResponse;
            })
            .fail((error) => {
                // 统一错误处理
                console.error("API请求失败:", error);
                return Promise.reject(error);
            });
    },
};

// 添加默认请求拦截器 - 添加认证token
externalApi.addRequestInterceptor((options) => {
    const token = window.localStorage.getItem("girderToken");
    if (token) {
        options.headers = options.headers || {};
        options.headers.Authorization = "Bearer " + token;
    }
    return options;
});

// 添加默认响应拦截器 - 统一处理业务错误
externalApi.addResponseInterceptor((response) => {
    if (response.code !== 0) {
        throw new Error(response.message || "业务逻辑错误");
    }
    return response.data;
});

export default externalApi;
