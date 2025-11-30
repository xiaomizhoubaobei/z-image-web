/**
 * @fileoverview Genkit 开发环境入口点。
 * 该文件用于在开发模式下启动和注册所有 AI 流程。
 * 通过导入流程文件，它们会自动在 Genkit 运行时中注册。
 */

// 导入 generate-image-flow 以便在 Genkit 启动时注册它。
// 这种导入仅用于其副作用（在 Genkit 中注册流程）。
import './flows/generate-image-flow'