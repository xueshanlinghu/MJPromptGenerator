<template>
  <div class="prompt-category">
    <div class="category-header">
      <span class="category-icon">{{ getIcon(category.icon) }}</span>
      <span class="category-name">{{ category.name }}</span>
      <span class="category-count">({{ category.prompts?.length || 0 }})</span>
    </div>

    <div v-if="category.prompts && category.prompts.length > 0" class="prompts-grid">
      <PromptPreview
        v-for="(prompt, index) in category.prompts"
        :key="prompt.id"
        :prompt="previewPrompt"
        :show="isPreviewVisible && previewPrompt?.id === prompt.id"
      >
        <PromptTag
          :prompt="prompt"
          :category-id="category.id"
          :is-selected="isPromptSelected(prompt.id)"
          :color-index="index % 4"
          @click="handleTagClick"
          @preview="handlePreview"
        />
      </PromptPreview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptCategory as PromptCategoryType, PromptItem } from '@/types'
import PromptTag from './PromptTag.vue'
import PromptPreview from './PromptPreview.vue'

interface Props {
  category: PromptCategoryType
  selectedPrompts: Set<string>
}

interface Emits {
  (e: 'toggle', categoryId: string, promptId: string, subCategoryId?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const previewPrompt = ref<PromptItem | null>(null)
const isPreviewVisible = ref(false)

const getIcon = (icon?: string) => {
  const iconMap: Record<string, string> = {
    'palette-outline': '🎨',
    'cube-outline': '🖼️',
    'sunny-outline': '💡',
    'sparkles-outline': '✨',
    'camera-outline': '📷'
  }
  return icon ? iconMap[icon] || '📌' : '📌'
}

const isPromptSelected = (promptId: string) => {
  return props.selectedPrompts.has(promptId)
}

const handleTagClick = (data: { categoryId: string, promptId: string, subCategoryId?: string }) => {
  emit('toggle', data.categoryId, data.promptId, data.subCategoryId)
}

const handlePreview = (prompt: PromptItem, show: boolean) => {
  if (show) {
    previewPrompt.value = prompt
    isPreviewVisible.value = true
  } else {
    isPreviewVisible.value = false
  }
}
</script>

<style scoped>
.prompt-category {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.category-icon {
  font-size: 18px;
}

.category-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.category-count {
  font-size: 12px;
  color: var(--text-tertiary);
}

.prompts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
