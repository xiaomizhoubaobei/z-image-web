import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 一个用于有条件地合并 class 名称的工具函数。
 * 它使用 `clsx` 处理条件性 class，并使用 `tailwind-merge` 来
 * 解决冲突的 Tailwind CSS class。
 *
 * @param {...ClassValue[]} inputs - class 名称或条件性 class 对象的列表。
 * @returns {string} 合并和优化后的 class 名称字符串。
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
