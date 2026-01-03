/**
 * 提示词相关类型定义
 */

/** 单个提示词项 */
export interface PromptItem {
  /** 唯一标识 */
  id: string
  /** 提示词文本（英文） */
  text: string
  /** 中文描述 */
  description: string
  /** 预览图路径（相对于 public/preview-images/） */
  preview?: string
}

/** 提示词分类 */
export interface PromptCategory {
  /** 分类ID */
  id: string
  /** 分类名称 */
  name: string
  /** 图标名称（可选） */
  icon?: string
  /** 该分类下的提示词列表 */
  prompts: PromptItem[]
}

/** 提示词配置文件结构 */
export interface PromptsConfig {
  categories: PromptCategory[]
}

/** 已选择的提示词 */
export interface SelectedPrompt {
  /** 分类ID */
  categoryId: string
  /** 提示词ID */
  promptId: string
  /** 提示词文本 */
  text: string
  /** 选中的时间戳（用于排序） */
  timestamp: number
}
