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

'use server';
/**
 * @fileoverview A flow for generating images using a GenAI model.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageInputSchema = z.object({
    prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
    imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
    return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
    },
    async (input) => {
        const {media} = await ai.generate({
            model: 'googleai/gemini-2.5-flash-image-preview',
            prompt: input.prompt,
            config: {
                responseModalities: ['TEXT', 'IMAGE'],
            },
        });

        const imageUrl = media?.url;

        if (imageUrl) {
            return {
                imageUrl: imageUrl,
            };
        } else {
            throw new Error('Task succeeded but no valid image URL was returned.');
        }
    }
);
