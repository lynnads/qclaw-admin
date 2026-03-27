<template>
  <div class="space-y-4">

    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">项目分析</h1>
        <p class="text-sm text-white/40 mt-1">扫描并管理本地项目</p>
      </div>
      <button
        @click="scanProjects"
        :disabled="isScanning"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white
          bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
          hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg v-if="!isScanning" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {{ isScanning ? '扫描中...' : '重新扫描' }}
      </button>
    </div>

    <!-- 筛选区域 -->
    <div class="rounded-2xl bg-white/[0.05] border border-white/[0.08] overflow-visible shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
      <div class="p-4 space-y-3 relative">
        <!-- 第一行：文件夹选择 + 搜索 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- 文件夹路径选择器 -->
          <div class="flex-1 relative">
            <label class="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">扫描路径</label>
            <div class="relative">
              <button
                @click="showFolderPicker = !showFolderPicker"
                class="w-full h-10 px-3.5 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/70 text-left
                  focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200
                  flex items-center justify-between"
              >
                <span class="truncate">{{ folderOptions.find(f => f.path === selectedPath)?.name || selectedPath }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- 文件夹下拉菜单 -->
              <Transition name="dropdown">
                <div v-if="showFolderPicker" class="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1630]/95 border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden" style="z-index: 9999;" data-dropdown>
                  <div class="max-h-64 overflow-y-auto">
                    <button
                      v-for="folder in folderOptions" :key="folder.path"
                      @click="selectPath(folder)"
                      :class="[
                        'w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 border-l-2',
                        selectedPath === folder.path 
                          ? 'bg-[#7b2ff7]/20 text-[#00d9ff] border-l-[#7b2ff7]'
                          : 'text-white/60 hover:bg-white/[0.05] hover:text-white/80 border-l-transparent',
                      ]"
                    >
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4" />
                        </svg>
                        {{ folder.name }}
                      </div>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>

          <!-- 项目名称搜索 -->
          <div class="flex-1">
            <label class="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">项目名称</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索项目名称..."
                class="w-full h-10 pl-10 pr-4 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white placeholder-white/25 outline-none
                  focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 focus:shadow-[0_0_0_3px_rgba(123,47,247,0.12)]
                  hover:border-white/[0.14] transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <!-- 第二行：框架筛选 + 依赖状态 + 排序 -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- 框架筛选 -->
          <div class="flex-1 relative">
            <label class="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">技术栈</label>
            <button
              @click="showFrameworkPicker = !showFrameworkPicker"
              class="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/70 text-left outline-none focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 flex items-center justify-between"
            >
              <span class="truncate">{{ filterFramework === 'all' ? '全部框架' : filterFramework }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="showFrameworkPicker" class="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1630]/95 border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50" data-dropdown>
                <div class="max-h-48 overflow-y-auto">
                  <button @click="filterFramework = 'all'; showFrameworkPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', filterFramework === 'all' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                    全部框架
                  </button>
                  <button v-for="fw in allFrameworks" :key="fw" @click="filterFramework = fw; showFrameworkPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', filterFramework === fw ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                    {{ fw }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- 依赖状态筛选 -->
          <div class="flex-1 relative">
            <label class="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">依赖状态</label>
            <button
              @click="showDepsPicker = !showDepsPicker"
              class="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/70 text-left outline-none focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 flex items-center justify-between"
            >
              <span class="truncate">{{ filterDepsStatus === 'all' ? '全部状态' : filterDepsStatus === 'installed' ? '已安装' : '未安装' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="showDepsPicker" class="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1630]/95 border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50" data-dropdown>
                <button @click="filterDepsStatus = 'all'; showDepsPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', filterDepsStatus === 'all' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                  全部状态
                </button>
                <button @click="filterDepsStatus = 'installed'; showDepsPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', filterDepsStatus === 'installed' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                  已安装
                </button>
                <button @click="filterDepsStatus = 'notInstalled'; showDepsPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', filterDepsStatus === 'notInstalled' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                  未安装
                </button>
              </div>
            </Transition>
          </div>

          <!-- 排序 -->
          <div class="flex-1 relative">
            <label class="text-xs font-medium text-white/40 uppercase tracking-wider block mb-2">排序方式</label>
            <button
              @click="showSortPicker = !showSortPicker"
              class="w-full h-10 px-3 bg-white/[0.06] border border-white/[0.08] rounded-xl text-sm text-white/70 text-left outline-none focus:bg-white/[0.09] focus:border-[#7b2ff7]/40 hover:border-white/[0.14] transition-all duration-200 flex items-center justify-between"
            >
              <span class="truncate">{{ sortBy === 'name' ? '按名称' : sortBy === 'version' ? '按版本' : '按依赖状态' }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Transition name="dropdown">
              <div v-if="showSortPicker" class="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#1a1630]/95 border border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50" data-dropdown>
                <button @click="sortBy = 'name'; showSortPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', sortBy === 'name' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                  按名称
                </button>
                <button @click="sortBy = 'version'; showSortPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', sortBy === 'version' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                  按版本
                </button>
                <button @click="sortBy = 'depsStatus'; showSortPicker = false" :class="['w-full px-4 py-2.5 text-left text-sm transition-colors', sortBy === 'depsStatus' ? 'bg-[#7b2ff7]/20 text-[#00d9ff]' : 'text-white/60 hover:bg-white/[0.05]']">
                  按依赖状态
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- 第二行：重置按钮 + 结果统计 -->
        <div class="flex items-center justify-between">
          <button
            @click="resetFilters"
            class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-white/50
              hover:text-white/70 hover:bg-white/[0.08] border border-transparent hover:border-white/[0.12]
              transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重置筛选
          </button>
          <p class="text-xs text-white/40">
            共 <span class="text-[#00d9ff] font-semibold">{{ filteredProjects.length }}</span> 个项目
            <span v-if="searchKeyword" class="text-white/25">（已筛选）</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 项目表格 -->
    <div class="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
      <div v-if="isScanning" class="absolute inset-0 z-10 bg-[#1a1630]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
        <div class="flex flex-col items-center gap-3">
          <div class="w-8 h-8 border-2 border-white/10 border-t-[#7b2ff7] rounded-full animate-spin"></div>
          <span class="text-xs text-white/40">扫描项目中...</span>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-white/[0.06]">
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">项目名称</th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">技术栈</th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">Node 版本</th>
              <th class="px-4 py-3.5 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">依赖状态</th>
              <th class="px-4 py-3.5 text-right text-xs font-semibold text-white/40 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProjects.length === 0 && !isScanning">
              <td colspan="5" class="text-center py-16 text-white/25">
                <div class="flex flex-col items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4m0 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7m18 0H3" />
                  </svg>
                  <span class="text-sm">{{ projects.length === 0 ? '暂无项目，点击"重新扫描"开始' : '没有匹配的项目' }}</span>
                </div>
              </td>
            </tr>
            <tr
              v-for="project in filteredProjects" :key="project.path"
              class="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors duration-150 group"
            >
              <td class="px-4 py-3.5">
                <div>
                  <p class="font-medium text-white/90">{{ project.name }}</p>
                  <p class="text-xs text-white/30 mt-0.5">v{{ project.version }}</p>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <span class="inline-flex px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] text-white/60 border border-white/[0.08]">
                  {{ project.framework }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-white/60">{{ project.nodeVersion || 'N/A' }}</span>
                  <button
                    @click="switchNodeVersion(project)"
                    class="px-2 py-1 rounded-lg text-xs text-white/40 hover:text-white/70 hover:bg-white/[0.08]
                      border border-transparent hover:border-white/[0.12] transition-all duration-150"
                  >
                    切换
                  </button>
                </div>
              </td>
              <td class="px-4 py-3.5">
                <span
                  :class="[
                    'inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold',
                    project.depsInstalled
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
                  ]"
                >
                  {{ project.depsInstalled ? '已安装' : '未安装' }}
                </span>
              </td>
              <td class="px-4 py-3.5">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- 安装依赖按钮 -->
                  <button
                    v-if="!project.depsInstalled"
                    @click="installDeps(project)"
                    :disabled="project.installing"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50
                      hover:bg-[#7b2ff7]/20 hover:text-[#00d9ff] border border-transparent
                      hover:border-[#7b2ff7]/20 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-150"
                  >
                    <svg v-if="!project.installing" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {{ project.installing ? '安装中...' : '安装依赖' }}
                  </button>

                  <!-- 运行项目按钮 -->
                  <button
                    @click="runProject(project)"
                    :disabled="project.running"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50
                      hover:bg-emerald-500/20 hover:text-emerald-400 border border-transparent
                      hover:border-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-150"
                  >
                    <svg v-if="!project.running" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {{ project.running ? '运行中...' : '运行项目' }}
                  </button>

                  <!-- 查看详情 -->
                  <button
                    @click="viewDetails(project)"
                    class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/50
                      hover:bg-white/[0.08] hover:text-white/70 border border-transparent
                      hover:border-white/[0.12] transition-all duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    详情
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <Transition name="modal">
      <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showDetailsModal = false"></div>
        <div class="relative w-full max-w-2xl rounded-2xl bg-[#1a1630]/95 backdrop-blur-2xl border border-white/[0.10] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden">
          <div class="h-0.5 bg-gradient-to-r from-[#7b2ff7] via-[#00d9ff] to-[#f107a3]"></div>
          <div class="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <h3 class="text-base font-bold text-white">{{ selectedProject?.name }} - 项目详情</h3>
          </div>
          <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">项目名称</p>
                <p class="text-sm text-white/80">{{ selectedProject?.name }}</p>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">版本</p>
                <p class="text-sm text-white/80">v{{ selectedProject?.version }}</p>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">技术栈</p>
                <p class="text-sm text-white/80">{{ selectedProject?.framework }}</p>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">Node 版本</p>
                <p class="text-sm text-white/80">{{ selectedProject?.nodeVersion || 'N/A' }}</p>
              </div>
              <div class="col-span-2 space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">项目路径</p>
                <p class="text-sm text-white/80 break-all font-mono">{{ selectedProject?.path }}</p>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">依赖状态</p>
                <span
                  :class="[
                    'inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold',
                    selectedProject?.depsInstalled
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
                  ]"
                >
                  {{ selectedProject?.depsInstalled ? '已安装' : '未安装' }}
                </span>
              </div>
              <div class="space-y-1.5">
                <p class="text-xs font-medium text-white/40 uppercase tracking-wider">包管理器</p>
                <p class="text-sm text-white/80">{{ selectedProject?.packageManager || 'npm' }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-6 pb-5">
            <button @click="showDetailsModal = false" class="px-4 py-2.5 rounded-xl text-sm font-medium text-white/50 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] hover:text-white/80 transition-all duration-150">
              关闭
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3456'

const projects = ref([])
const isScanning = ref(false)
const showDetailsModal = ref(false)
const showFolderPicker = ref(false)
const showFrameworkPicker = ref(false)
const showDepsPicker = ref(false)
const showSortPicker = ref(false)
const selectedProject = ref(null)
const selectedPath = ref('D:\\workProject')
const searchKeyword = ref('')
const filterFramework = ref('all')
const filterDepsStatus = ref('all')
const filterNodeVersion = ref('all')
const sortBy = ref('name')

// 文件夹选项
const folderOptions = ref([])

// 加载文件夹列表
const loadFolders = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/folders/list?path=D:\\workProject`)
    const data = await res.json()
    
    if (data.code === 200) {
      folderOptions.value = data.data.folders.map(folder => ({
        name: folder.split('\\').pop(),
        path: folder,
      }))
    }
  } catch (e) {
    console.error('加载文件夹失败:', e)
  }
}

// 从缓存读取项目
const loadFromCache = () => {
  try {
    const cached = localStorage.getItem(`projects_${selectedPath.value}`)
    if (cached) {
      const data = JSON.parse(cached)
      if (Date.now() - data.timestamp < 3600000) {
        projects.value = data.projects.map(p => ({
          ...p,
          installing: false,
          running: false,
        }))
        return true
      }
    }
  } catch (e) {
    console.error('读取缓存失败:', e)
  }
  return false
}

// 保存到缓存
const saveToCache = () => {
  try {
    localStorage.setItem(`projects_${selectedPath.value}`, JSON.stringify({
      timestamp: Date.now(),
      projects: projects.value,
    }))
  } catch (e) {
    console.error('保存缓存失败:', e)
  }
}

// 获取所有框架
const allFrameworks = computed(() => {
  const frameworks = new Set(projects.value.map(p => p.framework))
  return Array.from(frameworks).sort()
})

// 获取所有 Node 版本
const allNodeVersions = computed(() => {
  const versions = new Set(projects.value.map(p => p.nodeVersion))
  return Array.from(versions).sort()
})

// 筛选和排序后的项目列表
const filteredProjects = computed(() => {
  let result = [...projects.value]

  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(keyword))
  }

  if (filterFramework.value !== 'all') {
    result = result.filter(p => p.framework === filterFramework.value)
  }

  if (filterDepsStatus.value !== 'all') {
    const installed = filterDepsStatus.value === 'installed'
    result = result.filter(p => p.depsInstalled === installed)
  }

  if (filterNodeVersion.value !== 'all') {
    result = result.filter(p => p.nodeVersion === filterNodeVersion.value)
  }

  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy.value === 'version') {
      return b.version.localeCompare(a.version)
    } else if (sortBy.value === 'depsStatus') {
      return b.depsInstalled - a.depsInstalled
    }
    return 0
  })

  return result
})

// 选择路径
const selectPath = (folderObj) => {
  selectedPath.value = folderObj.path
  showFolderPicker.value = false
  scanProjects()
}

// 扫描项目
const scanProjects = async (forceRefresh = false) => {
  // 尝试从缓存读取
  if (!forceRefresh && loadFromCache()) {
    showToast('已从缓存加载项目列表', 'success')
    return
  }

  isScanning.value = true
  try {
    const res = await fetch(`${API_BASE}/api/projects/scan?path=${encodeURIComponent(selectedPath.value)}`)
    const data = await res.json()
    
    if (data.code === 200) {
      projects.value = data.data.projects.map(p => ({
        ...p,
        installing: false,
        running: false,
      }))
      saveToCache()
      showToast(`扫描完成，发现 ${data.data.total} 个项目`, 'success')
    } else {
      showToast(data.message || '扫描失败', 'error')
    }
  } catch (e) {
    showToast('扫描出错: ' + e.message, 'error')
  } finally {
    isScanning.value = false
  }
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  filterFramework.value = 'all'
  filterDepsStatus.value = 'all'
  filterNodeVersion.value = 'all'
  sortBy.value = 'name'
}

// 安装依赖
const installDeps = async (project) => {
  project.installing = true
  try {
    const res = await fetch(`${API_BASE}/api/projects/install`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectPath: project.path,
        packageManager: project.packageManager,
      }),
    })
    const data = await res.json()
    
    if (data.code === 200) {
      project.depsInstalled = true
      showToast(`${project.name} 依赖安装成功`, 'success')
    } else {
      showToast(data.message, 'error')
    }
  } catch (e) {
    showToast(`${project.name} 依赖安装失败`, 'error')
  } finally {
    project.installing = false
  }
}

// 运行项目
const runProject = async (project) => {
  project.running = true
  try {
    const res = await fetch(`${API_BASE}/api/projects/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectPath: project.path,
        packageManager: project.packageManager,
      }),
    })
    const data = await res.json()
    
    if (data.code === 200) {
      showToast(`${project.name} 已启动，访问 http://localhost:${data.data.port}`, 'success')
    } else {
      showToast(data.message, 'error')
    }
  } catch (e) {
    showToast(`${project.name} 启动失败`, 'error')
  } finally {
    project.running = false
  }
}

// 切换 Node 版本
const switchNodeVersion = async (project) => {
  try {
    const res = await fetch(`${API_BASE}/api/node/switch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: project.nodeVersion }),
    })
    const data = await res.json()
    
    if (data.code === 200) {
      showToast(data.message, 'success')
    } else {
      showToast(data.message, 'error')
    }
  } catch (e) {
    showToast('切换失败', 'error')
  }
}

// 查看详情
const viewDetails = (project) => {
  selectedProject.value = project
  showDetailsModal.value = true
}

// Toast 提示
let _t = null
const showToast = (msg, type = 'success') => {
  const c = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b' }[type] || '#3b82f6'
  const ic = {
    success: `<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>`,
    error: `<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>`,
  }[type] || `<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>`
  document.getElementById('_t')?.remove()
  document.body.insertAdjacentHTML('beforeend', `<div id="_t" style="position:fixed;top:20px;right:20px;z-index:99999;display:flex;align-items:center;gap:10px;padding:12px 18px;background:#1e1b4b;border-left:4px solid ${c};border-radius:10px;box-shadow:0 4px 24px rgba(0,0,0,.4);font-size:14px;color:#fff;animation:_ta .3s ease"><svg xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;color:${c};flex-shrink:0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">${ic}</svg><span>${msg}</span></div><style>@keyframes _ta{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}</style>`)
  clearTimeout(_t)
  _t = setTimeout(() => document.getElementById('_t')?.remove(), 3000)
}

// 关闭所有下拉框
const closeAllPickers = (e) => {
  // 如果点击的不是按钮或下拉菜单内部，关闭所有下拉框
  if (!e.target.closest('button') && !e.target.closest('[data-dropdown]')) {
    showFolderPicker.value = false
    showFrameworkPicker.value = false
    showDepsPicker.value = false
    showSortPicker.value = false
  }
}

onMounted(() => {
  loadFolders()
  scanProjects()
  
  // 点击外部关闭所有下拉框
  setTimeout(() => {
    document.addEventListener('click', closeAllPickers)
  }, 100)
})

onUnmounted(() => {
  document.removeEventListener('click', closeAllPickers)
})
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease }
.modal-enter-from, .modal-leave-to { opacity: 0 }
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: scale(0.95) translateY(10px) }
</style>
