<template>
  <div class="custom-select" ref="selectRef">
    <div class="select-trigger" @click="toggleOpen">
      <span class="select-value" :class="{ placeholder: !selectedLabel }">
        {{ selectedLabel || placeholder }}
      </span>
      <svg class="select-arrow" :class="{ rotated: isOpen }" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
        <path fill="currentColor" d="M2.5 4.5L6 8l3.5-3.5"/>
      </svg>
    </div>
    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <div
          v-for="option in options"
          :key="option.value"
          class="select-option"
          :class="{ active: option.value === modelValue }"
          @click="select(option.value)"
        >
          {{ option.label }}
          <svg v-if="option.value === modelValue" class="check-icon" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
            <path fill="currentColor" d="M5.75 10.25L2.25 6.75l1.06-1.06 2.44 2.44 5.19-5.19 1.06 1.06-6.25 6.25z"/>
          </svg>
        </div>
        <div v-if="options.length === 0" class="select-empty">暂无选项</div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: SelectOption[]
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : ''
})

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}

const select = (value: string) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const handleClickOutside = (e: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.custom-select {
  @apply relative;
}

.select-trigger {
  @apply flex items-center justify-between h-10 pl-3 pr-9 rounded-xl text-sm cursor-pointer transition-all duration-200;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.6);
}

.select-trigger:hover {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.08);
}

.select-value {
  @apply truncate;
}

.select-value.placeholder {
  @apply opacity-50;
}

.select-arrow {
  @apply absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 transition-transform duration-200;
}

.select-arrow.rotated {
  @apply rotate-180;
}

.select-dropdown {
  @apply absolute z-50 top-full left-0 right-0 mt-1.5 py-1.5 rounded-xl overflow-hidden;
  background: linear-gradient(145deg, #1e1b3a 0%, #181530 100%);
  border: 1px solid rgba(123, 47, 247, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(123, 47, 247, 0.08);
  max-height: 220px;
  overflow-y: auto;
}

.select-option {
  @apply flex items-center justify-between px-3.5 py-2 text-sm cursor-pointer transition-colors duration-100;
  color: rgba(255, 255, 255, 0.7);
}

.select-option:hover {
  background: linear-gradient(90deg, rgba(123, 47, 247, 0.2) 0%, rgba(0, 217, 255, 0.1) 100%);
  color: #ffffff;
}

.select-option.active {
  color: #ffffff;
}

.select-option.active .check-icon {
  @apply text-[#00d9ff];
}

.select-empty {
  @apply px-3.5 py-3 text-sm text-center;
  color: rgba(255, 255, 255, 0.25);
}

/* 动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  @apply transition-all duration-150;
}

.dropdown-enter-from,
.dropdown-leave-to {
  @apply opacity-0 -translate-y-1;
}
</style>
