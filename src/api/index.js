import axiosInstance from "@/axios/index.js";


class AuthorService{

    //注册
    async registerUser(userData) {
        return axiosInstance.post(`/Login/Create`, userData)
    }
}

export default new AuthorService()
