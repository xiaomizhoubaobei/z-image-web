import {Sparkles} from 'lucide-react';
import type {FC} from 'react';

const Header: FC = () => {
    return (
        <header className="flex items-center justify-center py-8 md:py-12 lg:py-16">
            <div className="flex items-center gap-3 text-center">
                <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-primary"/>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground">
                    Z-Image AI 图像生成
                </h1>
            </div>
        </header>
    );
};

export default Header;
