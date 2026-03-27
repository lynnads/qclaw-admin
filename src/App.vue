<template>
  <router-view v-if="!error" />
  <div v-else class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body text-center">
        <div class="text-6xl mb-4">😵</div>
        <h2 class="card-title justify-center text-2xl mb-2">出错了</h2>
        <p class="text-base-content/60 mb-6">{{ error?.message || '应用遇到了一些问题' }}</p>
        <div class="card-actions justify-center gap-3">
          <button class="btn btn-ghost" @click="copyError">复制错误信息</button>
          <button class="btn btn-primary" @click="reload">刷新页面</button>
        </div>
        <details v-if="error?.stack" class="mt-4 text-left">
          <summary class="cursor-pointer text-sm text-base-content/60">查看错误详情</summary>
          <pre class="mt-2 p-3 bg-base-200 rounded-lg text-xs overflow-auto max-h-40">{{
            error.stack
          }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const error = ref(null)

onErrorCaptured(err => {
  console.error('全局错误捕获:', err)
  error.value = err
  return false
})

const reload = () => {
  error.value = null
  window.location.reload()
}

const copyError = () => {
  const text = error.value ? `${error.value.message}\n\n${error.value.stack}` : '未知错误'
  navigator.clipboard.writeText(text).then(() => {
    alert('错误信息已复制到剪贴板')
  })
}

// 防止页面刷新时主题闪烁
const theme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', theme)
</script>
