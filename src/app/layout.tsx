import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
    title: 'Z-Image AI 图像生成',
    description: '使用强大的人工智能模型生成令人惊叹的图像。',
    icons: {
        icon: 'https://cnb.mizhoubaobei.top/z-image-web-logo.jpg',
    },
};

/**
 * 根布局组件
 * 
 * 此组件定义了整个应用程序的根HTML结构，包括语言设置、字体预连接和全局样式。
 * 
 * @param children - 作为子组件渲染的React节点
 * @returns 包含完整HTML结构的JSX元素
 */
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
                rel="stylesheet"/>
        </head>
        <body className="font-body antialiased">
        {children}
        <Toaster/>
        </body>
        </html>
    );
}
