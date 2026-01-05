<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <h1 class="logo-title">MJ Prompt Generator</h1>
        <span class="logo-subtitle">Midjourney 提示词生成器</span>
      </div>

      <!-- 搜索栏 -->
      <div class="search-section">
        <PromptSearch />
      </div>

      <div class="header-actions">
        <a
          href="https://github.com/xueshanlinghu/MJPromptGenerator"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
        >
          <n-button
            circle
            size="large"
            title="访问 GitHub 仓库"
          >
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
                </svg>
              </n-icon>
            </template>
          </n-button>
        </a>
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { NButton, NIcon } from 'naive-ui'
import ThemeToggle from './ThemeToggle.vue'
import PromptSearch from './PromptSearch.vue'
</script>

<style scoped>
.app-header {
  /* Glassmorphism 玻璃色渐变 */
  background: linear-gradient(135deg, #E0F2FE 0%, #D1FAE5 50%, #FEF3C7 100%);
  color: var(--text-primary);
  padding: 20px;
  box-shadow: 0 4px 12px var(--shadow-color);
  border-bottom: 1px solid var(--border-light);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.header-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
}

.search-section {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 1150px;
  margin-right: auto;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.logo-subtitle {
  font-size: 13px;
  opacity: 0.8;
  font-weight: 400;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.github-link {
  display: inline-flex;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.github-link:hover {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 16px 20px;
  }

  .header-container {
    flex-wrap: wrap;
    gap: 12px;
  }

  .logo-section {
    order: 1;
  }

  .header-actions {
    order: 2;
  }

  .search-section {
    order: 3;
    width: 100%;
    max-width: 100%;
  }

  .logo-title {
    font-size: 20px;
  }

  .logo-subtitle {
    font-size: 12px;
  }
}
</style>

<style>
/* 暗色主题 - 非 scoped 样式以确保优先级 */
.dark .app-header {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
  border-bottom-color: #334155 !important;
}

.dark .logo-title {
  color: #f1f5f9 !important;
}

.dark .logo-subtitle {
  color: #cbd5e1 !important;
  opacity: 0.9;
}
</style>
