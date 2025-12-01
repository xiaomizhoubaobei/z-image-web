import Header from '@/components/header';
import ImageGenerationInterface from '@/components/image-generation-interface';

/**
 * 应用程序的主页。
 * 该组件作为入口点，并渲染主要的用户界面，
 * 包括页眉和图像生成界面。
 * @returns {JSX.Element} 渲染后的主页。
 */
export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <ImageGenerationInterface />
      </div>
    </main>
  );
}

    