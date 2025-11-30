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

"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {Download, ImageIcon, Loader2, Sparkles} from "lucide-react";

import {Button} from "@/components/ui/button";
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
import {Slider} from "@/components/ui/slider";
import {Textarea} from "@/components/ui/textarea";
import {useToast} from "@/hooks/use-toast";
import {Progress} from "@/components/ui/progress";
import {generateImage, type GenerateImageInput} from "@/ai/flows/generate-image-flow";


const formSchema = z.object({
    prompt: z.string().min(10, {
        message: "提示词必须至少包含10个字符。",
    }),
    style: z.string(),
    resolution: z.string(),
    negative_prompt: z.string().optional(),
    steps: z.array(z.number()).default([30]),
    guidance_scale: z.array(z.number()).default([7.5]),
});

const ImageGenerationInterface = () => {
    const {toast} = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            style: "photorealistic",
            resolution: "1024x1024",
            negative_prompt: "",
            steps: [30],
            guidance_scale: [7.5],
        },
    });

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


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        setImageUrl(null);
        setProgress(5);

        try {
            const input: GenerateImageInput = {
                prompt: `${values.prompt}, style: ${values.style}, resolution: ${values.resolution}, negative prompt: ${values.negative_prompt}, steps: ${values.steps[0]}, guidance: ${values.guidance_scale[0]}`,
            };
            const result = await generateImage(input);

            if (result.imageUrl) {
                setImageUrl(result.imageUrl);
                setProgress(100);
                toast({
                    title: "图片生成成功！",
                    description: "您的创意构想已变为现实。",
                });
            } else {
                throw new Error("API did not return an image.");
            }
        } catch (error) {
            console.error("Image generation failed:", error);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
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
                                render={({field}) => (
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
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="style"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>风格</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="选择一个风格"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="photorealistic">写实照片</SelectItem>
                                                    <SelectItem value="illustration">插画</SelectItem>
                                                    <SelectItem value="anime">动漫</SelectItem>
                                                    <SelectItem value="fantasy-art">奇幻艺术</SelectItem>
                                                    <SelectItem value="painting">绘画</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="resolution"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>分辨率</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="选择一个分辨率"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1024x1024">1024x1024 (方形)</SelectItem>
                                                    <SelectItem value="1792x1024">1792x1024 (横向)</SelectItem>
                                                    <SelectItem value="1024x1792">1024x1792 (纵向)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="negative_prompt"
                                render={({field}) => (
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
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="steps"
                                render={({field}) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>步数</FormLabel>
                                            <span
                                                className="text-sm font-medium text-muted-foreground">{watchedSteps[0]}</span>
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
                                render={({field}) => (
                                    <FormItem>
                                        <div className="flex justify-between items-center">
                                            <FormLabel>引导系数</FormLabel>
                                            <span
                                                className="text-sm font-medium text-muted-foreground">{watchedGuidance[0]}</span>
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

                            <Button type="submit" disabled={isLoading}
                                    className="w-full bg-accent hover:bg-accent/90 text-lg py-6 rounded-lg font-bold">
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                ) : (
                                    <Sparkles className="mr-2 h-5 w-5"/>
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
                    <div
                        className="aspect-square w-full max-w-full rounded-lg border-2 border-dashed bg-muted/50 flex items-center justify-center overflow-hidden">
                        {isLoading && progress > 0 ? (
                            <div className="w-full max-w-sm flex flex-col items-center gap-4 px-4">
                                <p className="text-muted-foreground text-center">正在生成您的图片，请稍候...</p>
                                <Progress value={progress} className="w-full"/>
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
                                <ImageIcon className="mx-auto h-16 w-16 mb-4 text-muted-foreground/60"/>
                                <p className="font-medium">您的杰作正在等待</p>
                                <p className="text-sm">填写表单以开始</p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleDownload} disabled={!imageUrl || isLoading}
                            className="w-full text-lg py-6 rounded-lg font-bold">
                        <Download className="mr-2 h-5 w-5"/>
                        下载图片
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default ImageGenerationInterface;
