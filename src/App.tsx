import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Download, Wand2, Image as ImageIcon, Settings, AlertCircle } from 'lucide-react'
import { useZImage } from './hooks/useZImage'
import './App.css'

function App() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('低分辨率, 水印, 文字裁切')
  const model = 'turbo' as const // 固定使用Z-Image-Turbo模型
  const [width, setWidth] = useState([1024])
  const [height, setHeight] = useState([1024])
  const [steps, setSteps] = useState([8])
  const [guidanceScale, setGuidanceScale] = useState([0])

  const { generateImage, isLoading, lastResponse, error, clearError } = useZImage({
    onSuccess: (response) => {
      console.log('生成成功:', response)
    },
    onError: (errorMessage) => {
      console.error('生成失败:', errorMessage)
    },
  })

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    clearError()
    
    const request = {
      prompt,
      negative_prompt: negativePrompt,
      model,
      width: width[0],
      height: height[0],
      num_inference_steps: steps[0],
      guidance_scale: guidanceScale[0],
    }

    await generateImage(request)
  }

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

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              文生图
            </TabsTrigger>
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              图编辑
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              作品集
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* 左侧控制面板 */}
              <Card>
                <CardHeader>
                  <CardTitle>生成设置</CardTitle>
                  <CardDescription>配置您的图像生成参数</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 模型信息 */}
                  <div className="space-y-2">
                    <Label>当前模型</Label>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="font-medium">Z-Image-Turbo</div>
                      <div className="text-sm text-muted-foreground">8步快速生成版本，适合实时应用</div>
                    </div>
                  </div>

                  {/* 提示词 */}
                  <div className="space-y-2">
                    <Label htmlFor="prompt">正向提示词</Label>
                    <Input
                      id="prompt"
                      placeholder="描述您想要生成的图像..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  {/* 负向提示词 */}
                  <div className="space-y-2">
                    <Label htmlFor="negative">负向提示词</Label>
                    <Input
                      id="negative"
                      placeholder="不希望出现的元素..."
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                    />
                  </div>

                  {/* 尺寸设置 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>宽度: {width[0]}px</Label>
                      <Slider
                        value={width}
                        onValueChange={setWidth}
                        max={1024}
                        min={512}
                        step={64}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>高度: {height[0]}px</Label>
                      <Slider
                        value={height}
                        onValueChange={setHeight}
                        max={1024}
                        min={512}
                        step={64}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* 高级参数 */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>采样步数: {steps[0]}</Label>
                      <Slider
                        value={steps}
                        onValueChange={setSteps}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>引导强度: {guidanceScale[0]}</Label>
                      <Slider
                        value={guidanceScale}
                        onValueChange={setGuidanceScale}
                        max={20}
                        min={0}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* 错误提示 */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* 生成按钮 */}
                  <Button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="w-full h-12 text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        开始生成
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* 右侧结果展示 */}
              <Card>
                <CardHeader>
                  <CardTitle>生成结果</CardTitle>
                  <CardDescription>查看生成的图像</CardDescription>
                </CardHeader>
                <CardContent>
                  {!lastResponse || lastResponse.images.length === 0 ? (
                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>还没有生成的图像</p>
                        <p className="text-sm">输入提示词并点击生成开始创作</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* 显示生成信息 */}
                      {lastResponse && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-700">
                              模型: {lastResponse.model_used.toUpperCase()}
                            </span>
                            <span className="text-blue-700">
                              耗时: {lastResponse.generation_time.toFixed(2)}s
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* 显示生成的图像 */}
                      <div className="grid grid-cols-1 gap-4">
                        {lastResponse.images.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={imageUrl.startsWith('data:') ? imageUrl : `data:image/png;base64,${imageUrl}`}
                                alt={`Generated ${index + 1}`}
                                className="w-full h-full object-cover"
                                onLoad={(e) => {
                                  // 如果是base64图片，确保正确显示
                                  const img = e.currentTarget;
                                  if (img.src.startsWith('data:image/png;base64,data:')) {
                                    img.src = img.src.replace('data:image/png;base64:data:', 'data:image/png;base64,');
                                  }
                                }}
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = imageUrl.startsWith('data:') ? imageUrl : `data:image/png;base64,${imageUrl}`;
                                  link.download = `z-image-${Date.now()}.png`;
                                  link.click();
                                }}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                下载
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="edit">
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
          </TabsContent>

          <TabsContent value="gallery">
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
          </TabsContent>
        </Tabs>

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
