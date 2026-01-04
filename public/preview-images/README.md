# 预览图说明

## 目录结构

按照一级分类组织文件夹：
- `shutter-speed/` - 快门速度类提示词的预览图
- `depth-aperture/` - 景深和光圈类提示词的预览图
- `lens-position/` - 镜头位置类提示词的预览图
- `lighting/` - 光照类提示词的预览图
- `artists/` - 艺术家类提示词的预览图

## 使用说明

1. 将预览图片（推荐 16:9 比例，如 1920x1080 或 1280x720）放入对应的分类子目录
2. 在 `public/config/prompts.yaml` 中配置 `preview` 字段指向该图片（相对于 `public/preview-images/` 的路径）
3. （可选）配置 `generationPrompt` 字段，用于展示生成示例图的提示词
4. 如果某个提示词没有预览图，将显示默认占位符

## 配置示例

```yaml
- id: highspeed-photography
  prompt_zh: 高速摄影
  prompt_en: highspeed photography
  preview: shutter-speed/highspeed-photography.png
  generationPrompt: "photography, highspeed photography, a red bell pepper falls into the clear water and splashes, product map --v 7 --ar 16:9"
```

## 命名规范

建议使用小写字母和连字符命名，例如：
- `highspeed-photography.png`
- `golden-hour.jpg`
- `rembrandt-lighting.jpg`

## 支持的格式

- JPG/JPEG
- PNG
- WebP

## 图片尺寸建议

- 推荐使用 16:9 比例（例如：1920x1080、1280x720、960x540）
- 文件大小建议控制在 500KB 以内，以提升加载速度

