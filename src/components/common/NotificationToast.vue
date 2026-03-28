<template>
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-toast"
        :class="[`notification-${notification.type}`]"
      >
        <div class="notification-icon">
          <svg v-if="notification.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else-if="notification.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else-if="notification.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="notification-message">{{ notification.message }}</span>
        <button class="notification-close" @click="removeNotification(notification.id)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const notifications = computed(() => uiStore.notifications)

const removeNotification = (id: string) => {
  uiStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  @apply fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm;
}

.notification-toast {
  @apply flex items-center gap-3 px-4 py-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-xl;
}

.notification-success {
  @apply bg-emerald-500/20 border border-emerald-500/30 text-emerald-400;
}

.notification-error {
  @apply bg-red-500/20 border border-red-500/30 text-red-400;
}

.notification-warning {
  @apply bg-amber-500/20 border border-amber-500/30 text-amber-400;
}

.notification-info {
  @apply bg-blue-500/20 border border-blue-500/30 text-blue-400;
}

.notification-icon {
  @apply flex-shrink-0;
}

.notification-message {
  @apply flex-1 text-sm;
}

.notification-close {
  @apply flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  @apply transition-all duration-300;
}

.notification-enter-from {
  @apply opacity-0 translate-x-full;
}

.notification-leave-to {
  @apply opacity-0 translate-x-full;
}

.notification-move {
  @apply transition-transform duration-300;
}
</style>
