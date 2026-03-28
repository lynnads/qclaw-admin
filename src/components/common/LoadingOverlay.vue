<template>
  <Transition name="fade">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p v-if="text" class="loading-text">{{ text }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
  text?: string
}

withDefaults(defineProps<Props>(), {
  text: '加载中...',
})
</script>

<style scoped>
.loading-overlay {
  @apply fixed inset-0 z-50 bg-[#1a1630]/80 backdrop-blur-sm flex items-center justify-center;
}

.loading-content {
  @apply flex flex-col items-center gap-3;
}

.loading-spinner {
  @apply w-10 h-10 border-2 border-white/10 border-t-[#7b2ff7] rounded-full animate-spin;
}

.loading-text {
  @apply text-sm text-white/40;
}

.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-200;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
