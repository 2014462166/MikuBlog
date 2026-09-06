# Miku小屋 · MyBlog

一个 **初音未来配色（青 × 荧光粉）** 的二次元玻璃拟态个人博客。

> Next.js 15 (App Router) + React 19 + Tailwind CSS 4，纯静态导出，可部署到 GitHub Pages / Vercel / 任意云存储。

## ✨ 核心功能

- 🎵 **沉浸式全局音乐播放器**：切页不断歌、旋转唱片、逐行歌词、播放列表、循环/单曲循环、音量记忆
- 🌞/🌙 **丝滑昼夜切换**：跟随系统或手动切换，青粉极光背景淡入淡出
- 📂 **文章 / 项目 / 杂谈** 分类独立页，文章支持标签 + 搜索筛选
- 🧊 **极致毛玻璃**：三级玻璃强度、初音青粉光斑、深色星空、代码高亮、GFM 表格/任务清单

## 🎨 换上你自己的初音素材（只需放文件）

| 素材 | 放哪里 | 在哪里生效 |
| --- | --- | --- |
| 头像 | `public/avatar.png` | 首页 Hero（未上传前显示 **TODO** 占位） |
| 背景壁纸 | `public/backgrounds/*.jpg` 等 | 放进去即自动轮播（想自定义顺序再填 `siteConfig.ts → backgrounds`） |
| 音乐 | `public/music/*.mp3` | `data/music.ts` 填 `src: "/music/xx.mp3"` |

> 头像若想用网络图床，直接把 `siteConfig.ts → avatar` 改成图床直链即可。
> 背景图支持昼夜自动加轻纱，只需准备一张横图（建议 ≥1920×1080）。

## 🎵 音乐：本地 or 阿里云 OSS？

**GitHub Pages 本身不能存音频做代理，但两种方式都能正常播放：**

1. **本地（最简单）**：把 mp3 放进仓库 `public/music/`（GitHub 单文件建议 < 100MB），推代码一起部署即可。
2. **阿里云 OSS**：bucket 权限设「公共读」→ 复制 mp3 直链（形如 `https://xxx.oss-cn-hangzhou.aliyuncs.com/xx.mp3`）填进 `data/music.ts` 的 `src`。浏览器会跨域直连播放，GitHub 不需要参与。

示例歌曲目前是公网演示音频，改好配置后直接删掉即可。

## 📁 目录结构

```text
app/                    页面（App Router）
content/
  posts/*.md            文章
  chatters/*.md         杂谈
data/
  projects.ts           项目
  music.ts              🎵 播放列表（本地/OSS 直链/歌词）
public/
  avatar.png            🖼 你的头像（待上传，默认占位 TODO）
  backgrounds/          🖼 壁纸轮播（待上传）
  music/                🎵 本地歌曲（待上传）
  covers/               示例封面 svg（可删）
siteConfig.ts           🎛️ 全站控制中心（昵称/头像/壁纸/社交）
components/music/       🎵 播放器（Provider + Dock + 沉浸层）
```

## 🚀 本地开发

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # 静态导出到 ./out
```

## ☁️ 部署到 GitHub Pages

1. 推到你的仓库；
2. 仓库 **Settings → Pages → Source = GitHub Actions**；
3. 推送 `main` 分支即自动构建部署（已配置 workflow，自动处理子路径 basePath）。

## 🛠 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Next.js 15 (App Router) |
| UI | React 19 |
| 样式 | Tailwind CSS 4（CSS-first）+ 自研毛玻璃体系 |
| 渲染 | gray-matter + unified/remark + rehype-highlight |
| 主题 | next-themes（class 策略） |
| 图标 | lucide-react |
| 部署 | 静态导出 + GitHub Actions |

## 📜 License

MIT
