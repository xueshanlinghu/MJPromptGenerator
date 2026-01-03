# MJ Prompt Generator

一个美观、现代化的 Midjourney 提示词生成器 Web 应用。

## 功能特性

- ✨ **美观的界面** - 基于 Naive UI 的现代化设计，支持亮/暗双主题
- 🎯 **提示词管理** - 配置化的提示词库，支持分类展示和快速选择
- 🖼️ **预览功能** - 鼠标悬停显示提示词效果预览图
- ⚙️ **参数配置** - 完整的 Midjourney 参数支持（--v, --ar, --s 等）
- 📋 **一键复制** - 快速复制生成的提示词
- 🤖 **AI 接口预留** - 支持中文翻译和提示词优化（待开发）

## 技术栈

- **Vue 3** - 使用 Composition API 和 `<script setup>` 语法
- **TypeScript** - 类型安全的开发体验
- **Vite** - 极速的开发和构建工具
- **Naive UI** - 精美的 Vue 3 组件库
- **Pinia** - Vue 3 官方状态管理
- **YAML** - 配置文件格式

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
MJPromptGenerator/
├── public/
│   └── preview-images/        # 提示词预览图
├── src/
│   ├── components/            # Vue 组件
│   │   ├── Layout/           # 布局组件
│   │   ├── PromptBuilder/    # 提示词构建组件
│   │   ├── ParameterPanel/   # 参数面板组件
│   │   ├── ResultPanel/      # 结果展示组件
│   │   └── AIPanel/          # AI 功能组件（预留）
│   ├── config/               # YAML 配置文件
│   ├── stores/               # Pinia 状态管理
│   ├── types/                # TypeScript 类型定义
│   ├── utils/                # 工具函数
│   └── assets/               # 静态资源
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 使用说明

1. **选择提示词** - 从左侧分类中点击需要的提示词标签
2. **鼠标悬停** - 将鼠标悬停在提示词上查看效果预览图
3. **调整参数** - 在中间参数面板中设置版本、宽高比、风格化等参数
4. **复制结果** - 点击右侧的"复制"按钮，将生成的提示词复制到剪贴板
5. **主题切换** - 点击右上角的主题切换按钮，在亮色和暗色主题间切换

## 配置说明

### 添加提示词

编辑 `src/config/prompts.yaml` 文件，按照以下格式添加：

```yaml
categories:
  - id: styles
    name: 风格
    prompts:
      - id: anime
        text: anime style
        description: 动漫风格
        preview: styles/anime.jpg  # 可选
```

### 添加预览图

将预览图放入 `public/preview-images/` 相应的子目录中，并在配置文件中引用。

## 开发计划

- [x] 项目初始化和基础框架
- [ ] 提示词系统
- [ ] 预览图功能
- [ ] 参数配置面板
- [ ] 结果生成与复制
- [ ] 主题系统
- [ ] AI 功能接口（预留）

## License

MIT

---

Made with ❤️ for Midjourney enthusiasts
