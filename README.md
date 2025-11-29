# Z-Image Web

基于阿里巴巴通义实验室 Z-Image 模型的 Web 界面，提供高效的图像生成和编辑功能。

## 功能特点

- 🎨 **文生图**: 支持中英双语提示词，8步快速生成高质量图像
- ✏️ **图编辑**: 基于自然语言的精确图像编辑（即将推出）
- 🖼️ **作品集**: 管理和浏览生成的作品（即将推出）
- ⚡ **高性能**: 基于 Z-Image-Turbo，亚秒级生成速度
- 🌐 **响应式设计**: 适配桌面和移动设备

## 模型版本

- **Z-Image-Turbo**: 8步快速生成，适合实时应用
- **Z-Image-Base**: 基础开发版本，支持50-100步高质量生成  
- **Z-Image-Edit**: 图像编辑专用版本，支持精确的指令编辑

## 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI组件**: shadcn/ui + Radix UI
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **状态管理**: React Hooks

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## API 配置

应用需要连接到 Z-Image 后端 API 服务。可以通过环境变量配置：

```bash
# 创建 .env.local 文件
VITE_API_BASE_URL=http://localhost:8000
```

## 项目结构

```
src/
├── components/          # UI 组件
│   └── ui/             # shadcn/ui 组件
├── hooks/              # 自定义 Hooks
│   └── useZImage.ts   # Z-Image API Hook
├── services/           # API 服务
│   └── api.ts         # Z-Image API 客户端
├── App.tsx            # 主应用组件
├── App.css            # 自定义样式
└── main.tsx           # 应用入口
```

## 使用说明

1. **选择模型**: 根据需求选择合适的模型版本
2. **输入提示词**: 描述您想要生成的图像内容
3. **调整参数**: 设置图像尺寸、采样步数等参数
4. **开始生成**: 点击生成按钮等待结果
5. **下载保存**: 生成的图像可直接下载保存

## 注意事项

- 当前版本为演示版本，API 调用为模拟实现
- 实际使用需要部署 Z-Image 后端服务
- 建议使用 Chrome 或 Firefox 浏览器获得最佳体验

## 相关链接

- [Z-Image GitHub](https://github.com/Tongyi-MAI/Z-Image)
- [Z-Image 官网](https://tongyi-mai.github.io/Z-Image-homepage/)
- [ModelScope](https://www.modelscope.cn/models/Tongyi-MAI/Z-Image-Turbo)

## 许可证

本项目采用 MIT 许可证。