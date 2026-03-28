<template>
  <div class="github-trending">
    <div class="page-header">
      <h1 class="page-title">GitHub 热门项目</h1>
      <p class="page-subtitle">探索最受欢迎的开源项目</p>
    </div>

    <div class="trending-grid">
      <div v-for="repo in trendingRepos" :key="repo.id" class="repo-card">
        <div class="repo-header">
          <div class="repo-info">
            <div class="repo-avatar">
              <img :src="repo.owner.avatar_url" :alt="repo.owner.login" />
            </div>
            <div class="repo-details">
              <h3 class="repo-name">{{ repo.full_name }}</h3>
              <p class="repo-description">{{ repo.description }}</p>
            </div>
          </div>
          <a :href="repo.html_url" target="_blank" class="repo-link">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div class="repo-stats">
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{{ repo.stargazers_count }}</span>
          </div>
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{{ repo.forks_count }}</span>
          </div>
          <div class="stat">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{{ repo.open_issues_count }}</span>
          </div>
        </div>

        <div class="repo-languages">
          <span v-if="repo.language" class="language-tag">{{ repo.language }}</span>
          <span class="update-time">更新于 {{ formatDate(repo.updated_at) }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && trendingRepos.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
      <p>暂无数据</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Repo {
  id: number
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string
  updated_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

const trendingRepos = ref<Repo[]>([])
const loading = ref(false)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const fetchTrending = async () => {
  loading.value = true
  try {
    // 使用 GitHub API 获取热门项目
    const response = await fetch('https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=12')
    const data = await response.json()
    trendingRepos.value = data.items || []
  } catch (error) {
    console.error('Failed to fetch trending repos:', error)
    // 使用模拟数据
    trendingRepos.value = [
      {
        id: 1,
        full_name: 'facebook/react',
        description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
        html_url: 'https://github.com/facebook/react',
        stargazers_count: 218000,
        forks_count: 45000,
        open_issues_count: 800,
        language: 'JavaScript',
        updated_at: '2024-01-15T10:30:00Z',
        owner: {
          login: 'facebook',
          avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        },
      },
      {
        id: 2,
        full_name: 'vuejs/core',
        description: 'The progressive JavaScript framework for building user interfaces.',
        html_url: 'https://github.com/vuejs/core',
        stargazers_count: 42000,
        forks_count: 7000,
        open_issues_count: 300,
        language: 'TypeScript',
        updated_at: '2024-01-14T09:00:00Z',
        owner: {
          login: 'vuejs',
          avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
        },
      },
      {
        id: 3,
        full_name: 'tailwindlabs/tailwindcss',
        description: 'A utility-first CSS framework for rapid UI development.',
        html_url: 'https://github.com/tailwindlabs/tailwindcss',
        stargazers_count: 75000,
        forks_count: 3800,
        open_issues_count: 150,
        language: 'CSS',
        updated_at: '2024-01-13T14:20:00Z',
        owner: {
          login: 'tailwindlabs',
          avatar_url: 'https://avatars.githubusercontent.com/u/67151005?v=4',
        },
      },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTrending()
})
</script>

<style scoped>
.github-trending {
  @apply space-y-6;
}

.page-header {
  @apply mb-6;
}

.page-title {
  @apply text-2xl font-bold text-white/90;
}

.page-subtitle {
  @apply text-sm text-white/40 mt-1;
}

.trending-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.repo-card {
  @apply relative overflow-hidden rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.08]
         shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-5 transition-all duration-200 hover:bg-white/[0.08];
}

.repo-header {
  @apply flex items-start justify-between gap-4 mb-4;
}

.repo-info {
  @apply flex items-start gap-3 flex-1 min-w-0;
}

.repo-avatar {
  @apply w-10 h-10 rounded-full overflow-hidden flex-shrink-0;
}

.repo-avatar img {
  @apply w-full h-full object-cover;
}

.repo-details {
  @apply flex-1 min-w-0;
}

.repo-name {
  @apply text-sm font-semibold text-white/90 truncate;
}

.repo-description {
  @apply text-xs text-white/40 mt-1 line-clamp-2;
}

.repo-link {
  @apply p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.08] transition-all duration-150;
}

.repo-stats {
  @apply flex items-center gap-4 mb-3;
}

.stat {
  @apply flex items-center gap-1.5 text-xs text-white/40;
}

.repo-languages {
  @apply flex items-center justify-between;
}

.language-tag {
  @apply px-2 py-0.5 rounded-lg text-xs font-medium bg-white/[0.06] text-white/50 border border-white/[0.08];
}

.update-time {
  @apply text-xs text-white/30;
}

.loading-state {
  @apply flex flex-col items-center justify-center py-16 text-white/40;
}

.loading-spinner {
  @apply w-8 h-8 border-2 border-white/10 border-t-[#7b2ff7] rounded-full animate-spin mb-3;
}

.empty-state {
  @apply flex flex-col items-center justify-center py-16 text-white/25;
}
</style>
