import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

/**
 * 应用程序的元数据。
 * 此信息用于 SEO 以及浏览器显示标题和网站图标。
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export const metadata: Metadata = {
  title: 'Z-Image AI 图像生成',
  description: '使用强大的人工智能模型生成令人惊叹的图像。',
  icons: {
    icon: 'https://cnb.mizhoubaobei.top/z-image-web-logo.jpg',
  },
};

/**
 * 整个应用程序的根布局组件。
 * 该组件包裹所有页面并提供一致的结构，
 * 包括全局样式、字体和 UI 提供程序（如 Toaster）。
 * @param {{ children: React.ReactNode }} props - 组件的 props。
 * @param {React.ReactNode} props.children - 将在布局中渲染的子组件。
 * @returns {JSX.Element} 应用程序的根 HTML 结构。
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
