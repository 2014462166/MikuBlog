---
title: "Next.js 15 + Tailwind CSS 4 毛玻璃实践笔记"
date: "2026-08-22 21:30:00"
description: "关于这套博客技术栈的实践记录：App Router、Tailwind 4 的 CSS-first 配置、以及怎么把毛玻璃做得“不过曝、不廉价”。"
tags: ["Next.js", "Tailwind CSS", "前端"]
---

## 为什么选这套组合

- **Next.js 15 (App Router)**：基于文件的路由、Server Components、静态导出都非常顺手；
- **React 19**：`use`、Actions、编译器优化，写起来更轻松；
- **Tailwind CSS 4**：CSS-first 配置（`.css` 里的 `@theme`），不再需要 `tailwind.config.js`。

## Tailwind 4 的几个关键差异

### 1. 自定义暗色变体

Tailwind 4 默认的 `dark:` 跟随系统 `prefers-color-scheme`。如果你像本博客一样用 `next-themes` 的 class 策略，需要在入口 CSS 声明一次：

```css
@import "tailwindcss";

/* 让 dark: 跟随 <html class="dark"> */
@custom-variant dark (&:where(.dark, .dark *));
```

### 2. 在 CSS 里直接写设计令牌

```css
@layer components {
  .glass {
    background-color: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(22px) saturate(170%);
  }
}
```

### 3. 毛玻璃的“不廉价”配方

毛玻璃做不好会显得脏，我总结了三个要点：

1. **背景要“有内容”**——纯色背景上 blur 没有意义，需要给底层放渐变色块/光斑；
2. **透明度别太高**——`0.05 ~ 0.6` 之间浮动，配合一层很淡的 `1px` 内高光；
3. **同屏克制**——不是所有卡片都要毛玻璃，重点区域用 `blur(30px)+saturate(190%)`，次要区域压低饱和与模糊。

## 一个实践对比

| 方案               | 模糊度  | 适合场景               |
| ------------------ | ------- | ---------------------- |
| `glass-soft`       | 14px    | 次要容器、导航悬浮层   |
| `glass`            | 22px    | 常规卡片               |
| `glass-strong`     | 30px+   | 弹层、播放器、强调卡片 |

> 文章卡片、歌词面板这类“随时要读”的内容，务必保证 `对比度 ≥ 4.5:1`，美观要让位于可读性。

## 小结

静态导出到 GitHub Pages 时，记得在 `next.config.ts` 打开 `output: "export"` 与 `images.unoptimized`。剩下的，就去享受毛玻璃带来的轻盈感吧。
