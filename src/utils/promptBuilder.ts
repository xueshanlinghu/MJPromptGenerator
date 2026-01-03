import type { ParameterValues } from '@/types'

/**
 * 提示词构建器
 */
export class PromptBuilder {
  /**
   * 构建最终的 Midjourney 提示词
   * @param selectedPrompts 已选择的提示词文本数组
   * @param parameters 参数值
   * @returns 完整的提示词字符串
   */
  static build(selectedPrompts: string[], parameters: ParameterValues): string {
    // 1. 组合基础提示词（用逗号分隔）
    const promptText = selectedPrompts.filter(p => p.trim()).join(', ')

    // 2. 构建参数字符串
    const params: string[] = []

    // 版本
    if (parameters.version) {
      params.push(`--v ${parameters.version}`)
    }

    // 宽高比
    if (parameters.aspectRatio) {
      params.push(`--ar ${parameters.aspectRatio}`)
    }

    // 风格化程度（只在非默认值时添加）
    if (parameters.stylize !== undefined && parameters.stylize !== 100) {
      params.push(`--s ${parameters.stylize}`)
    }

    // 混乱度（只在非0时添加）
    if (parameters.chaos && parameters.chaos > 0) {
      params.push(`--c ${parameters.chaos}`)
    }

    // 质量（只在非默认值时添加）
    if (parameters.quality && parameters.quality !== '1') {
      params.push(`--q ${parameters.quality}`)
    }

    // 怪异度
    if (parameters.weird && parameters.weird > 0) {
      params.push(`--weird ${parameters.weird}`)
    }

    // 图片权重
    if (parameters.imageWeight && parameters.imageWeight !== 1) {
      params.push(`--iw ${parameters.imageWeight}`)
    }

    // 风格权重
    if (parameters.styleWeight && parameters.styleWeight !== 100) {
      params.push(`--sw ${parameters.styleWeight}`)
    }

    // 风格参考
    if (parameters.styleRef && parameters.styleRef.trim()) {
      params.push(`--sref ${parameters.styleRef.trim()}`)
    }

    // 角色参考
    if (parameters.characterRef && parameters.characterRef.trim()) {
      params.push(`--cref ${parameters.characterRef.trim()}`)
    }

    // 负面提示词
    if (parameters.no && parameters.no.trim()) {
      params.push(`--no ${parameters.no.trim()}`)
    }

    // 平铺模式
    if (parameters.tile) {
      params.push('--tile')
    }

    // 风格模式
    if (parameters.style && parameters.style.trim()) {
      params.push(`--style ${parameters.style}`)
    }

    // 种子
    if (parameters.seed !== undefined && parameters.seed > 0) {
      params.push(`--seed ${parameters.seed}`)
    }

    // 停止百分比
    if (parameters.stop && parameters.stop !== 100) {
      params.push(`--stop ${parameters.stop}`)
    }

    // 3. 组合最终结果
    if (params.length > 0) {
      return `${promptText} ${params.join(' ')}`
    }
    return promptText
  }

  /**
   * 验证提示词是否有效
   * @param prompt 提示词字符串
   * @returns 是否有效
   */
  static isValid(prompt: string): boolean {
    return prompt.trim().length > 0
  }
}
