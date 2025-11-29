/*
 * Copyright 2025 祁筱欣
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import { ModelScopeAPIClient } from '../services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Wand2, Image as ImageIcon } from 'lucide-react';

interface ImageGenerationProps {
  onImageGenerated?: (imageUrl: string) => void;
  apiKey?: string;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ onImageGenerated, apiKey }) => {
  const [prompt, setPrompt] = useState<string>('A golden cat');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [width, setWidth] = useState<number>(1024);
  const [height, setHeight] = useState<number>(1024);
  const [steps, setSteps] = useState<number>(8);
  const [guidanceScale, setGuidanceScale] = useState<number>(7.5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    if (!apiKey) {
      setError('API密钥未配置，请在设置页面中配置');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // 创建ModelScope API客户端实例
      const apiClient = new ModelScopeAPIClient(undefined, apiKey);
      
      // 使用ModelScope API生成图像
      const result = await apiClient.generateImage({
        model: 'Tongyi-MAI/Z-Image-Turbo',
        prompt: prompt,
        negative_prompt: negativePrompt || undefined,
        width: width,
        height: height,
        num_inference_steps: steps,
        guidance_scale: guidanceScale,
      });

      if (result.output_images && result.output_images.length > 0) {
        const imageUrl = result.output_images[0];
        setGeneratedImage(imageUrl);
        if (onImageGenerated) {
          onImageGenerated(imageUrl);
        }
      } else {
        setError('未生成图像');
      }
    } catch (err) {
      console.error('图像生成失败:', err);
      setError(err instanceof Error ? err.message : '图像生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* 左侧控制面板 */}
        <Card>
          <CardHeader>
            <CardTitle>ModelScope 生成设置</CardTitle>
            <CardDescription>使用 ModelScope 云服务生成图像</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <Label>宽度: {width}px</Label>
                <Slider
                  value={[width]}
                  onValueChange={(value) => setWidth(value[0])}
                  max={1024}
                  min={512}
                  step={64}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>高度: {height}px</Label>
                <Slider
                  value={[height]}
                  onValueChange={(value) => setHeight(value[0])}
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
                <Label>采样步数: {steps}</Label>
                <Slider
                  value={[steps]}
                  onValueChange={(value) => setSteps(value[0])}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>引导强度: {guidanceScale}</Label>
                <Slider
                  value={[guidanceScale]}
                  onValueChange={(value) => setGuidanceScale(value[0])}
                  max={20}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* 生成按钮 */}
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full h-12 text-base"
            >
              {isGenerating ? (
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
            {!generatedImage ? (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>还没有生成的图像</p>
                  <p className="text-sm">输入提示词并点击生成开始创作</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 显示生成的图像 */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = `modelscope-image-${Date.now()}.jpg`;
                          link.click();
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageGeneration;
