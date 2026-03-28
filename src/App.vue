<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

onMounted(() => {
  // 初始化用户信息
  auth.initUserInfo()
})
</script>

<style>
/* 全局样式 */
#app {
  @apply min-h-screen;
}
</style>
