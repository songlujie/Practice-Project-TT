
import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import './style.scss'
import '@/assets/css/global.scss'


import router from './router';
import { pinia } from './store';
// 引入其他组件和插件...


const app = createApp(App);

app.use(Antd);
app.use(router);
app.use(pinia);
// 使用其他组件和插件...

app.mount('#app');
