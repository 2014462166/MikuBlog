---
title: "你好，世界 —— 我的 Miku小屋开张啦"
date: "2026-09-01 09:00:00"
description: "第一篇示例文章：介绍一下这个站点会有什么，以及怎么把这里改造成属于你自己的小窝。"
tags: ["欢迎", "博客"]
featured: true
---

## 终于建好博客了

欢迎来到我的 **Miku小屋**。这是一篇示例文章，用来让你快速看到整套站点的排版与功能：标题层级、代码高亮、表格、任务清单……都会被渲染成下面这样。

> 温馨提示：这篇文章本身是可以直接改 / 删除的。你的文章放在 `content/posts/*.md`，新建一个 `.md` 文件就自动多一篇文章。

## 这个站点有什么

- **文章**：长文创作，支持标签筛选与 Markdown 全功能渲染；
- **项目**：把做过的东西陈列在 `/projects`；
- **杂谈**：短小的碎片记录，适合随笔、灵感、阅读摘抄；
- **音乐播放器**：全局沉浸式播放，切页不断歌；
- **昼夜模式**：右上角一键切换，丝滑过渡。

## 一段代码示例

```ts
// lib/markdown.ts —— Markdown 渲染管线
const html = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight)
  .use(rehypeStringify)
  .process(markdown);
```

## 一张表格示例

| 分类   | 位置                    | 内容类型     |
| ------ | ----------------------- | ------------ |
| 文章   | `content/posts/`        | Markdown 长文 |
| 杂谈   | `content/chatters/`     | Markdown 随笔 |
| 项目   | `data/projects.ts`      | TS 数据      |
| 音乐   | `data/music.ts`         | TS 数据      |

## 任务清单示例

- [x] 搭建毛玻璃主题
- [x] 接入昼夜切换
- [x] 写完这篇欢迎文章
- [ ] 替换成我自己的内容

## 让这里变成你的

1. 打开 `siteConfig.ts`，把昵称、签名、头像换成你的；
2. 把本文删掉，在 `content/posts/` 里写第一篇真正属于你的文章；
3. 在 `content/chatters/` 里发一条杂谈；
4. 部署：交给 GitHub Actions，推到 `main` 分支即可自动上线 🚀

期待你在自己的小屋里折腾出有趣的东西。回见！
