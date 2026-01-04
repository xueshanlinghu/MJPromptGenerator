import { defineStore } from 'pinia'
import type { PromptsConfig, PromptCategory, PromptItem, SelectedPrompt } from '@/types'
import { getPromptsConfig } from '@/utils'

interface PromptState {
  /** 提示词配置 */
  config: PromptsConfig | null
  /** 已选择的提示词 */
  selectedPrompts: SelectedPrompt[]
  /** 主体与环境描述 */
  subjectEnvironment: string
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

export const usePromptStore = defineStore('prompt', {
  state: (): PromptState => ({
    config: null,
    selectedPrompts: [],
    subjectEnvironment: '',
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
     * 根据ID获取提示词（支持子分类）
     */
    getPromptById: (state) => {
      return (categoryId: string, promptId: string, subCategoryId?: string): PromptItem | undefined => {
        const category = state.config?.categories.find(c => c.id === categoryId)
        if (!category) return undefined

        // 如果有子分类ID，在子分类中查找
        if (subCategoryId && category.subCategories) {
          const subCategory = category.subCategories.find(sc => sc.id === subCategoryId)
          return subCategory?.prompts.find(p => p.id === promptId)
        }

        // 否则在一级分类中查找
        return category.prompts?.find(p => p.id === promptId)
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
     * 检查提示词是否已选中（支持子分类）
     */
    isPromptSelected: (state) => {
      return (categoryId: string, promptId: string, subCategoryId?: string): boolean => {
        return state.selectedPrompts.some(p => {
          const categoryMatch = p.categoryId === categoryId
          const promptMatch = p.promptId === promptId
          const subCategoryMatch = subCategoryId ? p.subCategoryId === subCategoryId : true
          return categoryMatch && promptMatch && subCategoryMatch
        })
      }
    },

    /**
     * 获取主体环境示例
     */
    subjectEnvironmentExamples: (state) => {
      return state.config?.subjectEnvironmentExamples || []
    },

    /**
     * 按位置标签分组的已选提示词
     */
    groupedSelectedPrompts: (state) => {
      const groups: Record<string, SelectedPrompt[]> = {
        artist: [],
        camera: [],
        lighting: [],
        other: []
      }

      state.selectedPrompts
        .sort((a, b) => a.timestamp - b.timestamp)
        .forEach(prompt => {
          const tag = prompt.positionTag || 'other'
          if (tag in groups) {
            groups[tag].push(prompt)
          } else {
            groups.other.push(prompt)
          }
        })

      return groups
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
     * 初始化（设置热更新监听）
     */
    init() {
      // 开发环境下监听配置热更新
      if (import.meta.env.DEV) {
        window.addEventListener('config:prompts:updated', () => {
          console.log('🔄 Reloading prompts config...')
          this.loadConfig()
        })
      }
    },

    /**
     * 设置主体与环境描述
     */
    setSubjectEnvironment(value: string) {
      this.subjectEnvironment = value
    },

    /**
     * 添加提示词（支持子分类）
     */
    addPrompt(categoryId: string, promptId: string, subCategoryId?: string) {
      // 检查是否已存在
      if (this.isPromptSelected(categoryId, promptId, subCategoryId)) {
        return
      }

      const prompt = this.getPromptById(categoryId, promptId, subCategoryId)
      if (!prompt) {
        console.warn(`Prompt not found: ${categoryId}/${subCategoryId || 'root'}/${promptId}`)
        return
      }

      const category = this.getCategoryById(categoryId)
      const positionTag = category?.special?.positionTag

      this.selectedPrompts.push({
        categoryId,
        subCategoryId,
        promptId,
        text: prompt.prompt_en,  // 使用英文提示词
        timestamp: Date.now(),
        positionTag
      })
    },

    /**
     * 移除提示词（支持子分类）
     */
    removePrompt(categoryId: string, promptId: string, subCategoryId?: string) {
      this.selectedPrompts = this.selectedPrompts.filter(p => {
        const categoryMatch = p.categoryId === categoryId
        const promptMatch = p.promptId === promptId
        const subCategoryMatch = subCategoryId ? p.subCategoryId === subCategoryId : p.subCategoryId === undefined
        return !(categoryMatch && promptMatch && subCategoryMatch)
      })
    },

    /**
     * 切换提示词选中状态（支持子分类）
     */
    togglePrompt(categoryId: string, promptId: string, subCategoryId?: string) {
      if (this.isPromptSelected(categoryId, promptId, subCategoryId)) {
        this.removePrompt(categoryId, promptId, subCategoryId)
      } else {
        this.addPrompt(categoryId, promptId, subCategoryId)
      }
    },

    /**
     * 清空所有已选提示词和主体环境
     */
    clearAll() {
      this.selectedPrompts = []
      this.subjectEnvironment = ''
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
