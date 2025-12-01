import Header from '@/components/header';
import ImageGenerationInterface from '@/components/image-generation-interface';

/**
 * 应用程序的主页。
 * 该组件作为入口点，并渲染主要的用户界面，
 * 包括页眉和图像生成界面。
 * @returns 渲染后的主页。
 */
export default function Home(): JSX.Element {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow text-foreground">
                <Header />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <ImageGenerationInterface />
                </div>
            </main>
            <footer className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 py-4 text-muted-foreground text-sm">
                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    渝ICP备2022010031号-8
                </a>
                <a href="https://660086.fwh.is/id.php?id=20250001" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    个ICP备20250001号
                </a>
                <a href="https://icp.xnet.ren/id.php?keyword=20250009" target="_blank" rel="noopener noreferrer">
                    <img src="https://shields.wudu.ltd/gen.php?part1=信网联盟&style=coral&part2=20250009" alt="信网联盟" />
                </a>
                <div className="github-badge">
                    <span className="badge-subject">雾备</span>
                    <a style={{color:"#fff"}} href="https://icp.wudu.ltd/id.php?keyword=20020412" rel="external" target="_blank">
                        <span className="badge-value bg-cai">20020412号</span>
                    </a>
                </div>
            </footer>
        </div>
    );
}
