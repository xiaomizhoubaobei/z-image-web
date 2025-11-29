# Z-Image Web

基于阿里巴巴通义实验室 Z-Image 模型的 Web 界面，提供高效的图像生成和编辑功能。

## 功能特点

- 🎨 **文生图**: 支持中英双语提示词
- ⚡ **高性能**: 基于 Z-Image-Turbo，8步快速生成，亚秒级生成速度
- 🌐 **响应式设计**: 适配桌面和移动设备

## 模型支持

当前版本仅支持 **Z-Image-Turbo** 模型，这是阿里巴巴通义实验室目前公开发布的唯一版本。

- **Z-Image-Turbo**: 8步快速生成版本，适合实时应用
  - 推荐设置: guidance_scale = 0
  - 最大采样步数: 8步
  - 支持分辨率: 1024x1024

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks

## 快速开始

### 安装依赖

```bash
yarn install
```

### 启动开发服务器

```bash
yarn dev
```

应用将在 http://localhost:5173 启动。

### 构建生产版本

```bash
yanr build
```

### 预览生产版本

```bash
yarn preview
```

## API 配置

应用使用 ModelScope API 服务进行图像生成。可以通过环境变量配置：

```bash
# 创建 .env.local 文件
VITE_MODELSCOPE_API_BASE_URL=https://api-inference.modelscope.cn/
VITE_MODELSCOPE_API_KEY=your_modelscope_api_key
```

## 项目结构

```
src/
├── components/          # UI 组件
│   └── ui/             # shadcn/ui 组件
├── hooks/              # 自定义 Hooks
├── services/           # API 服务
│   └── api.ts         # ModelScope API 客户端
├── App.tsx            # 主应用组件
├── App.css            # 自定义样式
└── main.tsx           # 应用入口
```

## 使用说明

1. **输入提示词**: 描述您想要生成的图像内容
2. **调整参数**: 设置图像尺寸、采样步数等参数
   - 注意：Z-Image-Turbo 推荐使用 guidance_scale = 0
   - 采样步数建议设置为 4-8 步
3. **开始生成**: 点击生成按钮等待结果
4. **下载保存**: 生成的图像可直接下载保存

## 注意事项

- 建议使用 Chrome 或 Firefox 浏览器获得最佳体验

## 相关链接

- [Z-Image GitHub](https://github.com/Tongyi-MAI/Z-Image)
- [Z-Image 官网](https://tongyi-mai.github.io/Z-Image-homepage/)
- [ModelScope](https://www.modelscope.cn/models/Tongyi-MAI/Z-Image-Turbo)

## 许可证

本项目采用 MIT 许可证。