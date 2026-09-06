---
title: "Expo SDK 57 实践：用本地原生模块做「循环闹钟」的锁屏响铃"
date: "2026-09-04 10:00:00"
description: "如何突破系统闹钟只能按星期重复的限制，并让闹钟在 App 被杀、屏幕熄灭时也能可靠响铃：循环引擎 + 单次调度 + Kotlin 全屏响铃的三层降级设计实录。"
tags: ["React Native", "Expo SDK 57", "Android", "Kotlin"]
---

> 本文记录的是我的开源项目 [kundian4-mobile（循环闹钟）](https://github.com/2014462166/kundian4-mobile)：一个 Expo SDK 57 + React Native 的多功能个人工具 App，以**周期闹钟**为核心，内置待办、记账与日记。

## 要解决的问题

系统闹钟只能「按星期重复」，而我想要的是：**每隔 N 天一次、每月指定日、甚至仅此一次**。同时要求 Android 上做到「App 进程被杀、屏幕熄灭时也能到点响铃、停铃、稍后提醒」。

于是有了三层设计。

## 一、循环引擎：把一切循环翻译成“未来时刻”

核心文件 `cycleEngine.ts` 只做一件事：把四种循环方式统一换算成一个个**具体的未来触发时刻**。

| 循环方式 | 换算规则 |
| --- | --- |
| 每隔 N 天 | 从锚点日期起，每 N 天一次 |
| 每周自定义 | 勾选星期，生成最近一周内的触发点 |
| 每月指定日 | 多选日期，无该日的月份自动跳过 |
| 仅一次 | 单个时刻，响过即停 |

调度层拿到这些时刻后，**逐条注册成“单次闹钟”**，并一次性预排未来 30 次。这样即使 App 长期不被打开，也不依赖 JS 存活去“重排下一周期”。

```ts
// 伪代码示意
const moments = cycleEngine.expand(alarm, horizon: 30); // 未来 30 次触发时刻
moments.forEach((t) => scheduleOnce(t, alarm));        // 逐条单次调度
```

任何增删改、开关、回到前台，都会触发 `AlarmContext` 的**全量重排**，保证系统侧注册状态永远与配置一致；启动/回前台时还会自动停用过期的“仅一次”闹钟。

## 二、响铃链路：三层降级

为了让「即使进程被杀也能响」，我设计了一条逐级降级的链路：

```text
patch 后的 react-native-alarm-notification（AlarmManager 精确闹钟）
   │  到点触发
   ▼
① Kotlin AlarmActivity（原生全屏亮屏 + MediaPlayer 循环 + 震动）  ← Android 主方案，无需 JS
   ▼
② JS RingScreen（expo-audio 播放）                              ← App 在前台时的兜底
   ▼
③ 普通系统通知                                                  ← 最后兜底
```

第一层是本地原生模块：Kotlin 写的 `AlarmActivity` + Expo 本地 module + config plugin（给 MainActivity 加 `showWhenLocked` / `turnScreenOn`）。配合 `SCHEDULE_EXACT_ALARM`、`USE_FULL_SCREEN_INTENT`、`WAKE_LOCK`、`VIBRATE` 等权限，能做到**锁屏亮屏 + 循环播放 + 震动**。

停止/稍后提醒通过显式广播（`ACTION_DISMISS` / `ACTION_SNOOZE`）与 AlarmReceiver 通信——即使 JS 完全没在运行也能停铃。响铃音频走系统的**闹钟音频流**（`USAGE_ALARM`），与媒体音量解耦，静音模式下照样能响。

## 三、依赖救火：patch-package

`react-native-alarm-notification@1.8.0` 相当老，直接跑在 Expo SDK 57 / AGP 8 上会踩很多坑。我的处理是用 `patch-package` 打补丁，重点修了三类问题：

- **Android 14 默认禁止全屏通知**：到点改由广播 + `Intent` 直接拉起本项目的 `AlarmActivity`，不再依赖插件自带的全屏通知；
- **构建现代化**：适配 compileSdk 35 / minSdk 24、补 `namespace`、清掉废弃 maven/jcenter 依赖；
- **可靠性**：并发调度多个同时刻闹钟、开机恢复跳过过期触发、补 `FLAG_IMMUTABLE`、闹钟流播放、唤醒锁上限。

## 小结

1. 把「循环」抽象成「未来时刻列表」后，调度层只用处理最简单的单次注册；
2. “原生兜底 > 前台 JS > 通知” 的降级思路，让极端场景（进程被杀）也有保底方案；
3. 依赖太老时，别急着换库——`patch-package` 往往能以最小成本让旧库在新 SDK 上继续工作。

Android 之外，iOS 走 `expo-notifications` 通知方案回退，Web 仅做 UI 预览（datetimepicker 被别名成本地 `<input>` 桩）。更多架构细节见项目 README。
