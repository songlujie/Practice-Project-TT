import Axios from 'axios';

const axiosInstance = Axios.create({
    baseURL: 'http://www.hellomylove.love:81', // 你的API基础路径
    timeout: 10000,
    // 其他配置...
});

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

if (localStorage.getItem('Authorization')){
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('Authorization')}`
}

// 你可以添加请求和响应拦截器
axiosInstance.interceptors.request.use(config => {

    // 在发送请求前做些什么
    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    if (response.status !== 200) {
        throw new Error(response.data.message);
    } else {
        return response.data
    }

}, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default axiosInstance;
