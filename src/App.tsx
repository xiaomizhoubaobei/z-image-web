import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Image as ImageIcon, Settings, Globe, Cog } from 'lucide-react'
import ImageGeneration from './components/ImageGeneration'
import APIKeyManager from './components/APIKeyManager'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    // 从localStorage中获取已保存的API密钥
    return localStorage.getItem('modelscope_api_key') || '';
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Z-Image Web
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            阿里巴巴通义实验室开源的高效图像生成模型 • 6B参数 • 8步生成 • 中英双语渲染
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">Turbo</Badge>
            <Badge variant="secondary">Base</Badge>
            <Badge variant="secondary">Edit</Badge>
          </div>
        </header>

        <div className="flex gap-6 mt-8">
            {/* 竖向导航菜单 */}
            <div className="w-48 flex-shrink-0">
              <div className="bg-white p-2 rounded-lg border">
                <div className="flex flex-col space-y-1" id="vertical-nav">
                  <button
                    className={`vertical-tab flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      document.location.hash === '#modelscope' || !document.location.hash 
                        ? "bg-blue-100 text-blue-700" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      // 更新URL hash
                      window.location.hash = 'modelscope';
                      // 隐藏所有内容，显示modelscope内容
                      document.querySelectorAll('.tab-content').forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                      });
                      const contentEl = document.getElementById('modelscope-content');
                      if (contentEl) (contentEl as HTMLElement).style.display = 'block';
                      
                      // 更新激活的标签样式
                      document.querySelectorAll('#vertical-nav button').forEach(btn => {
                        btn.classList.remove('bg-blue-100', 'text-blue-700');
                        btn.classList.add('hover:bg-gray-100');
                      });
                      event?.currentTarget.classList.remove('hover:bg-gray-100');
                      event?.currentTarget.classList.add('bg-blue-100', 'text-blue-700');
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    <span>ModelScope</span>
                  </button>
                  <button
                    className={`vertical-tab flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      document.location.hash === '#edit' 
                        ? "bg-blue-100 text-blue-700" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      // 更新URL hash
                      window.location.hash = 'edit';
                      // 隐藏所有内容，显示edit内容
                      document.querySelectorAll('.tab-content').forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                      });
                      const contentEl = document.getElementById('edit-content');
                      if (contentEl) (contentEl as HTMLElement).style.display = 'block';
                      
                      // 更新激活的标签样式
                      document.querySelectorAll('#vertical-nav button').forEach(btn => {
                        btn.classList.remove('bg-blue-100', 'text-blue-700');
                        btn.classList.add('hover:bg-gray-100');
                      });
                      event?.currentTarget.classList.remove('hover:bg-gray-100');
                      event?.currentTarget.classList.add('bg-blue-100', 'text-blue-700');
                    }}
                  >
                    <Settings className="w-4 h-4" />
                    <span>图编辑</span>
                  </button>
                  <button
                    className={`vertical-tab flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      document.location.hash === '#gallery' 
                        ? "bg-blue-100 text-blue-700" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      // 更新URL hash
                      window.location.hash = 'gallery';
                      // 隐藏所有内容，显示gallery内容
                      document.querySelectorAll('.tab-content').forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                      });
                      const contentEl = document.getElementById('gallery-content');
                      if (contentEl) (contentEl as HTMLElement).style.display = 'block';
                      
                      // 更新激活的标签样式
                      document.querySelectorAll('#vertical-nav button').forEach(btn => {
                        btn.classList.remove('bg-blue-100', 'text-blue-700');
                        btn.classList.add('hover:bg-gray-100');
                      });
                      event?.currentTarget.classList.remove('hover:bg-gray-100');
                      event?.currentTarget.classList.add('bg-blue-100', 'text-blue-700');
                    }}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>作品集</span>
                  </button>
                  <button
                    className={`vertical-tab flex items-center gap-2 w-full p-3 text-left rounded-md ${
                      document.location.hash === '#settings' 
                        ? "bg-blue-100 text-blue-700" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      // 更新URL hash
                      window.location.hash = 'settings';
                      // 隐藏所有内容，显示settings内容
                      document.querySelectorAll('.tab-content').forEach(el => {
                        (el as HTMLElement).style.display = 'none';
                      });
                      const contentEl = document.getElementById('settings-content');
                      if (contentEl) (contentEl as HTMLElement).style.display = 'block';
                      
                      // 更新激活的标签样式
                      document.querySelectorAll('#vertical-nav button').forEach(btn => {
                        btn.classList.remove('bg-blue-100', 'text-blue-700');
                        btn.classList.add('hover:bg-gray-100');
                      });
                      event?.currentTarget.classList.remove('hover:bg-gray-100');
                      event?.currentTarget.classList.add('bg-blue-100', 'text-blue-700');
                    }}
                  >
                    <Cog className="w-4 h-4" />
                    <span>设置</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 主内容区域 */}
            <div className="flex-1">
              <div id="modelscope-content" className="tab-content" style={{display: window.location.hash === '#modelscope' || !window.location.hash ? 'block' : 'none'}}>
                <Card>
                  <CardHeader>
                    <CardTitle>ModelScope 图像生成</CardTitle>
                    <CardDescription>使用 ModelScope 云服务生成图像</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ImageGeneration apiKey={apiKey} />
                  </CardContent>
                </Card>
              </div>

              <div id="settings-content" className="tab-content" style={{display: window.location.hash === '#settings' ? 'block' : 'none'}}>
                <Card>
                  <CardHeader>
                    <CardTitle>API 密钥管理</CardTitle>
                    <CardDescription>管理您的 ModelScope API 密钥</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <APIKeyManager 
                      apiKey={apiKey} 
                      onSave={(newApiKey) => {
                        setApiKey(newApiKey);
                        if (newApiKey) {
                          localStorage.setItem('modelscope_api_key', newApiKey);
                        } else {
                          localStorage.removeItem('modelscope_api_key');
                        }
                      }} 
                    />
                  </CardContent>
                </Card>
              </div>

              <div id="edit-content" className="tab-content" style={{display: window.location.hash === '#edit' ? 'block' : 'none'}}>
                <Card>
                  <CardHeader>
                    <CardTitle>图像编辑</CardTitle>
                    <CardDescription>上传图像并进行编辑</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>图像编辑功能即将推出</p>
                      <p className="text-sm">支持基于自然语言的精确图像编辑</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div id="gallery-content" className="tab-content" style={{display: window.location.hash === '#gallery' ? 'block' : 'none'}}>
                <Card>
                  <CardHeader>
                    <CardTitle>作品集</CardTitle>
                    <CardDescription>浏览生成的优秀作品</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>作品集功能即将推出</p>
                      <p className="text-sm">展示和管理您的创作成果</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="mb-2">Powered by Z-Image - 阿里巴巴通义实验室</p>
            <div className="flex justify-center gap-4 text-sm">
              <a href="https://github.com/Tongyi-MAI/Z-Image" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                GitHub
              </a>
              <a href="https://www.modelscope.cn/models/Tongyi-MAI/Z-Image-Turbo" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                ModelScope
              </a>
              <a href="https://tongyi-mai.github.io/Z-Image-homepage/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                官网
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
