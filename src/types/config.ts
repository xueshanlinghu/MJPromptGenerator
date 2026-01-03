/**
 * 配置相关类型定义
 */

/** AI 供应商配置 */
export interface AIProviderConfig {
  id: string
  name: string
  enabled: boolean
  apiKey?: string
}

/** 应用配置 */
export interface AppConfig {
  /** 主题设置 */
  theme: 'light' | 'dark' | 'auto'
  /** 语言设置 */
  language: 'zh-CN' | 'en-US'
  /** AI 供应商 */
  aiProvider?: AIProviderConfig
}
