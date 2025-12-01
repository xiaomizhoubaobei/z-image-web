'use server';
/**
 * @fileoverview 使用 ModelScope Tongyi-MAI 模型生成图像的流程（已废弃）。
 * 该文件的核心逻辑已迁移到 `src/app/api/generate-image/route.ts`。
 * 这个文件现在只保留了类型定义，并作为一个简化流程的示例。
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateImageInputSchema = z.object({
    prompt: z.string().describe('用于生成图像的文本提示。'),
    style: z.string().describe('要生成的图像风格。'),
    negative_prompt: z.string().optional().describe('要从图像中排除的元素。'),
    steps: z.array(z.number()).describe('生成步数。'),
    guidance_scale: z.array(z.number()).describe('生成的引导系数。'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
    imageUrl: z.string().describe('生成图像的 URL。'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

/**
 * [已废弃] 这个函数现在只是一个包装器，实际逻辑已移至 API 路由。
 * @param {GenerateImageInput} input - 图像生成输入参数。
 * @returns {Promise<GenerateImageOutput>} 一个解析为生成图像 URL 的 Promise。
 */
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || '图像生成失败');
    }

    return result;
}

/**
 * [已废弃] Genkit 流程定义。核心逻辑已迁移。
 */
const generateImageFlow = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
    },
    async (input) => {
        // 实际的图像生成逻辑现在位于 /api/generate-image 路由中。
        // 这个流程可以根据需要进一步扩展，例如记录日志、与 Genkit 的其他功能集成等。
        console.log('Genkit Flow: 接收到图像生成请求', input.prompt);

        // 理论上，这里可以调用 API 路由，但为了简化，我们将调用逻辑放在客户端
        // 和 /api/generate-image 路由中。
        // 返回一个占位符或模拟响应，因为此流程不再是主要执行路径。
        return {
            imageUrl: 'placeholder_url_from_deprecated_flow'
        };
    }
);
