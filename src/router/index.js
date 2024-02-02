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
    // 更多路由...
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
