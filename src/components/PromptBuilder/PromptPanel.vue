<template>
  <div class="prompt-panel">
    <div class="panel-header">
      <h3 class="panel-title">🎨 提示词库</h3>
      <p class="panel-description">点击标签添加提示词，鼠标悬停查看预览</p>
    </div>

    <n-spin :show="loading" description="加载中...">
      <div v-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ error }}</span>
        <n-button size="small" @click="handleRetry">重试</n-button>
      </div>

      <div v-else-if="categories.length > 0" class="categories-container">
        <PromptCategory
          v-for="category in categories"
          :key="category.id"
          :category="category"
          :selected-prompts="selectedPromptsSet"
          @toggle="handleTogglePrompt"
        />
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">📦</span>
        <span class="empty-text">暂无提示词配置</span>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NSpin, NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePromptStore } from '@/stores/promptStore'
import PromptCategory from './PromptCategory.vue'

const promptStore = usePromptStore()
const { loading, error, config, selectedPrompts } = storeToRefs(promptStore)

// 计算属性：获取所有分类
const categories = computed(() => {
  return config.value?.categories || []
})

// 计算属性：已选提示词 Set（用于快速查找）
const selectedPromptsSet = computed(() => {
  const set = new Set<string>()
  selectedPrompts.value.forEach(item => {
    set.add(item.promptId)
  })
  return set
})

// 处理提示词切换（添加/移除）
const handleTogglePrompt = (categoryId: string, promptId: string) => {
  promptStore.togglePrompt(categoryId, promptId)
}

// 重试加载
const handleRetry = () => {
  promptStore.loadConfig()
}

// 组件挂载时加载配置
onMounted(() => {
  if (!config.value) {
    promptStore.loadConfig()
  }
})
</script>

<style scoped>
.prompt-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.panel-header {
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-light);
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px 0;
}

.panel-description {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
}

.categories-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  padding-right: 4px;
}

/* 自定义滚动条 */
.categories-container::-webkit-scrollbar {
  width: 6px;
}

.categories-container::-webkit-scrollbar-track {
  background: transparent;
}

.categories-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.categories-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: var(--error-color);
}

.error-icon {
  font-size: 48px;
  opacity: 0.8;
}

.error-text {
  font-size: 14px;
  font-weight: 600;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 48px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

/* 暗色主题 */
:global(.dark) .categories-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

:global(.dark) .categories-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
