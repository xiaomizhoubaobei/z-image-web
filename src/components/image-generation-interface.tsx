"use client";

import { useEffect, useState, type FC } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Download, ImageIcon, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { generateImage, type GenerateImageInput } from "@/ai/flows/generate-image-flow";


/**
 * 图像生成表单的 Zod schema。
 * 定义表单数据的结构和验证规则。
 */
const formSchema = z.object({
  prompt: z.string().min(10, {
    message: "提示词必须至少包含10个字符。",
  }),
  style: z.string(),
  negative_prompt: z.string().optional(),
  steps: z.array(z.number()).default([30]),
  guidance_scale: z.array(z.number()).default([7.5]),
});

/**
 * 用于生成图像的主界面。
 * 该组件包括用户输入的表单和显示生成图像的区域。
 * @returns {JSX.Element} 渲染后的图像生成界面。
 */
const ImageGenerationInterface: FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      style: "photo",
      negative_prompt: "",
      steps: [30],
      guidance_scale: [7.5],
    },
  });

  /**
   * 一个在图像生成期间模拟进度条的 effect。
   * 当 `isLoading` 为 true 时启动，为 false 时停止。
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isLoading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (interval) clearInterval(interval);
            return 90;
          }
          return prev + 5;
        });
      }, 500);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);


  /**
   * 处理图像生成的表单提交。
   * @param {z.infer<typeof formSchema>} values - 验证后的表单值。
   */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setImageUrl(null);
    setProgress(5);

    try {
      const result = await generateImage(values as GenerateImageInput);

      if (result.imageUrl) {
        setImageUrl(result.imageUrl);
        setProgress(100);
        toast({
          title: "图片生成成功！",
          description: "您的创意构想已变为现实。",
        });
      } else {
        throw new Error("API 未返回图像。");
      }
    } catch (error) {
      console.error("图像生成失败:", error);
      toast({
        variant: "destructive",
        title: "图片生成失败",
        description:
          error instanceof Error ? error.message : "抱歉，我们无法生成您的图片。请稍后再试。",
      });
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理生成图像的下载。
   * 创建一个临时链接并触发点击以下载图像。
   */
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `z-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const watchedSteps = form.watch("steps");
  const watchedGuidance = form.watch("guidance_scale");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <Card className="shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">创建您的图片</CardTitle>
          <CardDescription>
            描述您的构想并设置参数以生成独特的 AI 图片。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>提示词</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="例如：宇航员在火星上骑马，电影级光效"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>风格</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="选择一个风格" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="photo">写实照片</SelectItem>
                          <SelectItem value="illustration">插画</SelectItem>
                          <SelectItem value="anime">动漫</SelectItem>
                          <SelectItem value="fantasy">奇幻艺术</SelectItem>
                          <SelectItem value="painting">绘画</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="negative_prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>反向提示词 (可选)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="例如：模糊, 水印, 文字, 丑陋"
                        className="resize-none"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      描述您不希望在图片中出现的内容。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>步数</FormLabel>
                        <span className="text-sm font-medium text-muted-foreground">{watchedSteps[0]}</span>
                    </div>
                    <FormControl>
                      <Slider
                        onValueChange={field.onChange}
                        value={field.value}
                        max={50}
                        min={10}
                        step={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guidance_scale"
                render={({ field }) => (
                  <FormItem>
                     <div className="flex justify-between items-center">
                        <FormLabel>引导系数</FormLabel>
                        <span className="text-sm font-medium text-muted-foreground">{watchedGuidance[0]}</span>
                    </div>
                    <FormControl>
                      <Slider
                        onValueChange={field.onChange}
                        value={field.value}
                        max={20}
                        min={1}
                        step={0.5}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-lg py-6 rounded-lg font-bold">
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                生成图片
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">输出</CardTitle>
          <CardDescription>您生成的图片将显示在下方。</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center p-2 sm:p-4">
          <div className="aspect-square w-full max-w-full rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center overflow-hidden">
            {isLoading && progress > 0 ? (
                <div className="w-full max-w-sm flex flex-col items-center gap-4 px-4">
                  <p className="text-muted-foreground text-center">正在生成您的图片，请稍候...</p>
                  <Progress value={progress} className="w-full" />
                </div>
            ) : imageUrl ? (
              <Image
                src={imageUrl}
                alt="生成的图片"
                width={1024}
                height={1024}
                className="h-full w-full object-contain"
                data-ai-hint="generated art"
              />
            ) : (
              <div className="text-center text-muted-foreground p-8 flex flex-col items-center">
                <ImageIcon className="mx-auto h-16 w-16 mb-4 text-muted-foreground/60" />
                <p className="font-medium">您的杰作正在等待</p>
                <p className="text-sm">填写表单以开始</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleDownload} disabled={!imageUrl || isLoading} className="w-full text-lg py-6 rounded-lg font-bold">
            <Download className="mr-2 h-5 w-5" />
            下载图片
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageGenerationInterface;

    