import Axios from 'axios';

const axiosInstance = Axios.create({
    baseURL: 'http://www.hellomylove.love:81', // 你的API基础路径
    timeout: 10000,
    // 其他配置...
});



// 你可以添加请求和响应拦截器
axiosInstance.interceptors.request.use(config => {
    if (sessionStorage.getItem('Authorization')){
        config.defaults.headers.common['Authorization'] = sessionStorage.getItem('Authorization');
    }
    // 在发送请求前做些什么
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    // 对响应数据做点什么
    return response;
}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default axiosInstance;
