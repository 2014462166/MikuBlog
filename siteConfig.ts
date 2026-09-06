// ============================================================
// siteConfig.ts —— 你的全站"控制中心"
// 只需要在这里改你的个人信息，整站(导航/首页/页脚/元信息)都会同步更新
// ============================================================

export type Social = {
  github?: string;
  email?: string;
  bilibili?: string;
  xiaohongshu?: string;
  juejin?: string;
};

export const siteConfig = {
  // ---------- 站点 ----------
  title: "你的昵称 · 玻璃小屋", // 浏览器标题 / 社交卡片标题
  titleShort: "玻璃小屋", // 页脚等处的简称
  author: "你的昵称", // 博主昵称
  role: "写代码 · 记生活 · 爱折腾", // 副标题/签名
  bio: "这里是我的个人博客：记录技术踩坑、项目折腾，以及生活里的一点点杂谈。整站采用极致毛玻璃 + 昼夜自适应设计，欢迎常来坐坐。",
  description: "个人博客 —— 文章、项目与杂谈，沉浸式音乐播放器 & 昼夜双主题。",
  keywords: "blog, 个人博客, Next.js 15, React 19, Tailwind CSS 4, 毛玻璃",
  since: 2026, // 建站年份

  // 头像（建议 512x512 方形）
  // 二选一：
  //  A. 本地上传：把图片放进 public/ 目录，例如把 avatar 重命名成 avatar.png 后写 "/avatar.png"（未上传前首页会显示 TODO 占位）
  //  B. 图床直链：https://xxx.oss-cn-xxx.aliyuncs.com/avatar.png
  avatar: "/avatar.png",
  // 博客链接（线上实际地址）
  url: "https://2014462166.github.io/MikuBlog",

  // ---------- 背景壁纸轮播（初音壁纸/自绘图皆可） ----------
  // ✅ 自动模式（推荐）：把图片放进 public/backgrounds/ 即可自动淡入淡出轮播，
  //    支持 jpg/png/webp/gif/avif，无需在这里配置。
  // 仅当你需要“挑几张 / 自定义顺序”时才手动填路径：
  backgrounds: [] as string[],
  // 例如：backgrounds: ["/backgrounds/bg-2.png", "/backgrounds/bg-1.jpg"],

  // ---------- 社交 ----------
  socials: {
    github: "https://github.com/2014462166", // https://github.com/<你的用户名>
    email: "",
    bilibili: "",
    juejin: "",
  } as Social,

  // ---------- 首页展示 ----------
  hero: {
    greeting: "Hi，我是", // 打招呼文案
    // 打字机滚动文案（可自由增删）
    typed: [
      "一名全栈开发者",
      "React / Next.js 爱好者",
      "UI 毛玻璃控",
      "终身学习者",
    ],
  },

  // ---------- 页脚 ----------
  footer:
    "本站由 Next.js 15 + React 19 + Tailwind CSS 4 构建 · 纯静态导出，可部署于 GitHub Pages / 任意云存储",
};

export default siteConfig;
