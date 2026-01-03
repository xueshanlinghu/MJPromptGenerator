import type { ParameterValues, SelectedPrompt } from '@/types'

/**
 * 提示词构建器
 */
export class PromptBuilder {
  /**
   * 摄影专用提示词构建（新版）
   * @param selectedPrompts 已选择的提示词列表（包含位置标签）
   * @param subjectEnvironment 主体与环境描述
   * @param parameters 参数值
   * @returns 完整的提示词字符串
   */
  static buildPhotography(
    selectedPrompts: SelectedPrompt[],
    subjectEnvironment: string,
    parameters: ParameterValues
  ): string {
    // 1. 按位置标签分组
    const groups = this.groupPromptsByPosition(selectedPrompts)

    // 2. 构建摄影前缀
    const photographyPrefix = groups.artist.length > 0
      ? `photography by ${groups.artist.map(p => p.text).join(', ')}`
      : 'photography'

    // 3. 组合各部分（按固定顺序）
    const parts: string[] = []

    // 添加摄影前缀
    parts.push(photographyPrefix)

    // 添加机位/景别（camera）
    if (groups.camera.length > 0) {
      parts.push(groups.camera.map(p => p.text).join(', '))
    }

    // 添加主体环境
    const trimmedSubject = subjectEnvironment.trim()
    if (trimmedSubject) {
      parts.push(trimmedSubject)
    }

    // 添加打光（lighting）
    if (groups.lighting.length > 0) {
      parts.push(groups.lighting.map(p => p.text).join(', '))
    }

    // 添加其他（other）
    if (groups.other.length > 0) {
      parts.push(groups.other.map(p => p.text).join(', '))
    }

    const promptText = parts.filter(p => p).join(', ')

    // 4. 添加参数（复用原有逻辑）
    return this.addParameters(promptText, parameters)
  }

  /**
   * 按位置标签分组提示词
   * @param prompts 已选择的提示词列表
   * @returns 按位置分组的提示词
   */
  private static groupPromptsByPosition(prompts: SelectedPrompt[]): Record<string, SelectedPrompt[]> {
    const groups: Record<string, SelectedPrompt[]> = {
      artist: [],
      camera: [],
      lighting: [],
      other: []
    }

    prompts
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

  /**
   * 添加参数到提示词
   * @param promptText 基础提示词文本
   * @param parameters 参数值
   * @returns 带参数的完整提示词
   */
  private static addParameters(promptText: string, parameters: ParameterValues): string {
    const params: string[] = []

    // 版本（特殊处理 Niji 模型）
    if (parameters.version) {
      if (parameters.version.startsWith('niji')) {
        const nijiVersion = parameters.version.replace('niji-', '')
        params.push(`--niji ${nijiVersion}`)
      } else {
        params.push(`--v ${parameters.version}`)
      }
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

    // 组合最终结果
    if (params.length > 0) {
      return `${promptText} ${params.join(' ')}`
    }
    return promptText
  }

  /**
   * 构建最终的 Midjourney 提示词（原版，向后兼容）
   * @param selectedPrompts 已选择的提示词文本数组
   * @param parameters 参数值
   * @returns 完整的提示词字符串
   */
  static build(selectedPrompts: string[], parameters: ParameterValues): string {
    // 1. 组合基础提示词（用逗号分隔）
    const promptText = selectedPrompts.filter(p => p.trim()).join(', ')

    // 2. 添加参数（复用新逻辑）
    return this.addParameters(promptText, parameters)
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
