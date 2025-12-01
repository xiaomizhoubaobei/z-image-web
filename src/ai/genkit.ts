/**
 * @fileoverview 初始化并配置 Genkit AI 实例。
 * 该文件使用必要的插件和模型配置来设置核心 Genkit 对象。
 */
import { googleAI } from '@genkit-ai/google-genai';
import dotenv from 'dotenv';
import { genkit } from 'genkit';

// 从 .env 文件加载环境变量到 process.env
dotenv.config();

/**
 * 核心 Genkit AI 实例。
 * 这个 'ai' 对象在整个应用程序中用于定义和运行 AI 流程、提示和工具。
 * 它配置了 Google AI 插件以访问 Google 的 AI 模型。
 *
 * @property {Array} plugins - 要使用的 Genkit 插件数组。这里是 googleAI 插件。
 * @property {string} model - 用于生成任务的默认 AI 模型。
 */
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
