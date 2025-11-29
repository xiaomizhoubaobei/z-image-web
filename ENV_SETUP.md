# 环境变量设置说明

本项目直接使用系统环境变量。

## 必需的环境变量

```bash
# Feature flags
export VITE_ENABLE_EDIT_FEATURE=true
export VITE_ENABLE_GALLERY_FEATURE=true
```

## ModelScope API 相关环境变量

```bash
# ModelScope API Base URL and Key
export VITE_MODELSCOPE_API_BASE_URL=https://api-inference.modelscope.cn/
export VITE_MODELSCOPE_API_KEY=your_modelscope_api_key
export VITE_MODELSCOPE_POLL_INTERVAL=5000
export VITE_MODELSCOPE_MAX_ATTEMPTS=24
```

## 可选的环境变量

```bash
# Analytics (optional)
export VITE_ANALYTICS_ID=your-analytics-id
```



## 运行项目

1. 设置环境变量：
```bash
export VITE_ENABLE_EDIT_FEATURE=true
export VITE_ENABLE_GALLERY_FEATURE=true
export VITE_MODELSCOPE_API_BASE_URL=https://api-inference.modelscope.cn/
export VITE_MODELSCOPE_API_KEY=your_modelscope_api_key
```

2. 安装依赖：
```bash
yarn install
```

3. 启动开发服务器：
```bash
yarn dev
```

## 构建项目

构建时确保设置了 ModelScope API 密钥：

```bash
export VITE_MODELSCOPE_API_KEY=your_modelscope_api_key
yarn build
```

## 注意事项

- 环境变量必须以 `VITE_` 开头才能在客户端代码中访问
- 修改环境变量后需要重启开发服务器
- 在CI/CD环境中，请确保正确设置环境变量