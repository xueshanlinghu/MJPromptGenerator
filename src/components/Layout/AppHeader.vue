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

/* 暗色主题 */
:global(.dark) .app-header {
  background: linear-gradient(135deg, #0c4a6e 0%, #064e3b 50%, #78350f 100%);
  box-shadow: 0 4px 12px var(--shadow-color);
  border-bottom-color: var(--border-color);
}

:global(.dark) .logo-title {
  color: var(--text-primary);
}

:global(.dark) .logo-subtitle {
  color: var(--text-secondary);
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
