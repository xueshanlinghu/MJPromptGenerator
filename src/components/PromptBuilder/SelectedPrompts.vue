<template>
  <div class="selected-prompts">
    <div v-if="selectedPrompts.length === 0" class="empty-state">
      <span class="empty-icon">✨</span>
      <span class="empty-text">点击左侧提示词标签来添加</span>
    </div>

    <div v-else class="selected-list">
      <div
        v-for="(item, index) in sortedPrompts"
        :key="`${item.categoryId}-${item.promptId}`"
        class="selected-item"
        :class="[
          `color-${index % 4}`,
          { dragging: draggingIndex === index, 'drag-over': dragOverIndex === index }
        ]"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragover.prevent="handleDragOver(index, $event)"
        @drop="handleDrop(index, $event)"
        @dragend="handleDragEnd"
      >
        <span class="drag-handle" title="拖动排序">⋮⋮</span>
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
import { ref, computed } from 'vue'
import type { SelectedPrompt } from '@/types'

interface Props {
  selectedPrompts: SelectedPrompt[]
}

interface Emits {
  (e: 'remove', categoryId: string, promptId: string): void
  (e: 'reorder', fromIndex: number, toIndex: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const draggingIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

// 按时间戳排序的提示词列表
const sortedPrompts = computed(() => {
  return [...props.selectedPrompts].sort((a, b) => a.timestamp - b.timestamp)
})

const handleDragStart = (index: number, event: DragEvent) => {
  draggingIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
  }
}

const handleDragOver = (index: number, event: DragEvent) => {
  if (draggingIndex.value === null || draggingIndex.value === index) {
    return
  }
  dragOverIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (toIndex: number, event: DragEvent) => {
  event.preventDefault()

  if (draggingIndex.value === null || draggingIndex.value === toIndex) {
    return
  }

  emit('reorder', draggingIndex.value, toIndex)

  draggingIndex.value = null
  dragOverIndex.value = null
}

const handleDragEnd = () => {
  draggingIndex.value = null
  dragOverIndex.value = null
}

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
  padding: 6px 8px 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid currentColor;
  transition: all 0.2s ease;
  cursor: move;
  user-select: none;
}

.selected-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 拖拽状态 */
.selected-item.dragging {
  opacity: 0.5;
  transform: scale(0.95);
  cursor: grabbing;
}

.selected-item.drag-over {
  border-style: dashed;
  border-width: 2px;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.drag-handle {
  font-size: 14px;
  color: currentColor;
  opacity: 0.6;
  cursor: grab;
  line-height: 1;
  user-select: none;
}

.selected-item:hover .drag-handle {
  opacity: 1;
}

.selected-item.dragging .drag-handle {
  cursor: grabbing;
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
