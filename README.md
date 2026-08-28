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
├── admin.html       管理后台：在网页里新增 / 修改 / 删除内容（localStorage 本机保存）
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

## 内容管理（后台 admin.html）

`admin.html` 是一个纯前端管理台，可在网页里**新增 / 修改 / 删除**今日新叶、知识苗圃、树下拾遗、工具箱，以及站点信息（标题、署名、邮箱等）。

> 说明：GitHub Pages 是纯静态托管，没有服务器数据库。管理台默认把改动存在**本机浏览器（localStorage）**，因此只在这台电脑的浏览器里生效。要把改动同步到线上站点（让所有人看到），用下面的"导出 → 推送"流程。

### 在网页里改完，如何同步到 GitHub Pages

1. 在 `admin.html` 里改好内容；
2. 点底部 **「💾 存到本机」**（下次打开还在）；
3. 点 **「📋 复制 data.js」**，把生成的代码发给帮你维护的人（或点「⬇ 下载 data.js」覆盖本地 `js/data.js`）；
4. 由维护者 `git commit && git push`，GitHub Pages 自动重建，全员可见。

> 想做到"网页里改完即直接写回 GitHub"，可改用 GitHub API 方案（管理台填 Token 写回仓库）。当前按用户选择采用 localStorage 方案。

© 2026 数字园丁日志
