<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <div class="app-container">
        <AppHeader />
        <main class="main-content">
          <div class="content-grid">
            <!-- 左侧：提示词选择区 -->
            <section class="left-panel panel">
              <n-card size="small" :bordered="false" class="prompt-panel-card">
                <PromptPanel />
              </n-card>
            </section>

            <!-- 中间：参数设置区 -->
            <section class="middle-panel panel">
              <n-card size="small" :bordered="false" class="parameter-panel-card">
                <ParameterPanel />
              </n-card>
            </section>

            <!-- 右侧：结果预览区 -->
            <section class="right-panel panel">
              <n-card title="✨ 已选提示词" size="small" :bordered="false">
                <SelectedPrompts
                  :selected-prompts="selectedPrompts"
                  @remove="handleRemovePrompt"
                />
              </n-card>
              <n-card title="🎯 最终提示词" size="small" :bordered="false" class="result-card">
                <FinalPrompt />
              </n-card>
            </section>
          </div>
        </main>
        <AppFooter />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NCard } from 'naive-ui'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from './stores/themeStore'
import { usePromptStore } from './stores/promptStore'
import AppHeader from './components/Layout/AppHeader.vue'
import AppFooter from './components/Layout/AppFooter.vue'
import PromptPanel from './components/PromptBuilder/PromptPanel.vue'
import SelectedPrompts from './components/PromptBuilder/SelectedPrompts.vue'
import ParameterPanel from './components/ParameterPanel/ParameterPanel.vue'
import FinalPrompt from './components/ResultPanel/FinalPrompt.vue'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.naiveTheme)

const promptStore = usePromptStore()
const { selectedPrompts } = storeToRefs(promptStore)

// 移除已选提示词
const handleRemovePrompt = (categoryId: string, promptId: string) => {
  promptStore.removePrompt(categoryId, promptId)
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
}

.main-content {
  flex: 1;
  width: 100%;
  padding: 20px;
}

/* 三栏网格布局 */
.content-grid {
  display: grid;
  gap: 20px;
  min-height: calc(100vh - 200px);
  width: 100%;
}

/* 大屏幕（1200px+）：三栏布局 - 撑满整个屏幕 */
@media (min-width: 1200px) {
  .content-grid {
    /* 左侧（提示词）：中间（参数）：右侧（结果） = 2.5 : 1 : 1.5 */
    grid-template-columns: minmax(320px, 2.5fr) minmax(240px, 1fr) minmax(300px, 1.5fr);
  }
}

/* 笔记本电脑屏幕（768px-1200px）：两栏布局 */
@media (min-width: 768px) and (max-width: 1199px) {
  .content-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }

  .left-panel {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .middle-panel {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }

  .right-panel {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }
}

/* 小屏幕（<768px）：单栏布局 */
@media (max-width: 767px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .main-content {
    padding: 16px;
  }
}

/* 面板样式 */
.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-card {
  margin-top: auto;
}

/* Naive UI Card 自定义样式 */
:deep(.n-card) {
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid var(--border-light);
}

.prompt-panel-card :deep(.n-card__content) {
  padding: 16px;
  height: 100%;
  overflow: hidden;
}

.parameter-panel-card :deep(.n-card__content) {
  padding: 16px;
  height: 100%;
  overflow: hidden;
}

:deep(.n-card:hover) {
  box-shadow: 0 4px 12px var(--shadow-hover);
  transition: box-shadow 0.3s ease;
}

:deep(.n-card__header) {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}

/* 暗色主题适配 */
:global(.dark) :deep(.n-card) {
  background-color: var(--bg-secondary);
  border-color: var(--border-color);
}
</style>
