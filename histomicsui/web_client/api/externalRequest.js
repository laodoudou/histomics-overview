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

        return $.ajax({
            url: this.baseUrl + (processedOptions.path || ""),
            type: processedOptions.method || "GET",
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
            data: JSON.stringify(processedOptions.data),
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
                // return Promise.reject({
                //     status: error.status,
                //     message: error.responseJSON?.message || "请求失败",
                //     data: error.responseJSON,
                // });
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
