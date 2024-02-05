import { createPinia } from 'pinia';

export const pinia = createPinia();


// store.js
import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            userInfo: {},
            isLogin:false
        }
    },
    actions: {
        setUserInfo(value) {
            this.userInfo = value
        },
        setIsLogin(value){
            this.isLogin = value
        },
    },
    getters: {
    }
})
