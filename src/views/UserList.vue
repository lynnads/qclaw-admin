<template>
  <div class="user-list">
    <!-- 搜索和筛选 -->
    <div class="filter-bar">
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索用户名、邮箱..."
          class="search-input"
        />
      </div>
      <CustomSelect v-model="filterRole" :options="roleOptions" placeholder="全部角色" />
      <CustomSelect v-model="filterStatus" :options="statusOptions" placeholder="全部状态" />
    </div>

    <!-- 用户表格 -->
    <UserTable
      :users="paginatedUsers"
      :total="total"
      :current-page="currentPage"
      :page-size="pageSize"
      :selected-ids="selectedIds"
      @add="openAddModal"
      @edit="openEditModal"
      @delete="confirmDelete"
      @page-change="handlePageChange"
      @select-all="handleSelectAll"
      @toggle-select="handleToggleSelect"
    />

    <!-- 新增/编辑弹窗 -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ isEditing ? '编辑用户' : '新增用户' }}</h3>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>用户名</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="请输入用户名"
                class="form-input"
                :class="{ error: formErrors.name }"
              />
              <p v-if="formErrors.name" class="error-text">{{ formErrors.name }}</p>
            </div>
            <div class="form-group">
              <label>邮箱</label>
              <input
                v-model="form.email"
                type="text"
                placeholder="请输入邮箱"
                class="form-input"
                :class="{ error: formErrors.email }"
              />
              <p v-if="formErrors.email" class="error-text">{{ formErrors.email }}</p>
            </div>
            <div class="form-group">
              <label>角色</label>
              <CustomSelect v-model="form.role" :options="roleOptions" />
            </div>
            <div class="form-group">
              <label>状态</label>
              <CustomSelect v-model="form.status" :options="statusOptions" />
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">取消</button>
            <button @click="submitForm" class="btn-submit">
              {{ isEditing ? '保存' : '新增' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 删除确认弹窗 -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
        <div class="modal-content delete-modal" @click.stop>
          <div class="modal-header danger">
            <h3>确认删除</h3>
          </div>
          <div class="modal-body">
            <p>确定要删除用户 <span class="highlight">{{ deleteTarget?.name }}</span> 吗？此操作不可撤销。</p>
          </div>
          <div class="modal-footer">
            <button @click="showDeleteConfirm = false" class="btn-cancel">取消</button>
            <button @click="doDelete" class="btn-danger">确认删除</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { UserTable, CustomSelect } from '@/components'
import { userService } from '@/services/userService'
import { useUiStore } from '@/stores/ui'
import type { User } from '@/types'

const uiStore = useUiStore()

// 分页配置
const pageSize = 5
const currentPage = ref(1)
const total = ref(0)

// 过滤条件
const searchKeyword = ref('')
const filterRole = ref('')
const filterStatus = ref('')

// 选中项
const selectedIds = ref<(number | string)[]>([])

// 弹窗状态
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const editingId = ref<number | string | null>(null)
const deleteTarget = ref<User | null>(null)

// 表单数据
const form = ref({
  name: '',
  email: '',
  role: '用户',
  status: 'active' as 'active' | 'disabled',
})
const formErrors = ref({ name: '', email: '' })

// 用户数据
const tableData = ref<User[]>([])
const isLoading = ref(false)

// 角色列表
const roles = ['管理员', '用户', '访客']

const roleOptions = computed(() => [
  { value: '', label: '全部角色' },
  ...roles.map(r => ({ value: r, label: r }))
])

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'active', label: '正常' },
  { value: 'disabled', label: '禁用' },
]

// 计算属性
const totalPages = computed(() => Math.ceil(total.value / pageSize))

const paginatedUsers = computed(() => tableData.value)

// 方法
const loadData = async () => {
  isLoading.value = true
  try {
    const response = await userService.getUserList({
      keyword: searchKeyword.value,
      role: filterRole.value,
      status: filterStatus.value,
      page: currentPage.value,
      pageSize,
    })
    
    if (response.code === 200) {
      // 兼容 list 和 users 两种字段名
      tableData.value = response.data?.list || response.data?.users || []
      total.value = response.data?.total || 0
    }
  } catch (error) {
    console.error('加载用户列表失败:', error)
    uiStore.showError('加载用户列表失败')
  } finally {
    isLoading.value = false
  }
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleSelectAll = (selected: boolean) => {
  if (selected) {
    selectedIds.value = paginatedUsers.value.map(u => u.id)
  } else {
    selectedIds.value = []
  }
}

const handleToggleSelect = (id: number | string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const openAddModal = () => {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', email: '', role: '用户', status: 'active' }
  formErrors.value = { name: '', email: '' }
  showModal.value = true
}

const openEditModal = (user: User) => {
  isEditing.value = true
  editingId.value = user.id
  form.value = { 
    name: user.name || '',
    email: user.email || '',
    role: user.role || '用户',
    status: user.status || 'active'
  }
  formErrors.value = { name: '', email: '' }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const submitForm = async () => {
  formErrors.value = { name: '', email: '' }
  let valid = true

  if (!form.value.name.trim()) {
    formErrors.value.name = '请输入用户名'
    valid = false
  }

  if (!form.value.email.trim()) {
    formErrors.value.email = '请输入邮箱'
    valid = false
  }

  if (!valid) return

  try {
    if (isEditing.value && editingId.value) {
      await userService.editUser(editingId.value as number | string, form.value)
      uiStore.showSuccess('用户保存成功')
    } else {
      await userService.addUser(form.value)
      uiStore.showSuccess('用户新增成功')
    }
    closeModal()
    loadData()
  } catch (error) {
    uiStore.showError('操作失败，请重试')
  }
}

const confirmDelete = (user: User) => {
  deleteTarget.value = user
  showDeleteConfirm.value = true
}

const doDelete = async () => {
  if (!deleteTarget.value) return

  try {
    await userService.deleteUser(deleteTarget.value.id)
    uiStore.showSuccess('用户删除成功')
    showDeleteConfirm.value = false
    deleteTarget.value = null
    loadData()
  } catch (error) {
    uiStore.showError('删除失败，请重试')
  }
}

// 监听过滤条件变化
watch([searchKeyword, filterRole, filterStatus], () => {
  currentPage.value = 1
  loadData()
})

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-list {
  @apply space-y-4;
}

.filter-bar {
  @apply flex items-center gap-3 flex-wrap;
}

.search-box {
  @apply relative flex items-center flex-1 min-w-[200px] max-w-[300px];
}

.search-box svg {
  @apply absolute left-3 text-white/30 pointer-events-none;
}

.search-input {
  @apply w-full h-10 pl-10 pr-4 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white
         placeholder-white/25 outline-none focus:bg-white/[0.09] focus:border-[#7b2ff7]/40
         focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)] hover:border-white/[0.14] transition-all duration-200;
}

.filter-select {
  @apply h-10 pl-3 pr-9 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/60 outline-none
         focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 cursor-pointer
         w-full appearance-none;
}

/* 弹窗样式 */
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm;
}

.modal-content {
  @apply w-full max-w-md rounded-2xl bg-[#1a1630]/95 backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden;
}

.modal-header {
  @apply px-6 py-4 border-b border-white/[0.06];
}

.modal-header h3 {
  @apply text-base font-bold text-white;
}

.modal-header.danger {
  @apply border-red-500/30;
}

.modal-header.danger h3 {
  @apply text-red-400;
}

.modal-body {
  @apply p-6 space-y-4;
}

.form-group {
  @apply space-y-1.5;
}

.form-group label {
  @apply text-xs font-medium text-white/40 uppercase tracking-wider;
}

.form-input,
.form-select {
  @apply w-full h-11 pl-4 pr-9 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white
         outline-none focus:bg-white/[0.09] focus:border-[#7b2ff7]/50 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)]
         hover:border-white/[0.14] transition-all duration-200 appearance-none;
}

.form-input.error {
  @apply border-red-500/50 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)];
}

.error-text {
  @apply text-xs text-red-400;
}

.highlight {
  @apply font-semibold text-white;
}

.modal-footer {
  @apply flex items-center justify-end gap-2 px-6 pb-5;
}

.btn-cancel {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/[0.06] border border-white/[0.08]
         hover:bg-white/[0.10] hover:text-white/80 transition-all duration-150;
}

.btn-submit {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium text-white
         bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
         hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98]
         transition-all duration-200;
}

.btn-danger {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium text-white
         bg-gradient-to-r from-red-500 to-red-400 shadow-[0_4px_16px_rgba(239,68,68,0.3)]
         hover:shadow-[0_6px_24px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-[0.98]
         transition-all duration-200;
}

/* 弹窗动画 */
.modal-enter-active,
.modal-leave-active {
  @apply transition-all duration-200;
}

.modal-enter-from,
.modal-leave-to {
  @apply opacity-0;
}

.modal-enter-from > .modal-content,
.modal-leave-to > .modal-content {
  @apply transform scale-95 translate-y-2;
}

/* Select wrapper */
.select-wrapper {
  @apply relative;
}

.select-arrow {
  @apply absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none;
}
</style>
