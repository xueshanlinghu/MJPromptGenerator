<template>
  <n-popover
    :show="show"
    :placement="dynamicPlacement"
    trigger="manual"
    :show-arrow="true"
    :style="{ padding: '4px' }"
    :flip="false"
  >
    <template #trigger>
      <div ref="triggerRef">
        <slot></slot>
      </div>
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
        <div class="preview-title">{{ prompt?.prompt_zh }}</div>
        <div class="preview-prompt">{{ prompt?.prompt_en }}</div>
      </div>

      <!-- 生成示例图的提示词（如果配置） -->
      <div v-if="prompt?.generationPrompt" class="generation-prompt">
        <div class="generation-prompt-label">预览图生成提示词：</div>
        <div class="generation-prompt-text">{{ prompt.generationPrompt }}</div>
      </div>

      <!-- 额外说明（如果提供） -->
      <div v-if="prompt?.description" class="preview-description">
        {{ prompt.description }}
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { NPopover } from 'naive-ui'
import type { PromptItem } from '@/types'
import { getPreviewImagePath } from '@/utils'

type Placement = 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'

interface Props {
  prompt: PromptItem | null
  show: boolean
}

const props = defineProps<Props>()

const imageError = ref(false)
const triggerRef = ref<HTMLElement>()
const dynamicPlacement = ref<Placement>('right')

// 预览图尺寸常量
const PREVIEW_WIDTH = 400  // 预览图宽度 + padding
const PREVIEW_HEIGHT = 350 // 预览图高度 + padding (根据实际内容调整)

const hasPreview = computed(() => {
  return props.prompt?.preview && !imageError.value
})

const imagePath = computed(() => {
  return getPreviewImagePath(props.prompt?.preview)
})

const handleImageError = () => {
  imageError.value = true
}

// 智能计算预览图显示位置
const calculatePlacement = (): Placement => {
  if (!triggerRef.value) {
    console.log('[PromptPreview] triggerRef is null')
    return 'bottom'
  }

  const rect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth

  // 计算上下方向的可用空间
  const spaceBottom = viewportHeight - rect.bottom
  const spaceTop = rect.top
  const spaceLeft = rect.left
  const spaceRight = viewportWidth - rect.right

  console.log('[PromptPreview] Calculating placement:', {
    rect: {
      left: rect.left,
      top: rect.top,
      bottom: rect.bottom
    },
    viewport: {
      height: viewportHeight,
      width: viewportWidth
    },
    spaces: {
      bottom: spaceBottom,
      top: spaceTop,
      left: spaceLeft,
      right: spaceRight
    }
  })

  let placement: Placement

  // 判断标签是否靠近左侧边缘（左侧空间不足预览图宽度的一半）
  const isNearLeftEdge = spaceLeft < PREVIEW_WIDTH / 2

  // 新策略：优先显示在下方，如果下方空间不够则显示在上方
  // 对于靠近左侧的标签，使用 -start 变体（左对齐），避免超出屏幕左侧
  if (spaceBottom >= PREVIEW_HEIGHT) {
    // 下方空间足够，显示在下方
    placement = isNearLeftEdge ? 'bottom-start' : 'bottom'
  } else if (spaceTop >= PREVIEW_HEIGHT) {
    // 上方空间足够，显示在上方
    placement = isNearLeftEdge ? 'top-start' : 'top'
  } else {
    // 都不够，选择空间较大的一侧
    if (spaceBottom >= spaceTop) {
      placement = isNearLeftEdge ? 'bottom-start' : 'bottom'
    } else {
      placement = isNearLeftEdge ? 'top-start' : 'top'
    }
  }

  console.log('[PromptPreview] Calculated placement:', placement, `(isNearLeftEdge: ${isNearLeftEdge})`)
  return placement
}

// 监听 show 变化，重新计算位置
watch(() => props.show, (newShow) => {
  if (newShow) {
    // 使用 nextTick 和 setTimeout 确保 DOM 完全渲染
    nextTick(() => {
      setTimeout(() => {
        dynamicPlacement.value = calculatePlacement()
      }, 10)
    })
  }
})
</script>

<style scoped>
.preview-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 384px;
}

.preview-image-wrapper {
  width: 384px;
  height: 216px;
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
  width: 384px;
  height: 216px;
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
  width: 384px;
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

.generation-prompt {
  margin-top: 8px;
  padding: 8px;
  background: var(--bg-secondary);
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
  width: 384px;
  box-sizing: border-box;
}

.generation-prompt-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.generation-prompt-text {
  font-size: 12px;
  color: var(--text-primary);
  font-family: monospace;
  line-height: 1.5;
  word-break: break-word;
}

.preview-description {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-light);
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
  width: 384px;
  box-sizing: border-box;
}
</style>
