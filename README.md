# 数字园丁日志

> 温暖教育风 · 浅色调的个人技术教学网站。一位信息技术老师的知识苗圃与教育随笔。
> 纯静态 HTML + CSS + JavaScript，可直接在浏览器打开，或部署到 GitHub Pages。

## 站点结构

```
EOF/
├── index.html      今日新叶（首页）：站点介绍 + 最近更新
├── knowledge.html   知识苗圃（学习宝库）：教学资源卡片，按课程分类筛选
├── thoughts.html    树下拾遗（教育随笔）：时间轴文章列表
├── toolbox.html     我的工具箱（在线工具）：抽签点名 / 数字换算 / 代码整理台
├── about.html       关于园丁（关于）：个人简介 + 园丁名片 + 联系方式
├── 404.html         自定义 404 页面
├── css/style.css    全局温暖浅色主题
└── js/
    ├── data.js      共享数据（recentUpdates / resources / thoughts / tools）
    └── main.js      导航页脚注入、动态渲染、筛选、工具提示
```

## 本地预览

直接用浏览器打开 `index.html` 即可。若需本地服务器（推荐，避免个别浏览器对本地 JS 的限制）：

```bash
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 部署到 GitHub Pages

1. 将本文件夹 push 到 GitHub 仓库；
2. 仓库 Settings → Pages → Source 选择 `main` 分支根目录；
3. 等待片刻即可通过 `https://<用户名>.github.io/<仓库名>/` 访问。

## 自定义

- **署名 / 邮箱**：修改 `js/data.js` 顶部 `SITE.authorName` 与 `SITE.email`（全文仅此一处）。
- **内容**：教学资源、随笔、动态均集中在 `js/data.js` 中。
- **配色**：`css/style.css` 顶部 `:root` 变量（暖纸背景 / 叶绿强调）。

© 2026 数字园丁日志
