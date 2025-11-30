'use server';
/**
 * @fileoverview A flow for generating images using the ModelScope Tongyi-MAI model.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import fetch from 'node-fetch';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
  style: z.string().describe('The style of the image to generate.'),
  negative_prompt: z.string().optional().describe('Elements to exclude from the image.'),
  steps: z.array(z.number()).describe('Number of generation steps.'),
  guidance_scale: z.array(z.number()).describe('Guidance scale for the generation.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

/**
 * 生成图像的主函数
 * 
 * @param input - 包含图像生成参数的输入对象
 * @returns 生成的图像URL
 * 
 * @example
 * ```ts
 * const result = await generateImage({
 *   prompt: "A beautiful sunset",
 *   style: "photo",
 *   steps: [30],
 *   guidance_scale: [7.5]
 * });
 * console.log(result.imageUrl);
 * ```
 */
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

// Helper function to delay execution
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 定义图像生成流程
 * 
 * 此函数使用 ModelScope API 异步生成图像。它首先启动一个图像生成任务，
 * 然后轮询服务器直到任务完成，最后返回生成的图像 URL。
 * 
 * @param input - 包含图像生成参数的输入对象
 * @returns 生成的图像URL
 * 
 * @example
 * ```ts
 * const result = await generateImageFlow({
 *   prompt: "A beautiful sunset",
 *   style: "photo",
 *   steps: [30],
 *   guidance_scale: [7.5]
 * });
 * console.log(result.imageUrl);
 * ```
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
      throw new Error('MODELSCOPE_API_KEY environment variable not set.');
    }
    const base_url = 'https://api-inference.modelscope.cn/';

    const commonHeaders = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    // 1. Initiate the task
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
          size: "1024*1024",
          style: input.style,
          negative_prompt: input.negative_prompt,
          steps: input.steps[0],
          guidance_scale: input.guidance_scale[0],
        })
      }
    );

    if (!postResponse.ok) {
        const errorBody = await postResponse.text();
        throw new Error(`Failed to initiate image generation task: ${postResponse.statusText} - ${errorBody}`);
    }

    const postResult = await postResponse.json() as any;
    const taskId = postResult?.task_id;

    if (!taskId) {
        throw new Error('Failed to get task_id from initiation response.');
    }

    // 2. Poll for the result
    while (true) {
      await sleep(3000); // Wait for 3 seconds before polling

      const getResponse = await fetch(
        `${base_url}v1/tasks/${taskId}`,
        {
          headers: {
            ...commonHeaders, 
            "X-ModelScope-Task-Type": "image_generation"
          },
        }
      );

      if (!getResponse.ok) {
        const errorBody = await getResponse.text();
        // Don't throw immediately, maybe the task is just not ready
        console.warn(`Polling failed: ${getResponse.statusText} - ${errorBody}`);
        continue; // Continue polling
      }
      
      const data = await getResponse.json() as any;

      if (data.task_status === 'SUCCEED') {
        const imageUrl = data.output?.images?.[0]?.url || data.output_images?.[0];
        if (imageUrl) {
            return {
                imageUrl: imageUrl,
            };
        } else {
            throw new Error('Task succeeded but no valid image URL was returned.');
        }
      } else if (data.task_status === 'FAILED') {
        throw new Error('Image generation task failed.');
      }
      // If task_status is 'RUNNING' or something else, the loop will continue.
    }
  }
);
