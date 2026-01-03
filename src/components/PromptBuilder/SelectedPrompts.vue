<template>
  <div class="selected-prompts">
    <div v-if="selectedPrompts.length === 0" class="empty-state">
      <span class="empty-icon">✨</span>
      <span class="empty-text">点击左侧提示词标签来添加</span>
    </div>

    <div v-else class="selected-list">
      <div
        v-for="(item, index) in selectedPrompts"
        :key="`${item.categoryId}-${item.promptId}`"
        class="selected-item"
        :class="`color-${index % 4}`"
      >
        <span class="item-text">{{ item.text }}</span>
        <button
          class="remove-btn"
          @click="handleRemove(item.categoryId, item.promptId)"
          title="移除"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SelectedPrompt } from '@/types'

interface Props {
  selectedPrompts: SelectedPrompt[]
}

interface Emits {
  (e: 'remove', categoryId: string, promptId: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleRemove = (categoryId: string, promptId: string) => {
  emit('remove', categoryId, promptId)
}
</script>

<style scoped>
.selected-prompts {
  min-height: 100px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 32px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid currentColor;
  transition: all 0.2s ease;
}

.item-text {
  line-height: 1.2;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  color: inherit;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

/* 四种颜色循环 */
.selected-item.color-0 {
  background: var(--color-blue);
  color: var(--text-blue);
}

.selected-item.color-1 {
  background: var(--color-green);
  color: var(--text-green);
}

.selected-item.color-2 {
  background: var(--color-yellow);
  color: var(--text-yellow);
}

.selected-item.color-3 {
  background: var(--color-pink);
  color: var(--text-pink);
}

/* 暗色主题 */
:global(.dark) .remove-btn {
  background: rgba(255, 255, 255, 0.1);
}

:global(.dark) .remove-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
