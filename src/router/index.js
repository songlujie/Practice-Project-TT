import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../App.vue'),
    },
    {
        path: '/login',
        component: () => import('@/pages/login/index.vue'),
    },
    {
        path: '/home',
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

export default router;
