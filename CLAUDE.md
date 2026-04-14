# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个 Vue 3 + Vite 的 PC 端项目 (永达自定义页面 PC 端)，使用 pnpm 作为包管理器。

## Common Commands

```bash
# 开发环境
pnpm dev

# 构建测试环境
pnpm build:test

# 构建生产环境
pnpm build

# 预览构建结果
pnpm preview

# 发布 (自动更新版本号并打包)
pnpm release
```

## Architecture

- **Vue 3** + **Vite 6** + **TypeScript**
- **UI 框架**: Ant Design Vue 4
- **状态管理**: Pinia (带持久化插件 pinia-plugin-persistedstate)
- **CSS 方案**: UnoCSS (使用 presetWind3, 支持暗色模式)
- **HTTP**: axios + @vyron/use-axios
- **日期处理**: dayjs
- **工具库**: lodash-es, @vueuse/core

### 目录结构

```
src/
├── assets/         # 静态资源 (样式、SVG)
├── components/    # 公共组件
├── config/        # 配置 (环境变量、常量)
├── hooks/         # 组合式函数
├── pages/         # 页面入口 (多页面支持)
├── plugins/       # 插件 (dayjs 等)
├── services/      # API 服务 (axios、jsSdk)
├── stores/        # Pinia 状态管理
└── utils/         # 工具函数
```

### 环境配置

- 测试环境 (`APP_ENV=test`): 代理到 `https://api-sandbox.xiaoshouyi.com`
- 生产环境 (`APP_ENV=production`): 使用 `/service/api/proxy?request=`

### 构建配置

- 入口文件: `index.html`
- 开发服务器端口: 4433
- 支持多环境代理配置 (在 [src/config/env/index.js](src/config/env/index.js) 中配置)
- 构建后自动生成打包分析报告 (`stats.html`)

### 样式系统

UnoCSS shortcuts 定义了常用的布局类名:
- `flex-center`, `flex-col`, `flex-col-center` 等
- `absolute-lt`, `absolute-center`, `fixed-center` 等
- `ellipsis-text`, `nowrap-hidden` 等
