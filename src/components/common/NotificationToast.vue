<template>
  <!-- Element Plus Message/Notification 通过服务调用，此组件保留作为兼容层 -->
  <!-- 实际通知已通过 uiStore.showSuccess/showError 调用 ElMessage -->
  <div class="notification-container">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-toast"
        :class="[`notification-${notification.type}`]"
      >
        <el-icon class="notification-icon" :size="20">
          <SuccessFilled v-if="notification.type === 'success'" />
          <CircleCloseFilled v-else-if="notification.type === 'error'" />
          <WarningFilled v-else-if="notification.type === 'warning'" />
          <InfoFilled v-else />
        </el-icon>
        <span class="notification-message">{{ notification.message }}</span>
        <button class="notification-close" @click="removeNotification(notification.id)">
          <el-icon :size="16"><Close /></el-icon>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import {
  SuccessFilled,
  CircleCloseFilled,
  WarningFilled,
  InfoFilled,
  Close
} from '@element-plus/icons-vue'

const uiStore = useUiStore()
const notifications = computed(() => uiStore.notifications)

const removeNotification = (id: string) => {
  uiStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 360px;
}

.notification-toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  backdrop-filter: blur(20px);
}

.notification-success {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
}

.notification-error {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.notification-warning {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

.notification-info {
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #3b82f6;
}

.notification-icon {
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-size: 14px;
}

.notification-close {
  flex-shrink: 0;
  padding: 4px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s;
}
</style>