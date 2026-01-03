# 预览图说明

## 目录结构

- `styles/` - 风格类提示词的预览图
- `subjects/` - 主题类提示词的预览图
- `lighting/` - 光照类提示词的预览图
- `quality/` - 质量类提示词的预览图

## 使用说明

1. 将预览图片（推荐 256x256px 或更高分辨率）放入对应的子目录
2. 在 `src/config/prompts.yaml` 中配置 `preview` 字段指向该图片
3. 如果某个提示词没有预览图，将显示默认占位符

## 命名规范

建议使用小写字母和连字符命名，例如：
- `anime-style.jpg`
- `photorealistic.jpg`
- `golden-hour.jpg`

## 支持的格式

- JPG/JPEG
- PNG
- WebP
