import { createRouter, createWebHistory } from 'vue-router';
import {isAuthenticated} from '@/utils'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/login/index.vue'),
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/pages/user/index.vue'),
        // children:[{
        //     path: 'createArticle',
        //     component: () => import('@/pages/user/Article/createArticle.vue'),
        // }]
    },
    {
        path: '/home/createArticle',
        component: () => import('@/pages/user/Article/createArticle.vue'),
    },
    // 更多路由...
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

// beforeEach 钩子函数，用于在路由跳转之前进行拦截
router.beforeEach((to, from, next) => {
    // 检查用户是否已认证（即是否拥有 token）
    if (!isAuthenticated()) {
        // 如果用户未认证，并且目的地不是登录页，则重定向到登录页
        if (to.name !== 'Login') {
            next({ name: 'Login' });
        } else {
            // 如果已经在登录页，正常进行
            next();
        }
    } else {
        // 如果用户已认证
        // 判断是否是从其他页面刷新进入
        console.log(from,to,'from')
        if (!from.name && to.name !== 'Home') {
            // 如果是从其他页面刷新，则重定向到首页
            next({ name: 'Home' });
        } else {
            // 如果不是页面刷新操作，正常跳转
            next();
        }
    }
});

export default router;
