<template>
  <div class="stat-card" :class="{ clickable }" @click="handleClick">
    <div class="stat-icon" :style="{ background: iconBg }">
      <slot name="icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" :d="iconPath" />
        </svg>
      </slot>
    </div>
    <div class="stat-content">
      <p class="stat-title">{{ title }}</p>
      <p class="stat-value">{{ formattedValue }}</p>
      <p v-if="trend !== undefined" class="stat-trend" :class="{ positive: trend > 0, negative: trend < 0 }">
        <span v-if="trend > 0">↑</span>
        <span v-else-if="trend < 0">↓</span>
        <span v-else>→</span>
        {{ Math.abs(trend) }}% 较上月
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '@/utils/formatters'

interface Props {
  title: string
  value: number | string
  iconPath?: string
  iconBg?: string
  trend?: number
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  iconBg: 'linear-gradient(135deg, #7b2ff7 0%, #00d9ff 100%)',
  trend: undefined,
  clickable: false,
})

const emit = defineEmits<{
  click: []
}>()

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return formatNumber(props.value)
  }
  return props.value
})

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.stat-card {
  @apply relative overflow-hidden rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
         shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-5 flex items-center gap-4 transition-all duration-200;
}

.stat-card.clickable {
  @apply cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.12] hover:shadow-[0_6px_32px_rgba(0,0,0,0.2)];
}

.stat-icon {
  @apply w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(123,47,247,0.3)];
}

.stat-content {
  @apply flex-1 min-w-0;
}

.stat-title {
  @apply text-sm text-white/50 mb-1;
}

.stat-value {
  @apply text-2xl font-bold text-white/90;
}

.stat-trend {
  @apply text-xs text-white/40 mt-1;
}

.stat-trend.positive {
  @apply text-emerald-400;
}

.stat-trend.negative {
  @apply text-red-400;
}
</style>
