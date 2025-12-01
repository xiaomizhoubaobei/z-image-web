# Z-Image AI 图像生成

这是一个使用 Next.js 和 Genkit 构建的 AI 图像生成应用。用户可以输入文本提示词，并调整各种参数来创建独特的 AI 生成图像。

## ✨ 功能

- **文本生成图片**: 将您的创意文本转化为视觉图像。
- **参数调整**: 可自定义图片风格、分辨率、步数和引导系数。
- **图片下载**:轻松下载您创建的图片。
- **响应式设计**: 在桌面、平板和移动设备上均有良好体验。
- **实时进度**: 在图片生成过程中显示进度条。

## 🚀 技术栈

- [Next.js](https://nextjs.org/) – React 框架
- [React](https://reactjs.org/) – UI 库
- [TypeScript](https://www.typescriptlang.org/) – 类型化 JavaScript
- [Genkit](https://firebase.google.com/docs/genkit) – AI 集成框架
- [ModelScope](https://modelscope.cn/) - AI 模型服务
- [ShadCN UI](https://ui.shadcn.com/) – UI 组件库
- [Tailwind CSS](https://tailwindcss.com/) – CSS 框架

## 📦 安装与启动

请按照以下步骤在本地运行此项目。

### 1. 克隆仓库

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. 安装依赖

```bash
npm install
```

### 3. 设置环境变量

您需要一个 ModelScope API 密钥才能使用图像生成模型。

1.  访问 [ModelScope 控制台](https://modelscope.cn/my/myaccesstoken) 获取您的 API 密钥。
2.  在项目根目录下创建一个名为 `.env.local` 的文件。
3.  将您的 API 密钥添加到文件中：

    ```env
    MODELSCOPE_API_KEY="在这里粘贴您的API密钥"
    ```

    > **注意**: 如果您还想使用其他依赖 Google API 的 Genkit 功能，您也需要设置 `GEMINI_API_KEY`。

### 4. 运行开发服务器

现在，您可以启动 Next.js 开发服务器：

```bash
npm run dev
```

在浏览器中打开 [http://localhost:9002](http://localhost:9002) 即可看到正在运行的应用。

## 🎨 使用方法

1.  在“提示词”文本框中输入您想要生成的图片描述。
2.  根据需要选择“风格”。
3.  （可选）填写“反向提示词”来排除不希望出现的元素。
4.  调整“步数”和“引导系数”滑块以控制生成质量和与提示词的符合度。
5.  点击“生成图片”按钮。
6.  等待进度条完成，您生成的图片将显示在右侧的输出框中。
7.  点击“下载图片”按钮保存您的作品。
