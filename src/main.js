
import { createApp } from 'vue';
import App from './App.vue';
import Antd,{notification} from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

import './style.scss'
import '@/assets/css/global.scss'


import router from './router';
import { pinia } from './store';
// 引入其他组件和插件...

//引入markdown插件
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdEditor.use(githubTheme, {
    Hljs: hljs,
});




const app = createApp(App);

// 配置 notification
notification.config({
    placement: 'bottomRight', // 默认弹出位置
    bottom: '50px', // 距离底部的距离
    duration: 3, // 消息停留的持续时间（单位：秒），这里设置为3秒
    // 其他配置项...
});

// 将 notification 方法注入到全局属性中
app.config.globalProperties.$notification = notification;

app.use(Antd);
app.use(router);
app.use(pinia);
// 使用其他组件和插件...
app.use(VMdEditor);
app.mount('#app');
