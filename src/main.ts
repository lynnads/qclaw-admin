import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由
import { createPinia } from 'pinia' // 引入Pinia（状态管理）

// 引入全局样式
import 'element-plus/dist/index.css' // Element Plus 全局样式
import './style.css' // 项目自定义全局样式

// 创建Vue应用实例
const app = createApp(App)

// 全局注册依赖
app.use(createPinia()) // 注册Pinia
app.use(router) // 注册路由

// 挂载应用到页面
app.mount('#app')

