import { defineStore } from 'pinia'
import type { ParametersConfig, Parameter, ParameterValues } from '@/types'
import { getParametersConfig } from '@/utils'

interface ParameterState {
  /** 参数配置 */
  config: ParametersConfig | null
  /** 参数值 */
  values: ParameterValues
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
}

export const useParameterStore = defineStore('parameter', {
  state: (): ParameterState => ({
    config: null,
    values: {},
    loading: false,
    error: null
  }),

  getters: {
    /**
     * 获取所有参数配置
     */
    parameters: (state): Parameter[] => {
      return state.config?.parameters || []
    },

    /**
     * 根据ID获取参数
     */
    getParameterById: (state) => {
      return (id: string): Parameter | undefined => {
        return state.config?.parameters.find(p => p.id === id)
      }
    },

    /**
     * 获取参数值
     */
    getValue: (state) => {
      return (id: string): any => {
        const param = state.config?.parameters.find(p => p.id === id)
        return state.values[id] ?? param?.default
      }
    }
  },

  actions: {
    /**
     * 加载参数配置
     */
    async loadConfig() {
      this.loading = true
      this.error = null
      try {
        this.config = await getParametersConfig()
        this.initializeValues()
      } catch (error) {
        this.error = error instanceof Error ? error.message : '加载配置失败'
        console.error('Failed to load parameters config:', error)
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
        window.addEventListener('config:parameters:updated', () => {
          console.log('🔄 Reloading parameters config...')
          this.loadConfig()
        })
      }
    },

    /**
     * 初始化参数值为默认值
     */
    initializeValues() {
      if (!this.config) return

      const values: ParameterValues = {}
      this.config.parameters.forEach(param => {
        values[param.id] = param.default
      })
      this.values = values
    },

    /**
     * 设置参数值
     */
    setValue(id: string, value: any) {
      this.values[id] = value
    },

    /**
     * 重置单个参数到默认值
     */
    resetParameter(id: string) {
      const param = this.getParameterById(id)
      if (param) {
        this.values[id] = param.default
      }
    },

    /**
     * 重置所有参数到默认值
     */
    resetAll() {
      this.initializeValues()
    },

    /**
     * 重置所有参数到默认值（别名）
     */
    resetToDefaults() {
      this.resetAll()
    },

    /**
     * 从 localStorage 加载保存的参数值
     */
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem('mj-parameter-values')
        if (saved) {
          const parsed = JSON.parse(saved)
          this.values = { ...this.values, ...parsed }
        }
      } catch (error) {
        console.error('Failed to load parameters from localStorage:', error)
      }
    },

    /**
     * 保存参数值到 localStorage
     */
    saveToLocalStorage() {
      try {
        localStorage.setItem('mj-parameter-values', JSON.stringify(this.values))
      } catch (error) {
        console.error('Failed to save parameters to localStorage:', error)
      }
    }
  }
})
