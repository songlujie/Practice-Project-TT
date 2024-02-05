import axiosInstance from "@/axios/index.js";


class AuthorService{

    //注册
    async registerUser(userData) {
        return axiosInstance.post(`/Login/Create`, userData)
    }

    //登录
    async loginUser(userData) {
        return axiosInstance.post(`/Login`, userData)
    }

    //用户信息
    async userInfos() {
        return axiosInstance.get(`Blogs/GetUserDetail`)
    }

    //发布文章
    async publishArticle(blogsInfo) {
        return axiosInstance.post(`Blogs/Publish`, blogsInfo)
    }

    //获取用户的文章
    async getAllArticleInUser(data) {
        return axiosInstance.post(`Blogs/GetBlogs`,{param:data})
    }
}

export default new AuthorService()
