---
title: "给自己的博客加一个沉浸式音乐播放器"
date: "2026-07-30 20:00:00"
description: "记录播放器从 0 到 1 的过程：全局音频状态、旋转唱片、逐行歌词与跨页不断歌的实现思路。"
tags: ["随笔", "音乐", "React"]
---

## 需求拆解

所谓“沉浸式”，我理解的三个关键词：

1. **全局**——切页不重载、不中断；
2. **可视**——唱片在转、歌词在滚、均衡器在跳；
3. **可被忽略**——不想听时一键收起成底部小条。

## 核心：一个全局 Context

播放器状态放在 `MusicProvider` 里，包住整个 `body`。这样无论是首页轮播还是文章页，都能拿到同一份 `playing / currentTrack / progress`。

```tsx
// components/music/MusicProvider.tsx（伪代码）
const Ctx = createContext<PlayerApi | null>(null);

export function MusicProvider({ children }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  // ... play / pause / next / seek 等 API
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export const usePlayer = () => useContext(Ctx)!;
```

> 小细节：`<audio>` 的元素可以放在 Provider 内渲染一次，而不是每次 `new Audio()`，避免重复实例造成的状态错乱。

## 歌词：轻量 LRC 解析

不用引库，几十行就够：把 `[mm:ss]` 逐行解析成 `{ time, text }` 数组，播放时二分查找当前行，配合容器滚动让当前句始终居中。

## 收尾

做完这套后我发现：**“全局”与“克制”并不冲突**。底部 Dock 平时只有 64px 高，展开才是一个 100vh 的沉浸层——既照顾了常驻听歌的人，也不打扰只是来读文章的人。
