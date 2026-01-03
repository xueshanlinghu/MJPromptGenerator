<template>
  <div class="subject-environment-input">
    <div class="input-header">
      <h4 class="input-title">📝 主体与环境</h4>
      <p class="input-description">描述拍摄的主体对象和所处环境</p>
    </div>

    <!-- 文本输入区 -->
    <n-input
      v-model:value="localValue"
      type="textarea"
      placeholder="例如: a woman with long hair, in a beautiful garden with blooming flowers"
      :rows="3"
      :autosize="{ minRows: 3, maxRows: 6 }"
      @update:value="handleInput"
    />

    <!-- 快捷示例按钮 -->
    <div v-if="examples.length > 0" class="examples-section">
      <span class="examples-label">快速示例：</span>
      <div class="examples-grid">
        <n-button
          v-for="example in examples"
          :key="example.id"
          size="small"
          secondary
          @click="applyExample(example)"
        >
          {{ example.title }}
        </n-button>
      </div>
    </div>

    <!-- 字符计数 -->
    <div class="input-meta">
      <span class="char-count">{{ localValue.length }} 字符</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NInput, NButton } from 'naive-ui'
import type { SubjectEnvironmentExample } from '@/types'

interface Props {
  modelValue: string
  examples: SubjectEnvironmentExample[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const localValue = ref(props.modelValue)

// 监听外部变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== localValue.value) {
    localValue.value = newValue
  }
})

const handleInput = (value: string) => {
  emit('update:modelValue', value)
}

const applyExample = (example: SubjectEnvironmentExample) => {
  localValue.value = example.fullText
  emit('update:modelValue', example.fullText)
}
</script>

<style scoped>
.subject-environment-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--bg-primary);
  border-radius: 8px;
  border: 1px solid var(--border-light);
  margin-bottom: 16px;
}

.input-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.input-description {
  margin: 0;
  font-size: 12px;
  color: var(--text-tertiary);
}

.examples-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.examples-label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.examples-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.input-meta {
  display: flex;
  justify-content: flex-end;
}

.char-count {
  font-size: 11px;
  color: var(--text-tertiary);
}

/* 暗色主题 */
:global(.dark) .subject-environment-input {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}
</style>
