# PNG 转 WebP 批量转换工具

将预览图从 PNG 格式批量转换为 WebP 格式，减小文件体积，加快加载速度。

## 📋 方案说明

**选定方案：1456×816 分辨率 + WebP 格式（质量 85）**

### 为什么选择这个方案？

经过实际测试对比，这个方案能够：
- ✅ 保持 MJ 原图的完整分辨率（1456×816）
- ✅ 在画廊大图和卡片预览中都能保持清晰
- ✅ 文件大小减少约 60%（PNG → WebP）
- ✅ 在 Retina 屏幕上显示效果优秀
- ✅ 无需调整图片尺寸，保留所有细节

### 实测效果

以 `slow-motion.png` 为例：
- **原图**：437.83 KB (PNG)
- **转换后**：177.01 KB (WebP)
- **减少**：59.6%

## 🚀 快速开始

### 1. 转换整个预览图目录

```bash
node scripts/convert-images.js public/preview-images
```

### 2. 转换特定子目录

```bash
node scripts/convert-images.js public/preview-images/shutter-speed
```

### 3. 查看帮助

```bash
node scripts/convert-images.js --help
```

## 📖 使用说明

### 脚本功能

- ✅ 递归扫描指定目录及所有子目录
- ✅ 查找所有 `.png` 文件
- ✅ 转换为 WebP 格式（保持原分辨率）
- ✅ 质量设为 85（平衡清晰度和文件大小）
- ✅ 转换成功后自动删除原 PNG 文件
- ✅ 如果 WebP 已存在则跳过转换
- ✅ 显示详细的进度和统计信息

### 运行示例

```bash
$ node scripts/convert-images.js public/preview-images/shutter-speed

🖼️  PNG 转 WebP 批量转换工具

配置:
  目标目录: public/preview-images/shutter-speed
  WebP 质量: 85
  自动删除原文件: 是
  递归处理子目录: 是

============================================================

📁 找到 4 个 PNG 文件

⚠️  警告: 转换成功后将自动删除原 PNG 文件！
   请确保已备份重要文件或使用 Git 版本管理

🔄 处理: public/preview-images/shutter-speed/slow-motion.png
   原尺寸: 1456×816
   原大小: 437.83 KB
   ✅ 转换成功: slow-motion.webp
   新大小: 177.01 KB (减少 59.6%)
   🗑️  删除原文件: slow-motion.png

... (其他文件)

============================================================
📊 转换完成统计

✅ 成功转换: 4
⏭️  跳过（已存在）: 0
❌ 转换失败: 0
📁 总文件数: 4

💾 空间节省:
   原总大小: 1200.50 KB
   新总大小: 450.23 KB
   节省空间: 750.27 KB (62.5%)

✅ 批量转换完成!
```

## ⚠️ 重要提示

### 自动删除原文件

**脚本会在转换成功后自动删除原 PNG 文件！**

请务必在运行前：
1. ✅ 确保文件已通过 Git 提交
2. ✅ 或者已有备份

如果文件在 Git 版本管理中，删除后仍可通过 Git 历史恢复。

### 安全机制

- 如果 WebP 文件已存在，不会重复转换
- 如果转换失败，不会删除原 PNG 文件
- 显示详细的处理日志，方便追踪

## 🔄 工作流程

### 首次使用

1. **确保文件已提交到 Git**
   ```bash
   git add public/preview-images
   git commit -m "feat: 添加预览图"
   ```

2. **运行转换脚本**
   ```bash
   node scripts/convert-images.js public/preview-images
   ```

3. **更新配置文件**

   将 `prompts.yaml` 中的预览图路径从 `.png` 改为 `.webp`：

   ```yaml
   # 修改前
   preview: shutter-speed/slow-motion.png

   # 修改后
   preview: shutter-speed/slow-motion.webp
   ```

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 将预览图转换为 WebP 格式以优化加载速度"
   ```

### 后续添加新图片

当你添加新的预览图时：

1. **保存 MJ 生成的 PNG 图片**到对应目录
   ```bash
   # 例如保存到
   public/preview-images/shutter-speed/new-image.png
   ```

2. **运行转换脚本**
   ```bash
   # 可以转换整个目录
   node scripts/convert-images.js public/preview-images

   # 或只转换特定子目录
   node scripts/convert-images.js public/preview-images/shutter-speed
   ```

3. **在 prompts.yaml 中配置**
   ```yaml
   - id: new-image
     prompt_zh: 新图片
     prompt_en: new image
     preview: shutter-speed/new-image.webp  # 使用 .webp 扩展名
   ```

## 📊 预期效果

### 空间节省

假设你有 50 张预览图，每张平均 400KB：

| 格式 | 单张大小 | 50张总大小 |
|------|---------|-----------|
| PNG | 400 KB | 20 MB |
| WebP (质量85) | 160 KB | 8 MB |
| **节省** | **-60%** | **-12 MB** |

### 加载速度

- 初次加载网站时下载量减少 60%
- 画廊页面加载更快
- 卡片预览响应更快
- 移动端体验提升明显

## 🛠️ 技术细节

### 配置参数

在 `scripts/convert-images.js` 中可以调整：

```javascript
const CONFIG = {
  // WebP 质量 (0-100)，推荐 85
  quality: 85,

  // 支持的输入格式
  inputFormats: ['.png'],

  // 输出格式
  outputFormat: 'webp',

  // 是否自动删除原文件
  deleteOriginal: true
}
```

### WebP 兼容性

- Chrome: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 支持（macOS 11+, iOS 14+）
- Edge: ✅ 完全支持

覆盖率 > 95% 的现代浏览器

## ❓ 常见问题

### Q: 如果误删了原 PNG 文件怎么办？

A: 如果文件在 Git 版本管理中，可以通过以下命令恢复：
```bash
git checkout HEAD -- public/preview-images/path/to/file.png
```

### Q: 可以只转换不删除吗？

A: 目前脚本默认删除原文件。如果需要保留，可以修改 `CONFIG.deleteOriginal = false`

### Q: 转换失败会怎样？

A: 转换失败时不会删除原文件，并会在统计中显示失败信息

### Q: WebP 已存在时会怎样？

A: 跳过转换，但仍会删除对应的 PNG 文件（如果启用了自动删除）

### Q: 为什么选择质量 85？

A: 质量 85 是一个经过测试的平衡点：
- 视觉效果与原图几乎无差别
- 文件大小减少约 60%
- 符合 Web 图片优化的最佳实践

## 📝 维护建议

1. **定期检查**：确保所有新添加的图片都已转换
2. **Git 管理**：始终通过 Git 管理预览图文件
3. **一致性**：统一使用 WebP 格式，不要混用 PNG 和 WebP
4. **文档更新**：在 `preview_prompt.json` 中使用 `.webp` 扩展名

## 🎯 总结

使用 WebP 格式的优势：
- ✅ 大幅减小文件体积（~60%）
- ✅ 保持原图清晰度
- ✅ 加快网站加载速度
- ✅ 现代浏览器广泛支持
- ✅ 简单的工作流程

运行一次脚本，即可享受持续的性能优化！
