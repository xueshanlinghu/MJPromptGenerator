/**
 * 提示词相关类型定义
 */

/** 单个提示词项 */
export interface PromptItem {
  /** 唯一标识 */
  id: string
  /** 中文提示词（显示用） */
  prompt_zh: string
  /** 英文提示词（实际使用） */
  prompt_en: string
  /** 额外说明（可选，如"适用于xxx场景"） */
  description?: string
  /** 预览图路径（相对于 public/preview-images/） */
  preview?: string
}

/** 二级子分类 */
export interface PromptSubCategory {
  /** 子分类ID */
  id: string
  /** 子分类名称 */
  name: string
  /** 该子分类下的提示词列表 */
  prompts: PromptItem[]
}

/** 分类特殊属性 */
export interface CategorySpecial {
  /** 是否是艺术家分类 */
  isArtist?: boolean
  /** 单选建议提示（如"建议单选，多选可能导致风格冲突"） */
  singleSelectionHint?: string
  /** 在提示词生成中的位置标识 */
  positionTag?: 'artist' | 'camera' | 'lighting' | 'other'
}

/** 提示词分类（支持二级分类） */
export interface PromptCategory {
  /** 分类ID */
  id: string
  /** 分类名称 */
  name: string
  /** 图标名称（可选） */
  icon?: string
  /** 分类特殊属性（可选） */
  special?: CategorySpecial
  /** 该分类下的提示词列表（一级分类，可选，向后兼容） */
  prompts?: PromptItem[]
  /** 二级子分类（可选） */
  subCategories?: PromptSubCategory[]
}

/** 主体环境示例 */
export interface SubjectEnvironmentExample {
  /** 示例ID */
  id: string
  /** 示例标题 */
  title: string
  /** 主体描述 */
  subject: string
  /** 环境描述 */
  environment: string
  /** 完整文本（subject + environment） */
  fullText: string
}

/** 提示词配置文件结构 */
export interface PromptsConfig {
  /** 分类列表 */
  categories: PromptCategory[]
  /** 主体环境示例列表（可选） */
  subjectEnvironmentExamples?: SubjectEnvironmentExample[]
}

/** 已选择的提示词（支持子分类和位置标签） */
export interface SelectedPrompt {
  /** 分类ID */
  categoryId: string
  /** 子分类ID（可选，如果是二级分类） */
  subCategoryId?: string
  /** 提示词ID */
  promptId: string
  /** 提示词文本 */
  text: string
  /** 选中的时间戳（用于排序） */
  timestamp: number
  /** 分类位置标签（用于智能组合，继承自category.special.positionTag） */
  positionTag?: string
}
