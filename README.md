# MJ Prompt Generator

一个美观、现代化的 Midjourney 提示词生成器 Web 应用，专为摄影爱好者和设计师打造。

## ✨ 功能特性

- 🎨 **美观的界面** - 基于 Naive UI 的现代化设计，支持亮/暗双主题
- 📸 **专业摄影提示词库** - 200+ 精选摄影提示词，覆盖快门、光圈、镜头、光线等专业领域
- 🏗️ **二级分类结构** - 清晰的一级/二级分类体系，快速定位所需提示词
- 🎯 **智能分组** - 按艺术家、相机参数、光线等位置标签自动分组
- 🌐 **中英双语** - 所有提示词提供中英文对照
- ⚙️ **完整参数支持** - 全面支持 Midjourney 参数（版本、宽高比、风格化等）
- 📝 **主体环境输入** - 支持快速输入主体和环境描述，内置示例模板
- 🖱️ **拖动滚动** - 分类标签支持鼠标拖动水平滚动，小屏幕友好
- ✂️ **手动编辑** - 最终提示词支持手动编辑和调整
- 📋 **一键复制** - 快速复制生成的完整提示词

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

## 部署到 GitHub Pages

本项目已配置 GitHub Actions 自动部署，推送到 `master` 分支时会自动构建并部署到 GitHub Pages。

### 配置步骤

1. **启用 GitHub Pages**
   - 进入仓库的 `Settings` → `Pages`
   - 在 `Build and deployment` 下的 `Source` 选择 `GitHub Actions`

2. **推送代码**
   ```bash
   git push origin master
   ```

3. **查看部署状态**
   - 进入仓库的 `Actions` 标签页
   - 查看部署工作流的运行状态
   - 部署成功后，访问 `https://<username>.github.io/MJPromptGenerator/`

### 自定义域名（可选）

如果使用自定义域名，需要修改 `vite.config.ts` 中的 `base` 配置：

```typescript
base: process.env.NODE_ENV === 'production' ? '/' : '/',
```

### 手动部署

也可以手动触发部署：
- 进入仓库的 `Actions` 标签页
- 选择 `Deploy to GitHub Pages` 工作流
- 点击 `Run workflow` 按钮

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

1. **输入主体环境** - 在"主体与环境"标签页中输入拍摄对象和场景描述（可使用示例模板）
2. **选择摄影参数** - 从快门速度、景深光圈、镜头位置等分类中选择摄影技术参数
3. **添加光线效果** - 在光线控制分类中选择光线类型、位置、色彩等
4. **选择艺术风格** - （可选）在艺术家分类中选择摄影师风格（建议单选）
5. **调整参数** - 在参数面板中设置版本、宽高比、风格化等 Midjourney 参数
6. **预览结果** - 右侧实时显示已选提示词和最终生成的提示词
7. **编辑调整** - 可手动编辑最终提示词进行微调
8. **一键复制** - 点击"复制"按钮，将提示词复制到剪贴板

### 界面操作技巧

- **拖动滚动**：分类标签过多时，可按住鼠标左键拖动标签栏水平滚动
- **主题切换**：点击右上角的主题按钮，在亮色和暗色主题间切换
- **提示词排序**：在已选提示词列表中可拖拽调整顺序

## 提示词分类

### 📸 快门速度
- **高速摄影**：高速摄影、慢动作、子弹时间、慢镜头
- **延时摄影**：延时摄影、长曝光
- **定时摄影**：连续摄影、频闪效应
- **光涂鸦**：光绘、光涂鸦、光绘画

### 🔍 景深和光圈
景深、散景、梦幻散景、移轴摄影等

### 📷 镜头的长短和位置
- **镜头位置**：天文摄影、NASA拍摄、微距摄影、显微摄影等
- **景别**：极远景、远景、中景、特写、极特写
- **景别-角度**：顶视图、高角度、低角度、仰视
- **景别-人物**：全身照、半身照、肖像照、特写等
- **景别-特殊**：广角、超广角、鱼眼、俯瞰、第一人称等
- **设备胶片**：尼康、佳能、索尼、徕卡等品牌及各类胶片

### 💡 光线控制
- **光线-影调**：伦勃朗光、蝴蝶光、环形光等
- **光线-位置**：顶光、背光、轮廓光、侧光等
- **光线-光度**：硬光、柔光、高调光、低调光等
- **光线-通用描述**：影视级灯光、自然光、阳光等
- **光线-色彩**：17种颜色光（红光、蓝光、暖光、冷光等）
- **光的形容词**：23种光效描述（闪烁的、明亮的、辉煌的等）

### 🎨 艺术家/摄影师（建议单选）
- **超现实**：Sandy Skoglund、David LaChapelle
- **复古超现实**：Geof Kern、Angus McBean等
- **极简**：Chema Madoz、Annie Leibovitz等
- **风景**：Marcin Sobas、Sebastião Salgado等
- **夜空**：Michael Shainblum、Mikko Lagerstedt
- **其他特色**：张克纯、任航、Weegee等中外摄影师

## 配置说明

### 提示词配置

编辑 `public/config/prompts.yaml` 文件，支持一级和二级分类结构：

```yaml
categories:
  - id: photography
    name: 摄影技术
    icon: camera-outline
    special:
      positionTag: camera  # 位置标签，用于分组
    subCategories:
      - id: aperture
        name: 光圈
        prompts:
          - id: bokeh
            prompt_zh: 散景
            prompt_en: bokeh
```

### 参数配置

编辑 `public/config/parameters.yaml` 文件添加 Midjourney 参数：

```yaml
parameters:
  - id: aspectRatio
    name: 宽高比
    type: select
    param: --ar
    default: "16:9"
    options:
      - value: "16:9"
        label: "横屏 (16:9)"
```

## 📊 项目特色

- **专业摄影导向**：200+ 精心整理的摄影专业术语，覆盖快门、光圈、镜头、光线等核心领域
- **智能分组**：提示词按位置标签（artist/camera/lighting）自动分组，生成结构化提示词
- **中英双语**：所有提示词均提供中英文对照，便于理解和使用
- **实时预览**：右侧面板实时显示选中的提示词和最终生成结果
- **灵活编辑**：支持手动编辑最终提示词，满足个性化需求
- **响应式设计**：支持桌面端和平板设备，提供良好的使用体验

## 开发计划

- [x] 项目初始化和基础框架
- [x] 提示词系统（支持一级/二级分类）
- [x] 参数配置面板
- [x] 结果生成与复制
- [x] 主题系统（亮/暗双主题）
- [x] 摄影专业提示词库（200+）
- [x] 主体环境输入功能
- [x] 最终提示词手动编辑
- [x] 分类标签拖动滚动
- [ ] 移动端适配优化
- [ ] 提示词搜索功能
- [ ] 收藏夹/历史记录
- [ ] 导出/导入配置
- [ ] 更多艺术家和风格

## 🙏 致谢

特别感谢 **野菩萨老师及其团队** 在摄影提示词整理和专业指导方面提供的宝贵支持，使本项目能够提供专业、全面的摄影提示词库。

## License

MIT

---

Made with ❤️ for Midjourney enthusiasts
