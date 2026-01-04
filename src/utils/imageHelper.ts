/**
 * 图片相关工具函数
 */

/**
 * 获取预览图路径
 * @param previewPath 配置文件中的预览图路径
 * @returns 完整的图片 URL
 */
export function getPreviewImagePath(previewPath?: string): string {
  const base = import.meta.env.BASE_URL
  if (!previewPath) {
    return `${base}preview-images/placeholder.svg`
  }
  return `${base}preview-images/${previewPath}`
}

/**
 * 检查图片是否存在
 * @param path 图片路径
 * @returns Promise<boolean> 图片是否可访问
 */
export function checkImageExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = path
  })
}

/**
 * 预加载图片
 * @param paths 图片路径数组
 */
export async function preloadImages(paths: string[]): Promise<void> {
  const promises = paths.map(path => {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve() // 即使失败也继续
      img.src = path
    })
  })
  await Promise.all(promises)
}
