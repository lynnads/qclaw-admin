<template>
  <div class="space-y-6">

    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">控制台</h1>
        <p class="text-sm text-white/40 mt-1">欢迎回来，{{ currentDate }}</p>
      </div>
      <button class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white
        bg-gradient-to-r from-[#7b2ff7] to-[#00d9ff] shadow-[0_4px_16px_rgba(123,47,247,0.3)]
        hover:shadow-[0_6px_24px_rgba(123,47,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        导出数据
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div
        v-for="(stat, i) in stats" :key="i"
        class="group relative rounded-2xl overflow-hidden
          bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
          hover:bg-white/[0.09] hover:border-white/[0.15] hover:-translate-y-0.5
          transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
      >
        <div class="p-5">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-medium text-white/40 uppercase tracking-wider">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-white mt-2">{{ stat.value }}</p>
              <div class="flex items-center gap-1 mt-2">
                <svg v-if="stat.trend > 0" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span :class="stat.trend > 0 ? 'text-emerald-400' : 'text-red-400'" class="text-xs font-semibold">
                  {{ Math.abs(stat.trend) }}%
                </span>
                <span class="text-xs text-white/30">较上月</span>
              </div>
            </div>
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center', stat.iconBg]">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path v-for="(d,idx) in stat.icon" :key="idx" stroke-linecap="round" stroke-linejoin="round" :d="d" />
              </svg>
            </div>
          </div>
        </div>
        <!-- 底部渐变线 -->
        <div :class="['h-0.5 w-full', stat.gradient]"></div>
      </div>
    </div>

    <!-- 图表 & 动态 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <!-- 数据图表 -->
      <div class="xl:col-span-2 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        <div class="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <h2 class="text-sm font-semibold text-white">数据概览</h2>
          <div class="flex gap-1.5">
            <button
              v-for="p in ['日','周','月']" :key="p"
              @click="activePeriod = p"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                activePeriod === p
                  ? 'bg-gradient-to-r from-[#7b2ff7]/80 to-[#00d9ff]/80 text-white shadow-[0_2px_8px_rgba(123,47,247,0.3)]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.06]',
              ]"
            >{{ p }}</button>
          </div>
        </div>
        <div class="p-5">
          <div class="h-52 flex items-end gap-3 px-2">
            <div
              v-for="(h, i) in chartBars" :key="i"
              class="flex-1 rounded-t-xl transition-all duration-300 cursor-pointer group"
              :class="i === chartBars.length - 1
                ? 'bg-gradient-to-t from-[#7b2ff7] to-[#00d9ff] shadow-[0_0_16px_rgba(123,47,247,0.3)]'
                : 'bg-white/[0.08] hover:bg-white/[0.15]'"
              :style="{ height: h + '%', minHeight: '8%' }"
            >
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-center text-xs text-white/60 mt-2">{{ h }}%</div>
            </div>
          </div>
          <div class="flex justify-between mt-3 px-2 text-xs text-white/25">
            <span>1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span>
          </div>
        </div>
      </div>

      <!-- 最新动态 -->
      <div class="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
        <div class="p-5 border-b border-white/[0.06]">
          <h2 class="text-sm font-semibold text-white">最新动态</h2>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(item, i) in activities" :key="i" class="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-colors duration-150">
            <div :class="['w-2 h-2 rounded-full mt-1.5 flex-shrink-0', item.dot]"></div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-white/70 leading-relaxed">{{ item.text }}</p>
              <p class="text-xs text-white/25 mt-1">{{ item.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.15)]">
      <div class="p-5 border-b border-white/[0.06]">
        <h2 class="text-sm font-semibold text-white">快捷入口</h2>
      </div>
      <div class="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          v-for="(s, i) in shortcuts" :key="i"
          class="flex flex-col items-center gap-3 p-4 rounded-xl
            bg-white/[0.04] border border-white/[0.06]
            hover:bg-white/[0.09] hover:border-white/[0.12] hover:-translate-y-0.5
            active:scale-[0.97] transition-all duration-200"
        >
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', s.iconBg]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path v-for="(d,idx) in s.icon" :key="idx" stroke-linecap="round" stroke-linejoin="round" :d="d" />
            </svg>
          </div>
          <span class="text-xs font-medium text-white/70">{{ s.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const today = new Date()
const currentDate = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
const activePeriod = ref('月')

const stats = [
  {
    title: '总用户数', value: '12,845', trend: 12.5,
    iconBg: 'bg-[#7b2ff7]/20 text-[#7b2ff7]',
    gradient: 'bg-gradient-to-r from-[#7b2ff7] to-transparent',
    icon: ['M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'],
  },
  {
    title: '总订单数', value: '8,642', trend: 8.2,
    iconBg: 'bg-[#00d9ff]/20 text-[#00d9ff]',
    gradient: 'bg-gradient-to-r from-[#00d9ff] to-transparent',
    icon: ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
  },
  {
    title: '活跃度', value: '68.5%', trend: 3.1,
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    gradient: 'bg-gradient-to-r from-emerald-500 to-transparent',
    icon: ['M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'],
  },
  {
    title: '总收入', value: '¥98,542', trend: 23.4,
    iconBg: 'bg-[#f107a3]/20 text-[#f107a3]',
    gradient: 'bg-gradient-to-r from-[#f107a3] to-transparent',
    icon: ['M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'],
  },
]

const chartBars = [45, 62, 55, 78, 68, 92]

const activities = [
  { text: '张三 完成了用户资料更新', time: '3 分钟前', dot: 'bg-[#7b2ff7]' },
  { text: '李四 提交了新订单 #10234', time: '15 分钟前', dot: 'bg-[#00d9ff]' },
  { text: '王五 评论了你的文章', time: '1 小时前', dot: 'bg-emerald-400' },
  { text: '系统完成每日数据备份', time: '2 小时前', dot: 'bg-[#f107a3]' },
  { text: '赵六 修改了个人设置', time: '3 小时前', dot: 'bg-amber-400' },
]

const shortcuts = [
  {
    label: '用户管理',
    iconBg: 'bg-[#7b2ff7]/20 text-[#7b2ff7]',
    icon: ['M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'],
  },
  {
    label: '订单管理',
    iconBg: 'bg-[#00d9ff]/20 text-[#00d9ff]',
    icon: ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
  },
  {
    label: '数据分析',
    iconBg: 'bg-emerald-500/20 text-emerald-400',
    icon: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
  },
  {
    label: '系统设置',
    iconBg: 'bg-[#f107a3]/20 text-[#f107a3]',
    icon: [
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
      'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    ],
  },
]
</script>
