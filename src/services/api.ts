// API 服务配置 - 使用Vite环境变量
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Z-Image API 接口类型定义
export interface GenerateRequest {
  prompt: string;
  negative_prompt?: string;
  model: 'turbo';
  width: number;
  height: number;
  num_inference_steps: number;
  guidance_scale: number;
  seed?: number;
}

export interface GenerateResponse {
  success: boolean;
  images: string[];
  generation_time: number;
  model_used: string;
  error?: string;
}

export interface EditRequest extends GenerateRequest {
  input_image: string; // base64 encoded image
  strength?: number;
}

// API 客户端类
class ZImageAPIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * 生成图像
   */
  async generateImage(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('生成图像失败:', error);
      return {
        success: false,
        images: [],
        generation_time: 0,
        model_used: request.model,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 编辑图像
   */
  async editImage(request: EditRequest): Promise<GenerateResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('编辑图像失败:', error);
      return {
        success: false,
        images: [],
        generation_time: 0,
        model_used: request.model,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 获取模型信息
   */
  async getModelInfo(): Promise<{
    turbo: { description: string; max_steps: number; recommended_settings: any };
  }> {
    try {
      const response = await fetch(`${this.baseURL}/api/models/info`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('获取模型信息失败:', error);
      // 返回默认信息
      return {
        turbo: {
          description: 'Z-Image-Turbo: 8步快速生成版本，适合实时应用',
          max_steps: 8,
          recommended_settings: {
            guidance_scale: 0,
            resolution: [1024, 1024],
          },
        },
      };
    }
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ status: string; models_available: string[] }> {
    try {
      const response = await fetch(`${this.base_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('健康检查失败:', error);
      return {
        status: 'unavailable',
        models_available: [],
      };
    }
  }
}

// 导出单例实例
export const zImageAPI = new ZImageAPIClient();

// 导出类型
export type { GenerateRequest, GenerateResponse, EditRequest };