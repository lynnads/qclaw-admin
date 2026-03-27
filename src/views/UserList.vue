<template>
  <div class="space-y-4">

    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">用户列表</h1>
        <p class="text-sm text-white/40 mt-1">共 {{ total }} 位用户</p>
      </div>
      <button
        @click="openAddModal"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
          hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        新增用户
      </button>
    </div>

    <!-- 搜索 & 筛选 -->
    <div class="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
      <div class="flex flex-col sm:flex-row gap-3 p-4">
        <!-- 搜索框 -->
        <div class="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索用户名、邮箱..."
            class="w-full h-10 pl-10 pr-4 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/25 outline-none
              focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)]
              hover:border-white/[0.14] transition-all duration-200"
          />
        </div>
        <!-- 角色筛选 -->
        <select
          v-model="filterRole"
          class="h-10 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/60 outline-none
            focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 cursor-pointer"
        >
          <option value="" class="bg-[#1a1630]">全部角色</option>
          <option value="管理员" class="bg-[#1a1630]">管理员</option>
          <option value="用户" class="bg-[#1a1630]">用户</option>
          <option value="访客" class="bg-[#1a1630]">访客</option>
        </select>
        <!-- 状态筛选 -->
        <select
          v-model="filterStatus"
          class="h-10 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/60 outline-none
            focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 cursor-pointer"
        >
          <option value="" class="bg-[#1a1630]">全部状态</option>
          <option value="active" class="bg-[#1a1630]">正常</option>
          <option value="disabled" class="bg-[#1a1630]">禁用</option>
        </select>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative">
      <!-- Loading -->
      <div v-if="isLoading" class="absolute inset-0 z-10 bg-[#1a1630]/80 backdrop-blur-sm flex items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-white/10 border-t-[#7b2ff7] rounded-full animate-spin"></div>
          <span class="text-xs text-white/40">加载中...</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/[0.06]">
              <th class="w-12 px-4 py-3.5 text-left">
                <input type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7b2ff7] outline-none cursor-pointer" @change="toggleSelectAll" :checked="isAllSelected" />
              </th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">用户</th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">角色</th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">状态</th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">注册时间</th>
              <th class="px-4 py-3.5 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedUsers.length === 0 && !isLoading">
              <td colspan="6" class="text-center py-16 text-white/25">
                <div class="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <span class="text-sm">暂无数据</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="user in paginatedUsers" :key="user.id"
              class="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-150 group"
            >
              <td class="px-4 py-3.5">
                <input type="checkbox" class="w-4 h-4 rounded border-white/20 bg-white/5 text-[#7b2ff7] outline-none cursor-pointer" :value="user.id" v-model="selectedIds" />
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#7b2ff7] to-[#00d9ff] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="font-medium text-white/90">{{ user.name }}</p>
                    <p class="text-xs text-white/30">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex px-2 py-0.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/50 border border-white/[0.08]">
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <span
                  :class="[
                    'inline-flex px-2 py-0.5 rounded-lg text-xs font-semibold',
                    user.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/15 text-red-400 border border-red-500/20',
                  ]"
                >
                  {{ user.status === 'active' ? '正常' : '禁用' }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-white/35 text-xs">{{ user.createTime }}</td>
              <td class="px-4 py-3.5">
                <div class="flex items-center justify-end gap-1">
                  <button
                    @click="openEditModal(user)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50
                      hover:bg-[#7b2ff7]/20 hover:text-[#00d9ff] border border-transparent
                      hover:border-[#7b2ff7]/20 transition-all duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    编辑
                  </button>
                  <button
                    @click="confirmDelete(user)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50
                      hover:bg-red-500/15 hover:text-red-400 border border-transparent
                      hover:border-red-500/20 transition-all duration-150"
                  >
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
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-white/[0.06]">
        <p class="text-xs text-white/30">
          已选中 <span class="text-[#00d9ff] font-semibold">{{ selectedIds.length }}</span> 项
        </p>
        <div class="flex items-center gap-1.5">
          <button
            @click="currentPage--" :disabled="currentPage === 1"
            class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40
              hover:bg-white/[0.1] hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            v-for="page in displayedPages" :key="page"
            @click="currentPage = page"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-all duration-150',
              page === currentPage
                ? 'bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] text-white shadow-[0_2px_8px_rgba(123,47,247,0.3)]'
                : 'bg-white/[0.05] border border-white/[0.08] text-white/40 hover:bg-white/[0.1] hover:text-white/70',
            ]"
          >{{ page }}</button>
          <button
            @click="currentPage++" :disabled="currentPage === totalPages"
            class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/40
              hover:bg-white/[0.1] hover:text-white/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
        <div class="relative w-full max-w-md rounded-2xl bg-[#1a1630]/95 backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <!-- 顶部渐变条 -->
          <div class="h-0.5 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#f107a3]"></div>
          <div class="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <h3 class="text-base font-bold text-white">{{ isEditing ? '编辑用户' : '新增用户' }}</h3>
          </div>
          <div class="p-6 space-y-4">
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-white/40 uppercase tracking-wider">用户名</label>
              <input
                v-model="form.name" type="text" placeholder="请输入用户名"
                class="w-full h-11 px-4 bg-white/[0.06] border rounded-xl text-sm text-white placeholder-white/25 outline-none
                  focus:bg-white/[0.09] focus:border-[#7b2ff7]/50 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)]
                  hover:border-white/[0.14] transition-all duration-200"
                :class="{ 'border-red-500/50': formErrors.name }"
              />
              <p v-if="formErrors.name" class="text-xs text-red-400">{{ formErrors.name }}</p>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-white/40 uppercase tracking-wider">邮箱</label>
              <input
                v-model="form.email" type="text" placeholder="请输入邮箱"
                class="w-full h-11 px-4 bg-white/[0.06] border rounded-xl text-sm text-white placeholder-white/25 outline-none
                  focus:bg-white/[0.09] focus:border-[#7b2ff7]/50 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)]
                  hover:border-white/[0.14] transition-all duration-200"
                :class="{ 'border-red-500/50': formErrors.email }"
              />
              <p v-if="formErrors.email" class="text-xs text-red-400">{{ formErrors.email }}</p>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-white/40 uppercase tracking-wider">角色</label>
              <select
                v-model="form.role"
                class="w-full h-11 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white outline-none
                  focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 cursor-pointer"
              >
                <option value="管理员" class="bg-[#1a1630]">管理员</option>
                <option value="用户" class="bg-[#1a1630]">用户</option>
                <option value="访客" class="bg-[#1a1630]">访客</option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-medium text-white/40 uppercase tracking-wider">状态</label>
              <select
                v-model="form.status"
                class="w-full h-11 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white outline-none
                  focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 cursor-pointer"
              >
                <option value="active" class="bg-[#1a1630]">正常</option>
                <option value="disabled" class="bg-[#1a1630]">禁用</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 pb-5">
            <button @click="closeModal" class="px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] hover:text-white/80 transition-all duration-150">
              取消
            </button>
            <button
              @click="submitForm"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white
                bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
                hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {{ isEditing ? '保存' : '新增' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 删除确认弹窗 -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
        <div class="relative w-full max-w-sm rounded-2xl bg-[#1a1630]/95 backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div class="h-0.5 bg-gradient-to-r from-red-500 to-red-400"></div>
          <div class="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <h3 class="text-base font-bold text-white">确认删除</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-white/60">确定要删除用户 <span class="font-semibold text-white">{{ deleteTarget?.name }}</span> 吗？此操作不可撤销。</p>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 pb-5">
            <button @click="showDeleteConfirm = false" class="px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] hover:text-white/80 transition-all duration-150">
              取消
            </button>
            <button
              @click="doDelete"
              class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white
                bg-gradient-to-r from-red-500 to-red-400 shadow-[0_4px_16px_rgba(239,68,68,0.3)]
                hover:shadow-[0_6px_24px_rgba(239,68,68,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getUserList, addUser, editUser, deleteUser } from '../api/user'

const pageSize = 5
const currentPage = ref(1)
const total = ref(0)
const searchKeyword = ref('')
const filterRole = ref('')
const filterStatus = ref('')
const selectedIds = ref([])
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const isEditing = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)
const tableData = ref([])
const isLoading = ref(false)

const form = ref({ name: '', email: '', role: '用户', status: 'active' })
const formErrors = ref({ name: '', email: '' })

const loadData = async () => {
  isLoading.value = true
  try {
    const res = await getUserList({
      keyword: searchKeyword.value, role: filterRole.value,
      status: filterStatus.value, page: currentPage.value, pageSize,
    })
    tableData.value = res.data?.list || []
    total.value = res.data?.total || 0
  } finally {
    isLoading.value = false
  }
}

onMounted(() => loadData())
watch([searchKeyword, filterRole, filterStatus], () => { currentPage.value = 1; loadData() })
watch(currentPage, () => loadData())

const totalPages = computed(() => Math.ceil(total.value / pageSize))
const paginatedUsers = computed(() => tableData.value)

const displayedPages = computed(() => {
  const pages = [], t = totalPages.value, c = currentPage.value
  if (t <= 5) { for (let i = 1; i <= t; i++) pages.push(i) }
  else if (c <= 3) { pages.push(1,2,3,4,5) }
  else if (c >= t - 2) { for (let i = t - 4; i <= t; i++) pages.push(i) }
  else { for (let i = c - 2; i <= c + 2; i++) pages.push(i) }
  return pages
})

const isAllSelected = computed(() =>
  paginatedUsers.value.length > 0 && paginatedUsers.value.every(u => selectedIds.value.includes(u.id))
)
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !paginatedUsers.value.find(u => u.id === id))
  } else {
    paginatedUsers.value.forEach(u => { if (!selectedIds.value.includes(u.id)) selectedIds.value.push(u.id) })
  }
}

const openAddModal = () => {
  isEditing.value = false; editingId.value = null
  form.value = { name: '', email: '', role: '用户', status: 'active' }
  formErrors.value = { name: '', email: '' }
  showModal.value = true
}
const openEditModal = user => {
  isEditing.value = true; editingId.value = user.id
  form.value = { ...user }; formErrors.value = { name: '', email: '' }
  showModal.value = true
}
const closeModal = () => { showModal.value = false }

const submitForm = async () => {
  formErrors.value = { name: '', email: '' }
  let valid = true
  if (!form.value.name.trim()) { formErrors.value.name = '请输入用户名'; valid = false }
  if (!form.value.email.trim()) { formErrors.value.email = '请输入邮箱'; valid = false }
  if (!valid) return
  if (isEditing.value) { await editUser(editingId.value, form.value) }
  else { await addUser(form.value) }
  closeModal(); loadData()
}

const confirmDelete = user => { deleteTarget.value = user; showDeleteConfirm.value = true }
const doDelete = async () => {
  await deleteUser(deleteTarget.value?.id)
  showDeleteConfirm.value = false; deleteTarget.value = null; loadData()
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease }
.modal-enter-from, .modal-leave-to { opacity: 0 }
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: scale(0.95) translateY(10px) }
</style>
