import data from './placeholder-images.json';

/**
 * 表示图像占位符对象的结构。
 */
export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

/**
 * 从 JSON 文件加载的占位符图像对象数组。
 * 用于在整个应用程序中提供默认或备用图像。
 * @type {ImagePlaceholder[]}
 */
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;

    