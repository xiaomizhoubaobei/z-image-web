'use server';
/**
 * @fileoverview 使用 ModelScope Tongyi-MAI 模型生成图像的流程。
 * 该文件定义了请求图像生成任务并轮询其结果的全过程。
 *
 * - generateImage - 一个导出的函数，用于处理图像生成过程。
 * - GenerateImageInput - `generateImage` 函数的输入类型。
 * - GenerateImageOutput - `generateImage` 函数的返回类型。
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

/**
 * 定义图像生成流程的输入 Zod schema。
 * 这些是从客户端发送到 Genkit 流程的参数。
 */
const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('用于生成图像的文本提示。'),
  style: z.string().describe('要生成的图像风格。'),
  negative_prompt: z.string().optional().describe('要从图像中排除的元素。'),
  steps: z.array(z.number()).describe('生成步数。'),
  guidance_scale: z.array(z.number()).describe('生成的引导系数。'),
});
/**
 * 图像生成流程的输入类型。
 * @see GenerateImageInputSchema
 */
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

/**
 * 定义图像生成流程的输出 Zod schema。
 * 这是成功完成后返回给客户端的数据结构。
 */
const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('生成图像的 URL。'),
});
/**
 * 图像生成流程的输出类型。
 * @see GenerateImageOutputSchema
 */
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

/**
 * 触发图像生成流程的公共函数。这是客户端的入口点。
 * @param {GenerateImageInput} input - 来自客户端的图像生成输入参数。
 * @returns {Promise<GenerateImageOutput>} 一个解析为生成图像 URL 的 Promise。
 */
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

/**
 * 用于将执行延迟指定时间的辅助函数。
 * 用于轮询任务状态。
 * @param {number} ms - 要休眠的毫秒数。
 * @returns {Promise<void>} 一个在指定延迟后解析的 Promise。
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 生成图像的主要 Genkit 流程。它会通过外部 API 启动一个任务，
 * 然后轮询结果。
 */
const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.MODELSCOPE_API_KEY;
    if (!apiKey) {
      throw new Error('MODELSCOPE_API_KEY 环境变量未设置。');
    }
    const base_url = 'https://api-inference.modelscope.cn/';

    const commonHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // 1. 启动任务
    const postResponse = await fetch(
      `${base_url}v1/images/generations`,
      {
        method: 'POST',
        headers: {
          ...commonHeaders,
          "X-ModelScope-Async-Mode": "true"
        },
        body: JSON.stringify({
          model: "Tongyi-MAI/Z-Image-Turbo",
          prompt: input.prompt,
          n: 1,
          style: input.style,
          negative_prompt: input.negative_prompt,
          steps: input.steps[0],
          guidance_scale: input.guidance_scale[0],
        })
      }
    );

    const postResult = await postResponse.json() as any;

    if (!postResponse.ok) {
        const errorMessage = postResult?.message || `启动图像生成任务失败: ${postResponse.statusText}`;
        throw new Error(errorMessage);
    }

    const taskId = postResult?.output?.task_id || postResult?.task_id;

    if (!taskId) {
        throw new Error(`从启动响应中获取 task_id 失败: ${JSON.stringify(postResult)}`);
    }

    // 2. 轮询结果
    while (true) {
      await sleep(3000); // 轮询前等待3秒

      const getResponse = await fetch(
        `${base_url}v1/tasks/${taskId}`,
        {
          headers: {
            ...commonHeaders, 
            "X-ModelScope-Task-Type": "image_generation"
          },
        }
      );

      const data = await getResponse.json() as any;

      if (!getResponse.ok) {
        const errorMessage = data?.message || `轮询任务状态失败: ${getResponse.statusText}`;
        throw new Error(errorMessage);
      }
      
      if (data.task_status === 'SUCCEED') {
        const imageUrl = data.output?.images?.[0]?.url || data.output_images?.[0];
        if (imageUrl) {
            return {
                imageUrl: imageUrl,
            };
        } else {
            throw new Error('任务成功，但未返回有效的图像 URL。');
        }
      } else if (data.task_status === 'FAILED') {
        throw new Error(`图像生成任务失败: ${data.message || '未知错误'}`);
      }
      // 如果 task_status 是 'RUNNING' 或其他状态，循环将继续。
    }
  }
);
