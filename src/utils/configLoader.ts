import yaml from 'js-yaml'
import type { PromptsConfig, ParametersConfig } from '@/types'

/**
 * 加载 YAML 配置文件
 * @param path 配置文件路径（相对于 public 目录）
 * @returns 解析后的配置对象
 */
async function loadYamlConfig<T>(path: string): Promise<T> {
  try {
    // 使用 BASE_URL 确保在子目录部署时路径正确
    const baseUrl = import.meta.env.BASE_URL
    const fullPath = `${baseUrl}${path}`
    // 添加时间戳防止缓存（开发环境）
    const url = import.meta.env.DEV ? `${fullPath}?t=${Date.now()}` : fullPath
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to load config: ${url}`)
    }
    const text = await response.text()
    return yaml.load(text) as T
  } catch (error) {
    console.error(`Error loading config:`, error)
    throw error
  }
}

/**
 * 加载提示词配置
 */
export async function loadPromptsConfig(): Promise<PromptsConfig> {
  return loadYamlConfig<PromptsConfig>('config/prompts.yaml')
}

/**
 * 加载参数配置
 */
export async function loadParametersConfig(): Promise<ParametersConfig> {
  return loadYamlConfig<ParametersConfig>('config/parameters.yaml')
}

/**
 * 配置缓存
 */
const configCache = {
  prompts: null as PromptsConfig | null,
  parameters: null as ParametersConfig | null
}

/**
 * 获取提示词配置（带缓存）
 */
export async function getPromptsConfig(): Promise<PromptsConfig> {
  if (!configCache.prompts) {
    configCache.prompts = await loadPromptsConfig()
  }
  return configCache.prompts
}

/**
 * 获取参数配置（带缓存）
 */
export async function getParametersConfig(): Promise<ParametersConfig> {
  if (!configCache.parameters) {
    configCache.parameters = await loadParametersConfig()
  }
  return configCache.parameters
}

/**
 * 清除配置缓存（用于开发时重新加载）
 */
export function clearConfigCache(): void {
  configCache.prompts = null
  configCache.parameters = null
}
