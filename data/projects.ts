// data/projects.ts —— 项目列表
// url/github 留空会在卡片上显示"待补充"，方便你先搭骨架后补充

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
    name: "我的个人博客 MyBlog",
    description: "你正在看的这个站点：Next.js 15 App Router + React 19 + Tailwind CSS 4 极致毛玻璃设计，沉浸式音乐播放器、昼夜模式与文章/项目/杂谈分类。",
    highlight: "毛玻璃 × 昼夜双主题 × 全局播放器",
    tags: ["Next.js 15", "React 19", "Tailwind CSS 4"],
    url: "https://your-name.github.io",
    github: "https://github.com/",
    icon: "🧊",
    featured: true,
  },
  {
    name: "TodoGlass 待办看板",
    description: "一个把毛玻璃做进日常效率工具的示例项目：拖拽看板 + 优先级矩阵 + 本地存储。此项目为占位示例，可在 data/projects.ts 中替换成你的真实项目。",
    highlight: "拖拽看板 · 本地持久化",
    tags: ["React", "Zustand", "dnd"],
    icon: "🎯",
    featured: true,
  },
  {
    name: "Weather Glass 天气小组件",
    description: "可嵌入任意网页的毛玻璃天气卡片，支持昼夜自动切换与动态天气图标。同样为占位示例，替换成你的作品即可。",
    highlight: "小组件 · 动态图标",
    tags: ["Web Component", "Open-Meteo"],
    icon: "⛅",
  },
];
