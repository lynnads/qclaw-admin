<template>
  <div class="user-table-container">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="header-left">
        <h3 class="table-title">用户列表</h3>
        <span class="table-count">共 {{ total }} 位用户</span>
      </div>
      <button @click="$emit('add')" class="add-btn">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        新增用户
      </button>
    </div>

    <!-- 表格内容 -->
    <div class="table-wrapper">
      <table class="user-table">
        <thead>
          <tr>
            <th class="w-12">
              <input type="checkbox" class="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
            </th>
            <th>用户</th>
            <th>角色</th>
            <th>状态</th>
            <th>注册时间</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0">
            <td colspan="6" class="empty-state">
              <div class="empty-content">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span>暂无数据</span>
              </div>
            </td>
          </tr>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td>
              <input type="checkbox" class="checkbox" :value="user.id" :checked="(selectedIds as (string | number)[]).includes(user.id)" @change="emit('toggleSelect', user.id)" />
            </td>
            <td>
              <div class="user-info">
                <div class="user-avatar">{{ (user.name || user.username || 'U').charAt(0) }}</div>
                <div class="user-details">
                  <p class="user-name">{{ user.name }}</p>
                  <p class="user-email">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td>
              <span class="role-badge">{{ user.role }}</span>
            </td>
            <td>
              <span class="status-badge" :class="user.status">
                {{ user.status === 'active' ? '正常' : '禁用' }}
              </span>
            </td>
            <td class="text-white/35 text-xs">{{ user.createdAt || user.createTime }}</td>
            <td>
              <div class="action-buttons">
                <button @click="$emit('edit', user)" class="action-btn edit">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  编辑
                </button>
                <button @click="$emit('delete', user)" class="action-btn delete">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="table-footer">
      <p class="selection-info">
        已选中 <span class="highlight">{{ selectedIds.length }}</span> 项
      </p>
      <div class="pagination">
        <button
          @click="$emit('pageChange', currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="$emit('pageChange', page)"
          class="page-btn"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
        <button
          @click="$emit('pageChange', currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types'

interface Props {
  users: User[]
  total: number
  currentPage: number
  pageSize: number
  selectedIds: (number | string)[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  add: []
  edit: [user: User]
  delete: [user: User]
  pageChange: [page: number]
  selectAll: [selected: boolean]
  toggleSelect: [id: number | string]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const displayedPages = computed(() => {
  const pages: number[] = []
  const t = totalPages.value
  const c = props.currentPage
  
  if (t <= 5) {
    for (let i = 1; i <= t; i++) pages.push(i)
  } else if (c <= 3) {
    pages.push(1, 2, 3, 4, 5)
  } else if (c >= t - 2) {
    for (let i = t - 4; i <= t; i++) pages.push(i)
  } else {
    for (let i = c - 2; i <= c + 2; i++) pages.push(i)
  }
  
  return pages
})

const isAllSelected = computed(() =>
  props.users.length > 0 && props.users.every(u => props.selectedIds.includes(u.id))
)

const toggleSelectAll = () => {
  emit('selectAll', !isAllSelected.value)
}
</script>

<style scoped>
.user-table-container {
  @apply rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)];
}

.table-header {
  @apply flex items-center justify-between p-4 border-b border-white/[0.06];
}

.header-left {
  @apply flex items-center gap-3;
}

.table-title {
  @apply text-base font-semibold text-white/90;
}

.table-count {
  @apply text-sm text-white/40;
}

.add-btn {
  @apply inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white
         bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
         hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98]
         transition-all duration-200;
}

.table-wrapper {
  @apply overflow-x-auto;
}

.user-table {
  @apply w-full text-sm;
}

.user-table th {
  @apply px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider;
}

.user-table td {
  @apply px-4 py-3.5;
}

.checkbox {
  @apply w-4 h-4 rounded border-white/20 bg-white/5 text-[#7b2ff7] outline-none cursor-pointer;
}

.empty-state {
  @apply text-center py-16 text-white/25;
}

.empty-content {
  @apply flex flex-col items-center gap-2;
}

.user-row {
  @apply border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-150;
}

.user-info {
  @apply flex items-center gap-3;
}

.user-avatar {
  @apply w-8 h-8 rounded-full bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center text-white text-xs font-bold flex-shrink-0;
}

.user-details {
  @apply min-w-0;
}

.user-name {
  @apply font-medium text-white/90;
}

.user-email {
  @apply text-xs text-white/30;
}

.role-badge {
  @apply inline-flex px-2 py-0.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/50 border border-white/[0.08];
}

.status-badge {
  @apply inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold;
}

.status-badge.active {
  @apply bg-emerald-500/15 text-emerald-400 border border-emerald-500/20;
}

.status-badge.disabled {
  @apply bg-red-500/15 text-red-400 border border-red-500/20;
}

.action-buttons {
  @apply flex items-center justify-end gap-1;
}

.action-btn {
  @apply inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50
         hover:bg-white/[0.08] border border-transparent transition-all duration-150;
}

.action-btn.edit {
  @apply hover:bg-[#7b2ff7]/20 hover:text-[#00d9ff] hover:border-[#7b2ff7]/20;
}

.action-btn.delete {
  @apply hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/20;
}

.table-footer {
  @apply flex items-center justify-between px-5 py-4 border-t border-white/[0.06];
}

.selection-info {
  @apply text-xs text-white/30;
}

.selection-info .highlight {
  @apply text-[#00d9ff] font-semibold;
}

.pagination {
  @apply flex items-center gap-1.5;
}

.page-btn {
  @apply w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150;
}

.page-btn:not(.active) {
  @apply bg-white/[0.05] border border-white/[0.08] text-white/40 hover:bg-white/[0.1] hover:text-white/70;
}

.page-btn.active {
  @apply bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] text-white shadow-[0_2px_8px_rgba(123,47,247,0.3)];
}

.page-btn:disabled {
  @apply opacity-30 cursor-not-allowed;
}
</style>
