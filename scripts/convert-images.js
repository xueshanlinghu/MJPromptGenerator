#!/usr/bin/env node

/**
 * PNG 转 WebP 批量转换脚本
 *
 * 功能：
 * - 递归扫描指定目录下的所有 PNG 图片
 * - 转换为 WebP 格式（保持原分辨率 1456×816）
 * - 转换成功后自动删除原 PNG 文件
 *
 * 使用方法：
 *   node scripts/convert-images.js <目录路径>
 *
 * 示例：
 *   node scripts/convert-images.js public/preview-images
 *   node scripts/convert-images.js public/preview-images/shutter-speed
 */

import sharp from 'sharp'
import { readdir, stat, unlink } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'
import { existsSync } from 'fs'

// 配置
const CONFIG = {
  // WebP 质量 (0-100)
  quality: 85,
  // 支持的输入格式
  inputFormats: ['.png'],
  // 输出格式
  outputFormat: 'webp',
  // 是否自动删除原文件
  deleteOriginal: true
}

/**
 * 递归获取所有 PNG 文件
 */
async function getPNGFiles(dir) {
  const files = []

  try {
    if (!existsSync(dir)) {
      console.error(`❌ 目录不存在: ${dir}`)
      return files
    }

    const items = await readdir(dir)

    for (const item of items) {
      const fullPath = join(dir, item)
      const stats = await stat(fullPath)

      if (stats.isDirectory()) {
        // 递归处理子目录
        const subFiles = await getPNGFiles(fullPath)
        files.push(...subFiles)
      } else if (stats.isFile()) {
        const ext = extname(item).toLowerCase()
        if (CONFIG.inputFormats.includes(ext)) {
          files.push(fullPath)
        }
      }
    }
  } catch (error) {
    console.error(`❌ 读取目录失败: ${dir}`, error.message)
  }

  return files
}

/**
 * 转换单个 PNG 为 WebP
 */
async function convertToWebP(inputPath) {
  try {
    // 构建输出路径（同目录，替换扩展名）
    const dir = dirname(inputPath)
    const name = basename(inputPath, extname(inputPath))
    const outputPath = join(dir, `${name}.${CONFIG.outputFormat}`)

    // 如果输出文件已存在，跳过
    if (existsSync(outputPath)) {
      console.log(`⏭️  跳过（已存在 WebP）: ${basename(inputPath)}`)

      // 如果设置了删除原文件，且 WebP 已存在，删除 PNG
      if (CONFIG.deleteOriginal) {
        await unlink(inputPath)
        console.log(`   🗑️  删除原文件: ${basename(inputPath)}`)
      }

      return {
        skipped: true,
        inputPath,
        outputPath
      }
    }

    // 读取原图信息
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    const inputStats = await stat(inputPath)
    const inputSizeKB = (inputStats.size / 1024).toFixed(2)

    console.log(`\n🔄 处理: ${inputPath}`)
    console.log(`   原尺寸: ${metadata.width}×${metadata.height}`)
    console.log(`   原大小: ${inputSizeKB} KB`)

    // 转换为 WebP
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(outputPath)

    // 获取输出文件大小
    const outputStats = await stat(outputPath)
    const outputSizeKB = (outputStats.size / 1024).toFixed(2)
    const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1)

    console.log(`   ✅ 转换成功: ${basename(outputPath)}`)
    console.log(`   新大小: ${outputSizeKB} KB (减少 ${reduction}%)`)

    // 删除原 PNG 文件
    if (CONFIG.deleteOriginal) {
      await unlink(inputPath)
      console.log(`   🗑️  删除原文件: ${basename(inputPath)}`)
    }

    return {
      success: true,
      inputPath,
      outputPath,
      originalSize: parseFloat(inputSizeKB),
      newSize: parseFloat(outputSizeKB),
      reduction: parseFloat(reduction)
    }
  } catch (error) {
    console.error(`\n❌ 转换失败: ${inputPath}`)
    console.error(`   错误: ${error.message}`)
    return {
      success: false,
      error: error.message,
      inputPath
    }
  }
}

/**
 * 批量转换
 */
async function batchConvert(directory) {
  console.log('🖼️  PNG 转 WebP 批量转换工具\n')
  console.log('配置:')
  console.log(`  目标目录: ${directory}`)
  console.log(`  WebP 质量: ${CONFIG.quality}`)
  console.log(`  自动删除原文件: ${CONFIG.deleteOriginal ? '是' : '否'}`)
  console.log(`  递归处理子目录: 是\n`)
  console.log('='.repeat(60))

  // 获取所有 PNG 文件
  const files = await getPNGFiles(directory)

  if (files.length === 0) {
    console.log('\n❌ 没有找到 PNG 文件')
    return
  }

  console.log(`\n📁 找到 ${files.length} 个 PNG 文件\n`)

  // 确认是否继续
  console.log('⚠️  警告: 转换成功后将自动删除原 PNG 文件！')
  console.log('   请确保已备份重要文件或使用 Git 版本管理\n')

  // 转换所有文件
  const results = {
    success: [],
    skipped: [],
    failed: []
  }

  for (const file of files) {
    const result = await convertToWebP(file)

    if (result.skipped) {
      results.skipped.push(result)
    } else if (result.success) {
      results.success.push(result)
    } else {
      results.failed.push(result)
    }
  }

  // 统计信息
  console.log('\n' + '='.repeat(60))
  console.log('📊 转换完成统计\n')
  console.log(`✅ 成功转换: ${results.success.length}`)
  console.log(`⏭️  跳过（已存在）: ${results.skipped.length}`)
  console.log(`❌ 转换失败: ${results.failed.length}`)
  console.log(`📁 总文件数: ${files.length}`)

  if (results.success.length > 0) {
    const totalOriginalSize = results.success.reduce((sum, r) => sum + r.originalSize, 0)
    const totalNewSize = results.success.reduce((sum, r) => sum + r.newSize, 0)
    const totalReduction = ((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1)

    console.log(`\n💾 空间节省:`)
    console.log(`   原总大小: ${totalOriginalSize.toFixed(2)} KB`)
    console.log(`   新总大小: ${totalNewSize.toFixed(2)} KB`)
    console.log(`   节省空间: ${(totalOriginalSize - totalNewSize).toFixed(2)} KB (${totalReduction}%)`)
  }

  if (results.failed.length > 0) {
    console.log(`\n❌ 失败的文件:`)
    results.failed.forEach(r => {
      console.log(`   - ${r.inputPath}`)
      console.log(`     错误: ${r.error}`)
    })
  }

  console.log('\n✅ 批量转换完成!')
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2)

  // 显示帮助
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
PNG 转 WebP 批量转换工具

用法:
  node scripts/convert-images.js <目录路径> [选项]

参数:
  <目录路径>    要处理的目录路径（必需）

选项:
  -h, --help    显示帮助信息
  --dry-run     模拟运行，不删除原文件（TODO）

示例:
  # 转换整个预览图目录
  node scripts/convert-images.js public/preview-images

  # 转换特定子目录
  node scripts/convert-images.js public/preview-images/shutter-speed

说明:
  - 递归处理所有子目录
  - 保持原图分辨率（1456×816）
  - WebP 质量: 85
  - 转换成功后自动删除原 PNG 文件
  - 如果 WebP 已存在则跳过转换

注意:
  ⚠️  转换成功后会自动删除原 PNG 文件！
  建议在运行前确保文件已通过 Git 版本管理或已备份。
    `)
    process.exit(0)
  }

  const directory = args[0]

  // 检查目录是否存在
  if (!existsSync(directory)) {
    console.error(`❌ 错误: 目录不存在 "${directory}"`)
    process.exit(1)
  }

  // 检查是否是目录
  const stats = await stat(directory)
  if (!stats.isDirectory()) {
    console.error(`❌ 错误: "${directory}" 不是一个目录`)
    process.exit(1)
  }

  // 执行批量转换
  await batchConvert(directory)
}

main()
