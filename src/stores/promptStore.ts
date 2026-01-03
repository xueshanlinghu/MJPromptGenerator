import { defineStore } from 'pinia'
import type { PromptsConfig, PromptCategory, PromptItem, SelectedPrompt } from '@/types'
import { getPromptsConfig } from '@/utils'

interface PromptState {
  /** 提示词配置 */
  config: PromptsConfig | null
  /** 已选择的提示词 */
  selectedPrompts: SelectedPrompt[]
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

export const usePromptStore = defineStore('prompt', {
  state: (): PromptState => ({
    config: null,
    selectedPrompts: [],
    loading: false,
    error: null
  }),

  getters: {
    /**
     * 获取所有分类
     */
    categories: (state): PromptCategory[] => {
      return state.config?.categories || []
    },

    /**
     * 根据ID获取分类
     */
    getCategoryById: (state) => {
      return (categoryId: string): PromptCategory | undefined => {
        return state.config?.categories.find(c => c.id === categoryId)
      }
    },

    /**
     * 根据ID获取提示词
     */
    getPromptById: (state) => {
      return (categoryId: string, promptId: string): PromptItem | undefined => {
        const category = state.config?.categories.find(c => c.id === categoryId)
        return category?.prompts.find(p => p.id === promptId)
      }
    },

    /**
     * 获取已选提示词的文本数组
     */
    selectedPromptTexts: (state): string[] => {
      return state.selectedPrompts
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(p => p.text)
    },

    /**
     * 检查提示词是否已选中
     */
    isPromptSelected: (state) => {
      return (categoryId: string, promptId: string): boolean => {
        return state.selectedPrompts.some(
          p => p.categoryId === categoryId && p.promptId === promptId
        )
      }
    }
  },

  actions: {
    /**
     * 加载提示词配置
     */
    async loadConfig() {
      this.loading = true
      this.error = null
      try {
        this.config = await getPromptsConfig()
      } catch (error) {
        this.error = error instanceof Error ? error.message : '加载配置失败'
        console.error('Failed to load prompts config:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * 添加提示词
     */
    addPrompt(categoryId: string, promptId: string) {
      // 检查是否已存在
      if (this.isPromptSelected(categoryId, promptId)) {
        return
      }

      const prompt = this.getPromptById(categoryId, promptId)
      if (!prompt) {
        console.warn(`Prompt not found: ${categoryId}/${promptId}`)
        return
      }

      this.selectedPrompts.push({
        categoryId,
        promptId,
        text: prompt.text,
        timestamp: Date.now()
      })
    },

    /**
     * 移除提示词
     */
    removePrompt(categoryId: string, promptId: string) {
      this.selectedPrompts = this.selectedPrompts.filter(
        p => !(p.categoryId === categoryId && p.promptId === promptId)
      )
    },

    /**
     * 切换提示词选中状态
     */
    togglePrompt(categoryId: string, promptId: string) {
      if (this.isPromptSelected(categoryId, promptId)) {
        this.removePrompt(categoryId, promptId)
      } else {
        this.addPrompt(categoryId, promptId)
      }
    },

    /**
     * 清空所有已选提示词
     */
    clearAll() {
      this.selectedPrompts = []
    },

    /**
     * 调整提示词顺序
     */
    reorderPrompt(fromIndex: number, toIndex: number) {
      // 先按时间戳排序获得当前顺序
      const sorted = [...this.selectedPrompts].sort((a, b) => a.timestamp - b.timestamp)

      // 移动元素
      const [removed] = sorted.splice(fromIndex, 1)
      sorted.splice(toIndex, 0, removed)

      // 更新时间戳以保持新顺序
      const baseTime = Date.now()
      sorted.forEach((prompt, index) => {
        prompt.timestamp = baseTime + index
      })

      // 重新赋值以触发响应式更新
      this.selectedPrompts = sorted
    }
  }
})
