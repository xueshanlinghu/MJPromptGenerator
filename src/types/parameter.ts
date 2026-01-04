/**
 * 参数相关类型定义
 */

/** 参数类型 */
export type ParameterType = 'select' | 'slider' | 'input' | 'checkbox'

/** 选择器选项 */
export interface SelectOption {
  value: string
  label: string
}

/** 参数基础配置 */
export interface BaseParameter {
  /** 参数ID */
  id: string
  /** 参数名称 */
  name: string
  /** 参数类型 */
  type: ParameterType
  /** Midjourney 参数名（如 --v, --ar 等） */
  param: string
  /** 默认值 */
  default: string | number | boolean
  /** 描述 */
  description?: string
}

/** 选择器参数 */
export interface SelectParameter extends BaseParameter {
  type: 'select'
  options: SelectOption[]
  default: string
}

/** 滑块参数 */
export interface SliderParameter extends BaseParameter {
  type: 'slider'
  min: number
  max: number
  step: number
  default: number
}

/** 输入框参数 */
export interface InputParameter extends BaseParameter {
  type: 'input'
  placeholder?: string
  default: string
}

/** 复选框参数 */
export interface CheckboxParameter extends BaseParameter {
  type: 'checkbox'
  label?: string
  default: boolean
}

/** 参数联合类型 */
export type Parameter = SelectParameter | SliderParameter | InputParameter | CheckboxParameter

/** 参数配置文件结构 */
export interface ParametersConfig {
  parameters: Parameter[]
}

/** 参数值映射 */
export interface ParameterValues {
  /** 模型版本 */
  version?: string
  /** 宽高比 */
  aspectRatio?: string
  /** 风格化程度 */
  stylize?: number
  /** 混乱度 */
  chaos?: number
  /** 质量 */
  quality?: string
  /** 怪异度 */
  weird?: number
  /** 图片权重 */
  imageWeight?: number
  /** 风格权重 */
  styleWeight?: number
  /** 风格参考 */
  styleRef?: string
  /** 角色参考 */
  characterRef?: string
  /** 负面提示词 */
  no?: string
  /** 平铺模式 */
  tile?: boolean
  /** 风格模式 */
  style?: string
  /** 种子 */
  seed?: number
  /** 停止百分比 */
  stop?: number
  [key: string]: any
}
