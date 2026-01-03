<template>
  <div class="subcategory-list">
    <!-- 情况1: 有二级分类 -->
    <template v-if="subCategories.length > 0">
      <div
        v-for="subCategory in subCategories"
        :key="subCategory.id"
        class="subcategory-section"
      >
        <!-- 二级分类标题（只是标题，不可点击） -->
        <div class="subcategory-header">
          <h4 class="subcategory-title">{{ subCategory.name }}</h4>
          <span class="subcategory-count">({{ subCategory.prompts.length }})</span>
        </div>

        <!-- 该二级分类下的提示词标签 -->
        <div class="prompts-grid">
          <PromptPreview
            v-for="(prompt, index) in subCategory.prompts"
            :key="prompt.id"
            :prompt="previewPrompt"
            :show="isPreviewVisible && previewPrompt?.id === prompt.id"
          >
            <PromptTag
              :prompt="prompt"
              :category-id="categoryId"
              :sub-category-id="subCategory.id"
              :is-selected="isPromptSelected(prompt.id)"
              :color-index="index % 4"
              @click="handleTagClick"
              @preview="handlePreview"
            />
          </PromptPreview>
        </div>
      </div>
    </template>

    <!-- 情况2: 无二级分类（向后兼容） -->
    <template v-else>
      <div class="prompts-grid">
        <PromptPreview
          v-for="(prompt, index) in prompts"
          :key="prompt.id"
          :prompt="previewPrompt"
          :show="isPreviewVisible && previewPrompt?.id === prompt.id"
        >
          <PromptTag
            :prompt="prompt"
            :category-id="categoryId"
            :is-selected="isPromptSelected(prompt.id)"
            :color-index="index % 4"
            @click="handleTagClick"
            @preview="handlePreview"
          />
        </PromptPreview>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { PromptSubCategory, PromptItem } from '@/types'
import PromptTag from './PromptTag.vue'
import PromptPreview from './PromptPreview.vue'

interface Props {
  subCategories: PromptSubCategory[]
  prompts: PromptItem[]
  categoryId: string
  selectedPrompts: Set<string>
}

interface Emits {
  (e: 'toggle', categoryId: string, promptId: string, subCategoryId?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 预览状态
const previewPrompt = ref<PromptItem | null>(null)
const isPreviewVisible = ref(false)

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
.subcategory-list {
  padding: 16px 0;
}

.subcategory-section {
  margin-bottom: 24px;
}

.subcategory-section:last-child {
  margin-bottom: 0;
}

.subcategory-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.subcategory-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.subcategory-count {
  font-size: 12px;
  color: var(--text-tertiary);
  font-weight: 400;
}

.prompts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 暗色主题 */
:global(.dark) .subcategory-header {
  border-bottom-color: var(--border-color);
}

:global(.dark) .subcategory-title {
  color: var(--text-primary);
}
</style>
