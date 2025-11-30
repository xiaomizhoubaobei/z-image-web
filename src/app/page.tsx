import Header from '@/components/header';
import ImageGenerationInterface from '@/components/image-generation-interface';

/**
 * 主页组件
 * 
 * 这是应用程序的主页，包含一个头部组件和图像生成接口组件。
 * 
 * @returns 包含Header和ImageGenerationInterface的JSX元素
 */
export default function Home() {
    return (
        <main className="min-h-screen bg-background text-foreground font-body">
            <Header />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <ImageGenerationInterface />
            </div>
        </main>
    );
}