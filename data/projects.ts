// data/projects.ts —— 项目列表
// url/github 留空会在卡片上显示"待补充"

export type Project = {
  name: string;
  description: string;
  /** 一句话亮点 */
  highlight?: string;
  tags: string[];
  url?: string;
  github?: string;
  /** 展示用 emoji 或 svg 均可 */
  icon?: string;
  featured?: boolean;
};

export const projectsData: Project[] = [
  {
    name: "循环闹钟 CycleAlarm（kundian4-mobile）",
    description:
      "基于 Expo SDK 57 + React Native 的多功能周期提醒 App：闹钟支持“每隔 N 天 / 每周 / 每月 / 仅一次”四种循环方式；内置待办清单、记账、日记三个轻量工具。纯本地存储、零后端。",
    highlight: "Android 原生全屏响铃（锁屏可用）+ AlarmManager 精确调度",
    tags: ["React Native", "Expo SDK 57", "Kotlin", "TypeScript"],
    github: "https://github.com/2014462166/kundian4-mobile",
    icon: "⏰",
    featured: true,
  },
  {
    name: "我的个人博客 MyBlog",
    description:
      "你正在看的这个站点：Next.js 15 App Router + React 19 + Tailwind CSS 4 毛玻璃风格，沉浸式音乐播放器、昼夜模式与文章/项目/杂谈分类，静态导出部署于 GitHub Pages，素材托管在阿里云 OSS。",
    highlight: "毛玻璃 × 昼夜双主题 × 全局播放器",
    tags: ["Next.js 15", "React 19", "Tailwind CSS 4"],
    url: "https://2014462166.github.io/MikuBlog",
    github: "https://github.com/2014462166/MikuBlog",
    icon: "🧊",
    featured: true,
  },
];
