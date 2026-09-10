---
title: "PixBead 架构设计：Java + Python 双后端如何分工"
date: "2026-09-06 10:00:00"
description: "把照片一键变成拼豆图纸的创作社区，为什么需要一个 Java 业务后端 + 一个 Python 算法服务？这篇梳理双后端的边界、协作方式与异步转化链路。"
tags: ["Spring Boot", "FastAPI", "架构设计", "Python"]
---

> 项目：[PixBead（拼豆社交网站）](https://github.com/2014462166/pixbead) —— 以「图片 → 拼豆图纸」转化为核心的创作社区，本地已跑通 MVP+ 核心闭环。

## 项目要做什么

一句话：**上传图片 → 自定义参数 → 生成可打印的拼豆图纸 → 分享与社交**。

用户带着一张喜欢的图来，算法负责像素化、色彩量化、色号映射，最后生成一张带圆豆、网格与色号的图纸 PNG，以及每种色号需要多少颗豆的清单。

这类产品有两个截然不同的重心：一个是**业务**（账号、作品、关注、点赞、评论、通知），一个是**算法**（图像处理，CPU 密集）。把它们揉进一个服务会很别扭，于是拆成了两个后端。

## 为什么是双后端

### Java（Spring Boot）：业务面

负责事务、鉴权、关系型数据与对外稳定 API：认证（JWT）、用户与关注关系、作品 CRUD、互动（点赞/评论/收藏）、Feed 与搜索。这些诉求高度依赖 MySQL 的事务与唯一索引，Spring 生态成熟稳定。

### Python（FastAPI）：算法面

负责图像处理：Pillow / NumPy 生态无可替代，量化、抖动、抠图这类算法迭代快、且是纯 CPU 计算。它天然无状态，很适合独立部署与横向扩容。

### 两者如何协作

- **调用**：Java 通过内部 HTTP 调用 Python 的转化接口；
- **解耦**：任务落库到 `convert_tasks` 表，Python 处理完回写状态与结果（也可以改为 Python 主动拉取任务）；
- **产物交换**：原图与图纸都放 OSS，两边只传 key / URL，不走大文件。

```text
浏览器 (React SPA)
   │  REST / 上传
   ▼
Java 后端 (Spring Boot) ──JDBC── MySQL
   │  内部 HTTP
   ▼
Python 转化服务 (FastAPI + Pillow) ── 读写 ── OSS + CDN
```

## 异步转化链路

转化是耗时操作（大网格 + 抖动可能数秒），所以设计成**异步任务**：

1. 前端 `POST /convert`，提交 `image_key` + 参数，拿到 `task_id`；
2. 前端轮询 `GET /convert/{taskId}`（后期可升级 SSE / WebSocket）；
3. Python 下载原图 → 预处理 → 量化 → 渲染 → 写回 OSS；
4. 状态变为成功，返回图纸 URL、色号清单与用豆统计；
5. 用户满意再点「保存作品」→ `POST /designs` 落库上墙。

> 一个取舍：**前端也有一套简版量化算法**（Web Worker 里跑），用于拖动参数时的即时预览；正式出图仍交给 Python，保证精确与可复现。两套算法共用同一份参数 schema 对齐，避免“预览和结果不一致”。

## 数据与存储约定

核心表围绕 `users / designs / convert_tasks / likes / comments / favorites / follows / tags / notifications` 展开，作品表上直接冗余 `like_count` 等计数并在事务内更新（后期可换 Redis 计数 + 定时回写）。

OSS 目录按环境隔离、按业务分桶：

```text
pixbead-{env}/
├── uploads/{userId}/{yyyy}/{mm}/{uuid}.png   # 原图（临时）
├── designs/{designId}/pattern.png            # 图纸
├── designs/{designId}/pattern.pdf            # 打印版
└── avatars/{userId}/{uuid}.png               # 头像
```

小文件走服务端中转（安全可控），大文件后续可用 STS 临时凭证直传。

## 一点前端感受

前端是 React 18 + TypeScript + Vite，UI 走**毛玻璃清新风**（半透明白卡 + backdrop blur + 薄荷绿/天蓝渐变点缀），唯独图纸预览保持 `image-rendering: pixelated`——界面轻盈，但像素本身必须清晰。

## 小结

双后端不是为了炫技，而是让**业务稳定性**与**算法迭代速度**各自待在合适的技术栈里，用数据库任务表与对象存储做解耦。下一步是把转化参数做到“既强大又好懂”，这也是拼豆玩家最在意的部分。
