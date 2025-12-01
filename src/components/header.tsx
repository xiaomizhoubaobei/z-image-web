import type { FC } from 'react';

/**
 * 应用程序的页眉组件。
 * 显示主标题和副标题。
 * @returns 渲染后的页眉部分。
 */
const Header: FC = () => {
    return (
        <header className="py-8 md:py-12 lg:py-16 text-center">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                Z-Image AI
            </h1>
            <p className="mt-2 text-muted-foreground">
                将您的创意文本转化为视觉图像
            </p>
        </header>
    );
};

export default Header;
