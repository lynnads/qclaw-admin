import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// 自动导入插件：自动导入Vue、VueRouter、Pinia API及Element Plus组件
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  // 插件配置
  plugins: [
    vue(),
    // 自动导入：无需手动import Vue、路由、Pinia相关API
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'], // 自动导入的模块
      resolvers: [ElementPlusResolver()], // 自动导入Element Plus组件和API
      dts: true, // 生成auto-imports.d.ts类型文件，避免TS报错
    }),
    // 自动导入组件：无需手动import Element Plus组件及自定义组件
    Components({
      resolvers: [ElementPlusResolver()], // 自动识别Element Plus组件
      dts: true, // 生成components.d.ts类型文件，管理组件类型
    }),
  ],
  // 路径别名配置：@ 指向 src 目录，简化导入路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // 开发服务器配置
  server: {
    port: 3000, // 固定开发端口，避免端口冲突
    open: true,
    proxy: {
      // 跨域代理：请求以/api开头的接口，转发到后端服务地址（适配项目现有后端3456端口）
      '/api': {
        target: 'http://localhost:3456',
        changeOrigin: true, // 允许跨域
        // pathRewrite: { '^/api': '' } // 若后端接口无/api前缀，可解开注释
      }
    }
  }
})
