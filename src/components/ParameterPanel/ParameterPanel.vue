<template>
  <div class="parameter-panel">
    <div class="panel-header">
      <h3 class="panel-title">⚙️ 参数设置</h3>
      <p class="panel-description">调整 Midjourney 生成参数</p>
    </div>

    <n-spin :show="loading" description="加载中...">
      <div v-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ error }}</span>
        <n-button size="small" @click="handleRetry">重试</n-button>
      </div>

      <div v-else-if="parameters.length > 0" class="parameters-container">
        <div
          v-for="param in parameters"
          :key="param.id"
          class="parameter-item"
        >
          <div class="param-label">
            {{ param.name }}
            <span v-if="param.description" class="param-hint">
              <n-tooltip :style="{ maxWidth: '280px' }">
                <template #trigger>
                  <span class="hint-icon">?</span>
                </template>
                {{ param.description }}
              </n-tooltip>
            </span>
          </div>

          <!-- 选择器 -->
          <n-select
            v-if="param.type === 'select'"
            v-model:value="values[param.id]"
            :options="param.options"
            size="small"
            @update:value="handleChange"
          />

          <!-- 滑块 -->
          <div v-else-if="param.type === 'slider'" class="slider-container">
            <n-slider
              v-model:value="values[param.id]"
              :min="param.min"
              :max="param.max"
              :step="param.step"
              @update:value="handleChange"
            />
            <span class="slider-value">{{ values[param.id] }}</span>
          </div>

          <!-- 文本输入 -->
          <n-input
            v-else-if="param.type === 'input'"
            v-model:value="values[param.id]"
            :placeholder="param.placeholder || ''"
            size="small"
            @update:value="handleChange"
          />

          <!-- 复选框 -->
          <n-checkbox
            v-else-if="param.type === 'checkbox'"
            v-model:checked="values[param.id]"
            @update:checked="handleChange"
          >
            {{ param.label || '启用' }}
          </n-checkbox>
        </div>

        <!-- 重置按钮 -->
        <div class="reset-section">
          <n-button size="small" @click="handleReset" secondary>
            🔄 重置为默认值
          </n-button>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="empty-icon">📦</span>
        <span class="empty-text">暂无参数配置</span>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NSpin, NButton, NSelect, NSlider, NInput, NCheckbox, NTooltip } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { useParameterStore } from '@/stores/parameterStore'

const parameterStore = useParameterStore()
const { loading, error, config, values } = storeToRefs(parameterStore)

// 计算属性：获取所有参数
const parameters = computed(() => {
  return config.value?.parameters || []
})

// 处理参数变化
const handleChange = () => {
  parameterStore.saveToLocalStorage()
}

// 重置参数
const handleReset = () => {
  parameterStore.resetToDefaults()
}

// 重试加载
const handleRetry = () => {
  parameterStore.loadConfig()
}

// 组件挂载时加载配置
onMounted(() => {
  if (!config.value) {
    parameterStore.loadConfig()
  }
})
</script>

<style scoped>
.parameter-panel {
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

.parameters-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 4px;
}

/* 自定义滚动条 */
.parameters-container::-webkit-scrollbar {
  width: 6px;
}

.parameters-container::-webkit-scrollbar-track {
  background: transparent;
}

.parameters-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.parameters-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-tertiary);
}

.parameter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.param-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.param-hint {
  display: inline-flex;
  align-items: center;
}

.hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-blue);
  color: var(--text-blue);
  font-size: 11px;
  font-weight: 700;
  cursor: help;
  transition: all 0.2s ease;
}

.hint-icon:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slider-container :deep(.n-slider) {
  flex: 1;
}

.slider-value {
  min-width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: monospace;
}

.reset-section {
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: center;
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
:global(.dark) .parameters-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
}

:global(.dark) .parameters-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
