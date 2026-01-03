<template>
  <n-popover
    :show="show"
    placement="right"
    trigger="manual"
    :show-arrow="true"
    :style="{ padding: '4px' }"
  >
    <template #trigger>
      <slot></slot>
    </template>

    <div class="preview-content">
      <div v-if="hasPreview" class="preview-image-wrapper">
        <img
          :src="imagePath"
          :alt="prompt?.description"
          class="preview-image"
          loading="lazy"
          @error="handleImageError"
        />
      </div>
      <div v-else class="no-preview">
        <span class="no-preview-icon">🖼️</span>
        <span class="no-preview-text">暂无预览图</span>
      </div>

      <div class="preview-info">
        <div class="preview-title">{{ prompt?.description }}</div>
        <div class="preview-prompt">{{ prompt?.text }}</div>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NPopover } from 'naive-ui'
import type { PromptItem } from '@/types'
import { getPreviewImagePath } from '@/utils'

interface Props {
  prompt: PromptItem | null
  show: boolean
}

const props = defineProps<Props>()

const imageError = ref(false)

const hasPreview = computed(() => {
  return props.prompt?.preview && !imageError.value
})

const imagePath = computed(() => {
  return getPreviewImagePath(props.prompt?.preview)
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.preview-content {
  max-width: 280px;
}

.preview-image-wrapper {
  width: 256px;
  height: 256px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-tertiary);
  margin-bottom: 8px;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-preview {
  width: 256px;
  height: 256px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-tertiary);
  border-radius: 8px;
  margin-bottom: 8px;
  gap: 8px;
}

.no-preview-icon {
  font-size: 48px;
  opacity: 0.3;
}

.no-preview-text {
  font-size: 14px;
  color: var(--text-tertiary);
}

.preview-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.preview-prompt {
  font-size: 12px;
  color: var(--text-tertiary);
  font-family: monospace;
  word-break: break-all;
}
</style>
