<template>
  <div class="final-prompt">
    <div v-if="finalPrompt" class="prompt-display">
      <div class="prompt-text">{{ finalPrompt }}</div>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">✨</span>
      <span class="empty-text">选择提示词和参数后将在这里显示</span>
    </div>

    <div class="actions">
      <n-button
        type="primary"
        :disabled="!finalPrompt"
        @click="handleCopy"
        class="copy-btn"
      >
        <template #icon>
          <span>📋</span>
        </template>
        {{ copied ? '已复制!' : '复制提示词' }}
      </n-button>

      <n-button
        :disabled="!hasContent"
        @click="handleClear"
        secondary
      >
        <template #icon>
          <span>🗑️</span>
        </template>
        清空所有
      </n-button>
    </div>

    <div v-if="finalPrompt" class="prompt-info">
      <span class="info-item">
        <span class="info-label">提示词数量:</span>
        <span class="info-value">{{ selectedCount }}</span>
      </span>
      <span class="info-item">
        <span class="info-label">字符数:</span>
        <span class="info-value">{{ finalPrompt.length }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePromptStore } from '@/stores/promptStore'
import { useParameterStore } from '@/stores/parameterStore'
import { PromptBuilder } from '@/utils/promptBuilder'

const promptStore = usePromptStore()
const parameterStore = useParameterStore()

const { selectedPrompts } = storeToRefs(promptStore)
const { values } = storeToRefs(parameterStore)

const copied = ref(false)

// 计算属性：最终提示词
const finalPrompt = computed(() => {
  if (selectedPrompts.value.length === 0) {
    return ''
  }

  // 获取提示词文本列表（按时间顺序）
  const promptTexts = selectedPrompts.value
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(p => p.text)

  // 组合提示词和参数
  return PromptBuilder.build(promptTexts, values.value)
})

// 计算属性：选中的提示词数量
const selectedCount = computed(() => {
  return selectedPrompts.value.length
})

// 计算属性：是否有内容
const hasContent = computed(() => {
  return selectedPrompts.value.length > 0 || Object.keys(values.value).length > 0
})

// 复制到剪贴板
const handleCopy = async () => {
  if (!finalPrompt.value) return

  try {
    await navigator.clipboard.writeText(finalPrompt.value)
    copied.value = true

    // 2秒后重置状态
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案：使用传统方法
    const textarea = document.createElement('textarea')
    textarea.value = finalPrompt.value
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)

    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

// 清空所有选项
const handleClear = () => {
  promptStore.clearAll()
  parameterStore.resetToDefaults()
}
</script>

<style scoped>
.final-prompt {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.prompt-display {
  background: linear-gradient(135deg, var(--color-green) 0%, var(--color-blue) 100%);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 16px;
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;
}

.prompt-text {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
  word-break: break-word;
  white-space: pre-wrap;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 16px;
  background: var(--bg-tertiary);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  color: var(--text-tertiary);
  min-height: 120px;
}

.empty-icon {
  font-size: 32px;
  opacity: 0.5;
}

.empty-text {
  font-size: 13px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 8px;
}

.copy-btn {
  flex: 1;
}

.prompt-info {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.info-label {
  color: var(--text-tertiary);
  font-size: 11px;
}

.info-value {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 16px;
  font-family: monospace;
}

/* 自定义滚动条 */
.prompt-display::-webkit-scrollbar {
  width: 6px;
}

.prompt-display::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.prompt-display::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.prompt-display::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

/* 暗色主题 */
:global(.dark) .prompt-display {
  background: linear-gradient(135deg, rgba(209, 250, 229, 0.15) 0%, rgba(224, 242, 254, 0.15) 100%);
}

:global(.dark) .prompt-display::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

:global(.dark) .prompt-display::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

:global(.dark) .prompt-display::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
