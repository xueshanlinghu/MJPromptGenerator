<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <h1 class="logo-title">MJ Prompt Generator</h1>
        <span class="logo-subtitle">Midjourney 提示词生成器</span>
      </div>

      <div class="header-actions">
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
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
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 16px 20px;
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
