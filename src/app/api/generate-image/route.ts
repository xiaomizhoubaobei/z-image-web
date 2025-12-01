import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { prompt, style, negative_prompt, steps, guidance_scale } = await req.json();

    const apiKey = process.env.MODELSCOPE_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "MODELSCOPE_API_KEY 环境变量未设置。" }, { status: 500 });
    }

    const baseUrl = "https://api-inference.modelscope.cn";

    try {
        // 1. 启动任务
        const postUrl = `${baseUrl}/v1/images/generations`;
        const postResponse = await fetch(postUrl, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "X-ModelScope-Async-Mode": "true"
            },
            body: JSON.stringify({
                model: "Tongyi-MAI/Z-Image-Turbo",
                prompt,
                n: 1,
                style,
                negative_prompt,
                steps: steps[0],
                guidance_scale: guidance_scale[0],
            })
        });

        const postResult = await postResponse.json();

        if (!postResponse.ok) {
            const errorMessage = postResult?.message || `启动图像生成任务失败: ${postResponse.statusText}`;
            return NextResponse.json({ error: errorMessage }, { status: postResponse.status });
        }

        const taskId = postResult?.output?.task_id || postResult?.task_id;
        if (!taskId) {
            return NextResponse.json({ error: `从启动响应中获取 task_id 失败: ${JSON.stringify(postResult)}` }, { status: 500 });
        }

        // 2. 轮询结果
        let attempts = 0;
        const maxAttempts = 20; // ~60 seconds timeout
        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒

            const getUrl = `${baseUrl}/v1/tasks/${taskId}`;
            const getResponse = await fetch(getUrl, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "X-ModelScope-Task-Type": "image_generation"
                },
            });

            const data = await getResponse.json();

            if (!getResponse.ok) {
                const errorMessage = data?.message || `轮询任务状态失败: ${getResponse.statusText}`;
                return NextResponse.json({ error: errorMessage }, { status: getResponse.status });
            }

            if (data.task_status === 'SUCCEED') {
                const imageUrl = data.output?.images?.[0]?.url || data.output_images?.[0];
                if (imageUrl) {
                    return NextResponse.json({ imageUrl });
                } else {
                    return NextResponse.json({ error: '任务成功，但未返回有效的图像 URL。' }, { status: 500 });
                }
            } else if (data.task_status === 'FAILED') {
                return NextResponse.json({ error: `图像生成任务失败: ${data.message || '未知错误'}` }, { status: 500 });
            }

            attempts++;
        }

        return NextResponse.json({ error: '图像生成超时。' }, { status: 504 });

    } catch (error) {
        console.error('API 路由错误:', error);
        const errorMessage = error instanceof Error ? error.message : '服务器内部错误';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
