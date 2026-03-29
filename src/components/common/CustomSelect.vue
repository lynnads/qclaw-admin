<template>
  <el-select
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :size="size"
    class="custom-select"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: SelectOption[]
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  size?: 'large' | 'default' | 'small'
}

withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  clearable: false,
  disabled: false,
  size: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
/*
  表单控件统一样式已由全局 styles/element-dark.css 接管：
  --form-control-height / --form-control-radius 等变量驱动 el-input / el-select 尺寸对齐
  此处仅覆盖下拉弹出层无法通过 CSS 变量实现的细节
*/
.custom-select {
  width: 100%;
}

/* 下拉弹出层 — 弹出方向适配 */
:deep(.el-select-dropdown) {
  margin-top: 4px;
}

/* 选中态 — 青蓝色高亮 */
:deep(.el-select-dropdown__item.is-selected) {
  color: #00d9ff !important;
  font-weight: 600;
  background: rgba(0, 217, 255, 0.08) !important;
}

/* 隐藏 EP 默认勾选图标 */
:deep(.el-select-dropdown__item.is-selected::after) {
  display: none;
}

/* 选项 hover */
:deep(.el-select-dropdown__item:hover) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}
</style>
