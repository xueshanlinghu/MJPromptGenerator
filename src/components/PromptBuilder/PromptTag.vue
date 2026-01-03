<template>
  <div
    class="prompt-tag"
    :class="{
      selected: isSelected,
      [`color-${colorIndex}`]: true
    }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <span class="tag-text">{{ prompt.description }}</span>
    <span v-if="isSelected" class="selected-icon">✓</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PromptItem } from '@/types'

interface Props {
  prompt: PromptItem
  categoryId: string
  isSelected?: boolean
  colorIndex?: number
}

interface Emits {
  (e: 'click', categoryId: string, promptId: string): void
  (e: 'preview', prompt: PromptItem, show: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  colorIndex: 0
})

const emit = defineEmits<Emits>()

const handleClick = () => {
  emit('click', props.categoryId, props.prompt.id)
}

const handleMouseEnter = () => {
  emit('preview', props.prompt, true)
}

const handleMouseLeave = () => {
  emit('preview', props.prompt, false)
}
</script>

<style scoped>
.prompt-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
  user-select: none;
  position: relative;
}

.prompt-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-hover);
}

.tag-text {
  line-height: 1.2;
}

.selected-icon {
  font-size: 12px;
  font-weight: 700;
}

/* 选中状态 */
.prompt-tag.selected {
  border-color: currentColor;
  font-weight: 600;
  box-shadow: 0 2px 8px var(--shadow-color);
}

/* 四种颜色循环 */
.prompt-tag.color-0 {
  background: var(--color-blue);
  color: var(--text-blue);
}

.prompt-tag.color-1 {
  background: var(--color-green);
  color: var(--text-green);
}

.prompt-tag.color-2 {
  background: var(--color-yellow);
  color: var(--text-yellow);
}

.prompt-tag.color-3 {
  background: var(--color-pink);
  color: var(--text-pink);
}

/* 暗色主题 */
:global(.dark) .prompt-tag.color-0 {
  background: var(--color-blue);
  color: var(--text-blue);
}

:global(.dark) .prompt-tag.color-1 {
  background: var(--color-green);
  color: var(--text-green);
}

:global(.dark) .prompt-tag.color-2 {
  background: var(--color-yellow);
  color: var(--text-yellow);
}

:global(.dark) .prompt-tag.color-3 {
  background: var(--color-pink);
  color: var(--text-pink);
}
</style>
