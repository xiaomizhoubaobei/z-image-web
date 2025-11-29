// API 服务配置 - 使用代理路径以避免CORS错误
const MODELSCOPE_API_BASE_URL = '/api/modelscope';

// ModelScope API 相关接口类型定义
export interface ModelScopeGenerateRequest {
  model: string;
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  num_inference_steps?: number;
  guidance_scale?: number;
  seed?: number;
}

export interface ModelScopeTaskResponse {
  task_id: string;
  task_status: string;
  request_id: string;
}

export interface ModelScopeResultResponse {
  task_id: string;
  task_status: 'SUCCEED' | 'FAILED' | 'PENDING' | 'RUNNING';
  output_images?: string[];
  error_msg?: string;
}

// ModelScope API 客户端类
class ModelScopeAPIClient {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string = MODELSCOPE_API_BASE_URL, apiKey: string = '') {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  /**
   * 生成图像 - 异步任务模式
   */
  async generateImageAsync(request: ModelScopeGenerateRequest): Promise<ModelScopeTaskResponse> {
    if (!this.apiKey) {
      throw new Error('ModelScope API Key 未配置，请在初始化 ModelScopeAPIClient 时提供 API Key');
    }

    try {
      const commonHeaders = {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${this.baseURL}v1/images/generations`, {
        method: 'POST',
        headers: {
          ...commonHeaders,
          "X-ModelScope-Async-Mode": "true"
        },
        body: JSON.stringify({
          model: request.model,
          prompt: request.prompt,
          negative_prompt: request.negative_prompt,
          width: request.width,
          height: request.height,
          num_inference_steps: request.num_inference_steps,
          guidance_scale: request.guidance_scale,
          seed: request.seed
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
      }

      return await response.json();
    } catch (error) {
      console.error('生成图像任务提交失败:', error);
      throw error;
    }
  }

  /**
   * 查询图像生成结果
   */
  async getTaskResult(taskId: string): Promise<ModelScopeResultResponse> {
    if (!this.apiKey) {
      throw new Error('ModelScope API Key 未配置，请在初始化 ModelScopeAPIClient 时提供 API Key');
    }

    try {
      const commonHeaders = {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${this.baseURL}v1/tasks/${taskId}`, {
        method: 'GET',
        headers: {
          ...commonHeaders,
          "X-ModelScope-Task-Type": "image_generation",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${await response.text()}`);
      }

      return await response.json();
    } catch (error) {
      console.error('查询任务结果失败:', error);
      throw error;
    }
  }

  /**
   * 等待图像生成完成并返回结果
   */
  async waitForImageGeneration(taskId: string, pollInterval: number = 5000, maxAttempts: number = 24): Promise<ModelScopeResultResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await this.getTaskResult(taskId);
      
      if (result.task_status === 'SUCCEED') {
        return result;
      } else if (result.task_status === 'FAILED') {
        throw new Error(`图像生成失败: ${result.error_msg || '未知错误'}`);
      }
      
      // 等待指定时间后重试
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error(`图像生成超时: 任务ID ${taskId}`);
  }

  /**
   * 完整的图像生成流程（提交任务并等待完成）
   */
  async generateImage(request: ModelScopeGenerateRequest): Promise<ModelScopeResultResponse> {
    try {
      // 提交图像生成任务
      const taskResponse = await this.generateImageAsync(request);
      const taskId = taskResponse.task_id;

      // 等待任务完成
      const result = await this.waitForImageGeneration(taskId);
      return result;
    } catch (error) {
      console.error('图像生成失败:', error);
      throw error;
    }
  }
}

// 导出类和单例实例
export { ModelScopeAPIClient };
export const modelScopeAPI = new ModelScopeAPIClient();