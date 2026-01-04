<template>
  <div class="prompt-panel">
    <div class="panel-header">
      <h3 class="panel-title">🎨 提示词库</h3>
      <p class="panel-description">点击标签添加提示词，鼠标悬停查看预览</p>
    </div>

    <n-spin :show="loading" description="加载中...">
      <div v-if="error" class="error-state">
        <span class="error-icon">⚠️</span>
        <span class="error-text">{{ error }}</span>
        <n-button size="small" @click="handleRetry">重试</n-button>
      </div>

      <div v-else ref="tabsContainerRef" class="tabs-container">
        <!-- Tab页结构：主体环境 + 各个一级分类 -->
        <n-tabs type="line" animated>
          <!-- 第一个Tab：主体环境 -->
          <n-tab-pane name="subject-environment">
            <template #tab>
              <span class="tab-label">
                <span class="tab-icon">📝</span>
                <span class="tab-name">主体与环境</span>
              </span>
            </template>

            <!-- 主体环境输入区 -->
            <div class="subject-tab-content">
              <SubjectEnvironmentInput
                v-model="subjectEnvironmentValue"
                :examples="subjectEnvironmentExamples"
              />
            </div>
          </n-tab-pane>

          <!-- 其他Tab：各个分类 -->
          <n-tab-pane
            v-for="category in categories"
            :key="category.id"
            :name="category.id"
          >
            <template #tab>
              <span class="tab-label">
                <span class="tab-icon">{{ getIcon(category.icon) }}</span>
                <span class="tab-name">{{ category.name }}</span>
                <span class="tab-count">({{ getTotalPromptsCount(category) }})</span>
              </span>
            </template>

            <!-- 特殊提示（如艺术家的单选提示） -->
            <div v-if="category.special?.singleSelectionHint" class="category-hint">
              <n-alert type="info" size="small" :bordered="false">
                <template #icon>
                  <span>💡</span>
                </template>
                {{ category.special.singleSelectionHint }}
              </n-alert>
            </div>

            <!-- Tab内容：二级分类列表 -->
            <PromptSubCategoryList
              :sub-categories="category.subCategories || []"
              :prompts="category.prompts || []"
              :category-id="category.id"
              :selected-prompts="selectedPromptsSet"
              @toggle="handleTogglePrompt"
            />
          </n-tab-pane>
        </n-tabs>
      </div>

      <div v-if="!loading && !error && categories.length === 0" class="empty-state">
        <span class="empty-icon">📦</span>
        <span class="empty-text">暂无提示词配置</span>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onBeforeUnmount } from 'vue'
import { NSpin, NButton, NTabs, NTabPane, NAlert } from 'naive-ui'
import { storeToRefs } from 'pinia'
import { usePromptStore } from '@/stores/promptStore'
import type { PromptCategory as PromptCategoryType } from '@/types'
import SubjectEnvironmentInput from './SubjectEnvironmentInput.vue'
import PromptSubCategoryList from './PromptSubCategoryList.vue'

const promptStore = usePromptStore()
const { loading, error, config, selectedPrompts, subjectEnvironment } = storeToRefs(promptStore)

// Tabs 容器引用
const tabsContainerRef = ref<HTMLElement | null>(null)

// 计算属性：获取所有分类
const categories = computed(() => {
  return config.value?.categories || []
})

// 计算属性：获取主体环境示例
const subjectEnvironmentExamples = computed(() => {
  return config.value?.subjectEnvironmentExamples || []
})

// 主体环境的双向绑定
const subjectEnvironmentValue = computed({
  get: () => subjectEnvironment.value,
  set: (value) => {
    promptStore.setSubjectEnvironment(value)
  }
})

// 计算属性：已选提示词 Set（用于快速查找）
const selectedPromptsSet = computed(() => {
  const set = new Set<string>()
  selectedPrompts.value.forEach(item => {
    set.add(item.promptId)
  })
  return set
})

// 获取图标emoji
const getIcon = (icon?: string) => {
  const iconMap: Record<string, string> = {
    'palette-outline': '🎨',
    'cube-outline': '🖼️',
    'sunny-outline': '💡',
    'sparkles-outline': '✨',
    'camera-outline': '📷',
    'person-outline': '👤',
    'timer-outline': '⏱️',
    'aperture-outline': '⚙️'
  }
  return icon ? iconMap[icon] || '📌' : '📌'
}

// 获取分类下的总提示词数量
const getTotalPromptsCount = (category: PromptCategoryType) => {
  if (category.subCategories && category.subCategories.length > 0) {
    return category.subCategories.reduce((sum, sub) => sum + sub.prompts.length, 0)
  }
  return category.prompts?.length || 0
}

// 处理提示词切换（添加/移除）
const handleTogglePrompt = (categoryId: string, promptId: string, subCategoryId?: string) => {
  promptStore.togglePrompt(categoryId, promptId, subCategoryId)
}

// 重试加载
const handleRetry = () => {
  promptStore.loadConfig()
}

// 拖动滚动功能
let tabsNavElement: HTMLElement | null = null
let wrapperElement: HTMLElement | null = null
let isDragging = false
let startX = 0
let scrollLeft = 0

const handleMouseDown = (e: MouseEvent) => {
  if (!tabsNavElement || !wrapperElement) return

  // 只在标签栏区域响应
  const target = e.target as HTMLElement
  const isOnTab = target.closest('.n-tabs-tab') || target.closest('.n-tabs-nav-scroll-wrapper')

  if (!isOnTab) return

  isDragging = true
  startX = e.pageX
  scrollLeft = tabsNavElement.scrollLeft
  wrapperElement.style.cursor = 'grabbing'
  wrapperElement.style.userSelect = 'none'

  // 阻止默认的文本选择和点击行为
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging || !tabsNavElement) return
  e.preventDefault()

  const x = e.pageX
  const walk = (startX - x) * 2
  tabsNavElement.scrollLeft = scrollLeft + walk
}

const handleMouseUp = () => {
  if (!wrapperElement) return
  isDragging = false
  wrapperElement.style.cursor = 'grab'
  wrapperElement.style.userSelect = 'auto'
}

const handleMouseLeave = () => {
  if (!wrapperElement || !isDragging) return
  isDragging = false
  wrapperElement.style.cursor = 'grab'
  wrapperElement.style.userSelect = 'auto'
}

// 组件挂载时加载配置和设置拖动滚动
onMounted(() => {
  if (!config.value) {
    promptStore.loadConfig()
  }

  // 设置拖动滚动功能
  setTimeout(() => {
    if (tabsContainerRef.value) {
      // 找到真正可以滚动的元素 v-x-scroll
      const scrollElement = tabsContainerRef.value.querySelector('.v-x-scroll') as HTMLElement
      const wrapper = tabsContainerRef.value.querySelector('.n-tabs-nav-scroll-wrapper') as HTMLElement

      if (scrollElement && wrapper) {
        // scrollElement 是真正滚动的元素
        tabsNavElement = scrollElement
        wrapperElement = wrapper

        // 设置 wrapper 的样式（显示拖动光标）
        wrapper.style.cursor = 'grab'

        // 在 wrapper 上监听鼠标按下事件
        wrapper.addEventListener('mousedown', handleMouseDown, { passive: false })
        wrapper.addEventListener('mouseleave', handleMouseLeave)

        // 在 document 上监听移动和松开事件
        document.addEventListener('mousemove', handleMouseMove, { passive: false })
        document.addEventListener('mouseup', handleMouseUp)
      }
    }
  }, 300)
})

// 组件卸载时清理事件监听器
onBeforeUnmount(() => {
  if (wrapperElement) {
    wrapperElement.removeEventListener('mousedown', handleMouseDown)
    wrapperElement.removeEventListener('mouseleave', handleMouseLeave)
  }
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.prompt-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-light);
}

.panel-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.panel-description {
  font-size: 13px;
  color: var(--text-tertiary);
  margin: 0;
  text-align: right;
}

.tabs-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tabs-container :deep(.n-tabs) {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.tabs-container :deep(.n-tabs-nav) {
  flex-shrink: 0;
}

.tabs-container :deep(.n-tabs-nav-scroll-content) {
  transition: none;
}

.tabs-container :deep(.n-tabs-nav-scroll-wrapper) {
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-color, rgba(0, 0, 0, 0.2)) transparent;
}

.tabs-container :deep(.n-tabs-nav-scroll-wrapper)::-webkit-scrollbar {
  height: 4px;
}

.tabs-container :deep(.n-tabs-nav-scroll-wrapper)::-webkit-scrollbar-thumb {
  background: var(--scrollbar-color, rgba(0, 0, 0, 0.2));
  border-radius: 2px;
}

.tabs-container :deep(.n-tabs-nav-scroll-wrapper)::-webkit-scrollbar-track {
  background: transparent;
}

.tabs-container :deep(.n-tabs-tab) {
  padding: 8px 10px !important;
}

.tabs-container :deep(.n-tabs-pane-wrapper) {
  flex: 1;
  overflow-y: auto;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.tab-icon {
  font-size: 15px;
}

.tab-name {
  font-weight: 500;
  white-space: nowrap;
}

.tab-count {
  font-size: 11px;
  color: var(--text-tertiary);
  font-weight: 400;
}

.category-hint {
  margin-bottom: 16px;
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

.subject-tab-content {
  padding: 16px 0;
}

.subject-tab-content :deep(.subject-environment-input) {
  margin-bottom: 0;
  border: none;
}
</style>
