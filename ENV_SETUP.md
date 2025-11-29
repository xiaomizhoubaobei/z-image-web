# 环境变量设置说明

本项目直接使用系统环境变量。

## 必需的环境变量

```bash
# API Base URL for Z-Image backend service
export VITE_API_BASE_URL=http://localhost:8000

# Feature flags
export VITE_ENABLE_EDIT_FEATURE=true
export VITE_ENABLE_GALLERY_FEATURE=true
```

## 可选的环境变量

```bash
# Analytics (optional)
export VITE_ANALYTICS_ID=your-analytics-id
```

## 不同环境的设置

### 开发环境
```bash
export VITE_API_BASE_URL=http://localhost:8000
```

### 生产环境
```bash
export VITE_API_BASE_URL=https://your-production-api.com
```



## 运行项目

1. 设置环境变量：
```bash
export VITE_API_BASE_URL=http://localhost:8000
export VITE_ENABLE_EDIT_FEATURE=true
export VITE_ENABLE_GALLERY_FEATURE=true
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

构建时确保设置了生产环境的环境变量：

```bash
export VITE_API_BASE_URL=https://your-production-api.com
yarn build
```

## 注意事项

- 环境变量必须以 `VITE_` 开头才能在客户端代码中访问
- 修改环境变量后需要重启开发服务器
- 在CI/CD环境中，请确保正确设置环境变量