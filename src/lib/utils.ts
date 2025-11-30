import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并和处理CSS类名
 * 
 * 这个工具函数结合了clsx和tailwind-merge的功能，
 * 用于条件性地合并和处理CSS类名，同时解决Tailwind CSS类的冲突。
 * 
 * @param inputs - 任意数量的CSS类名输入，可以是字符串、对象或数组
 * @returns 处理后的CSS类名字符串
 * 
 * @example
 * ```ts
 * cn("text-red-500", { "font-bold": true }, ["bg-blue-200", false && "hidden"])
 * // 返回: "text-red-500 font-bold bg-blue-200"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
