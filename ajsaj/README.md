# 博客与作品展示平台

一个使用 React、TypeScript、Supabase 和 Netlify 构建的现代化个人博客和作品展示平台。

## 🚀 项目特色

- **现代化技术栈**: React 18 + TypeScript + Tailwind CSS + Vite
- **后端服务**: Supabase (数据库 + 认证 + 实时功能)
- **部署平台**: Netlify (自动化部署 + HTTPS)
- **响应式设计**: 完美适配桌面端和移动端
- **SEO 优化**: 服务端渲染和元标签优化

## 📋 功能特性

### 核心功能
- ✅ 首页展示最新博客和精选作品
- ✅ 博客文章列表和分类筛选
- ✅ 文章详情页面和评论系统
- ✅ 作品集展示页面
- ✅ 深色模式切换

### 数据库设计
- **用户表** (`users`): 存储用户信息
- **博客文章表** (`blog_posts`): 存储博客文章内容
- **评论表** (`comments`): 存储用户评论
- **作品集表** (`portfolio_items`): 存储项目作品信息

## 🛠️ 技术栈

### 前端
- **React 18**: 用户界面构建
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **React Router**: 路由管理
- **React Markdown**: Markdown 渲染
- **date-fns**: 日期处理

### 后端
- **Supabase**: 数据库和 API 服务
- **PostgreSQL**: 数据存储
- **实时订阅**: 实时数据更新

### 部署
- **Netlify**: 前端托管和部署
- **Vercel**: 可选部署平台

## 📦 安装和运行

### 1. 克隆项目
```bash
git clone <repository-url>
cd blog-portfolio-platform
```

### 2. 安装依赖
```bash
npm install
```

### 3. 设置环境变量
复制 `.env.example` 为 `.env` 并填入 Supabase 配置：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 设置 Supabase 数据库
1. 在 [Supabase](https://supabase.com) 创建新项目
2. 在 SQL 编辑器中运行 `supabase/schema.sql` 中的 SQL 语句
3. 复制项目 URL 和 Anonymous Key 到 `.env` 文件

### 5. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看网站

## 🚀 部署到 Netlify

### 1. 准备部署
确保项目已推送到 GitHub 仓库

### 2. Netlify 配置
1. 登录 [Netlify](https://netlify.com)
2. 点击 "New site from Git"
3. 选择 GitHub 仓库
4. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

### 3. 环境变量设置
在 Netlify 的 Site settings > Environment variables 中添加：
- `VITE_SUPABASE_URL`: 你的 Supabase URL
- `VITE_SUPABASE_ANON_KEY`: 你的 Supabase Anonymous Key

### 4. 部署
推送代码到 GitHub 即可触发自动部署

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── BlogCard.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── PortfolioCard.tsx
├── contexts/           # React Context
│   ├── SupabaseContext.tsx
│   └── ThemeContext.tsx
├── pages/             # 页面组件
│   ├── BlogDetail.tsx
│   ├── BlogList.tsx
│   ├── Home.tsx
│   └── Portfolio.tsx
├── types/             # TypeScript 类型定义
│   └── index.ts
├── App.tsx            # 主应用组件
├── main.tsx           # 应用入口
└── index.css          # 全局样式
```

## 🎨 自定义配置

### 主题颜色
编辑 `tailwind.config.js` 中的 `theme.extend.colors` 来自定义品牌颜色。

### 数据库表
可以根据需求修改 `supabase/schema.sql` 中的表结构。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Supabase](https://supabase.com/) - 后端即服务平台
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Netlify](https://www.netlify.com/) - 部署平台