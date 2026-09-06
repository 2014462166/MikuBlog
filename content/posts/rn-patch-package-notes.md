---
title: "React Native 笔记：patch-package 让旧原生依赖兼容新 SDK"
date: "2026-09-03 20:30:00"
description: "升级 Expo SDK 后，老牌原生库往往最先出问题：AGP 版本、namespace、Android 14 全屏策略……这篇记录我如何用 patch-package 系统性“救火”。"
tags: ["React Native", "Expo", "Android", "工程化"]
---

## 背景

在一次把项目升到 Expo SDK 57 的过程中，依赖里的 `react-native-alarm-notification@1.8.0` 是主要拦路虎——它发布较早，面对 AGP 8 / Gradle 8 / compileSdk 35 会出现构建失败；在 Android 14+ 上还受「默认禁止全屏通知」策略影响，闹钟到点根本弹不出全屏界面。

换库成本太高（全部调度代码都要重写），所以我选择：**用 patch-package 直接改 node_modules 里那份代码**。

## patch-package 工作流

核心套路：改 `node_modules` → 生成补丁 → `postinstall` 自动还原。

```bash
npm i -D patch-package

# 1) 手工修改 node_modules/react-native-alarm-notification 内的源码
# 2) 生成补丁
npx patch-package react-native-alarm-notification
# 生成 patches/react-native-alarm-notification+1.8.0.patch

# 3) package.json 加 postinstall，保证每次 npm install 后自动打补丁
# "postinstall": "patch-package"
```

## 我实际修了什么

1. **Android 14 全屏策略**：到点后不再依赖插件的全屏通知，改成系统广播 + `Intent` 直接拉起项目自己的 `AlarmActivity`——顺带把“响铃页”的控制权收回到自己手里；
2. **Gradle / AGP 现代化**：补 `namespace`、适配 compileSdk 35 / minSdk 24、移除废弃 maven 插件与 jcenter；
3. **可靠性补丁**：允许并发注册多个同一时刻的闹钟、开机恢复时跳过已过期触发、为 PendingIntent 补 `FLAG_IMMUTABLE`、响铃改走闹钟音频流、唤醒锁设 10 分钟上限。

这些改动让一个“上个时代的库”在全新 SDK 上平稳工作，闹钟链路也顺带更可靠了。

## 几个经验

- **改完一定要重新跑原生构建**验证，光过 tsc 不够；
- 升级依赖版本后补丁**可能失效**，报错时先看 `patches/` 里是否还是原 hash；
- 补丁里尽量只做「与业务相关的必要改动」，避免引入隐性问题；
- 如果 patch 持续变大、维护成本升高，那就是该考虑“自研本地模块或换库”的信号——我最终也的确把响铃页做成了自己的 Kotlin 原生模块，patch 只保留少量调度修正。

## 相关阅读

- 配套项目与完整架构：[循环闹钟 kundian4-mobile](https://github.com/2014462166/kundian4-mobile)
- 我的另一篇《Expo SDK 57 实践：用本地原生模块做锁屏响铃》详细讲了响铃链路的降级设计。
