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

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface APIKeyManagerProps {
  apiKey: string;
  onSave: (apiKey: string) => void;
}

const APIKeyManager: React.FC<APIKeyManagerProps> = ({ apiKey, onSave }) => {
  const [currentApiKey, setCurrentApiKey] = useState<string>(apiKey);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    setCurrentApiKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    onSave(currentApiKey);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleClear = () => {
    setCurrentApiKey('');
    onSave('');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>API 密钥管理</CardTitle>
          <CardDescription>管理您的 ModelScope API 密钥</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">ModelScope API 密钥</Label>
              <Input
                id="api-key"
                type="password"
                value={currentApiKey}
                onChange={(e) => setCurrentApiKey(e.target.value)}
                placeholder="输入您的 ModelScope API 密钥"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                您可以从{' '}
                <a 
                  href="https://www.modelscope.cn/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  ModelScope 官网
                </a>{' '}
                获取 API 密钥
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSave} className="w-auto">
                保存密钥
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClear}
                disabled={!currentApiKey}
              >
                清除密钥
              </Button>
            </div>

            {showSuccess && (
              <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                API 密钥已保存！
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">使用说明</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>API 密钥用于访问 ModelScope 图像生成功能</li>
              <li>密钥将被安全地保存在您的浏览器本地存储中</li>
              <li>不会将密钥发送到任何第三方服务器（除了 ModelScope API）</li>
              <li>如需更换密钥，请在此页面更新后重新保存</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeyManager;
