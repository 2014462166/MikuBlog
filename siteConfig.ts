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
  title: "TheUndertaker · Miku小屋", // 浏览器标题 / 社交卡片标题
  titleShort: "Miku小屋", // 页脚等处的简称
  author: "TheUndertaker", // 博主昵称
  role: "技术宅 · 二次元爱好者", // 副标题/签名
  bio: "技术宅，二次元爱好者。喜欢写代码、听轻音乐，也乐意把生活里的小确幸都记录下来。",
  description: "个人博客 —— 技术、音乐与二次元的日常。",
  keywords: "blog, 个人博客, 技术宅, 二次元, 初音未来, Next.js 15",
  since: 2026, // 建站年份

  // ---------- 头像 ----------
  // ⚠️ 留空待你填入（填好后首页自动替换 TODO 占位）：
  //  阿里云 OSS：https://你的bucket.oss-cn-xxx.aliyuncs.com/avatar.png
  //  本地备选：  /avatar.png（把图放进 public/ 即可，会随站点一起发布）
  avatar: "https://mymikublog.oss-cn-beijing.aliyuncs.com/avatar.png",
  // 博客链接（线上实际地址）
  url: "https://2014462166.github.io/MikuBlog",

  // ---------- 背景壁纸（可选，多张自动淡入淡出轮播） ----------
  // 方案A 本地：把图放进 public/backgrounds/ 即自动生效，无需配置；
  // 方案B 阿里云 OSS：在下面填入直链（可多条）：
  //   例如 ["https://xxx.oss-cn-hangzhou.aliyuncs.com/bg-1.jpg", "..."]
  backgrounds: ["https://mymikublog.oss-cn-beijing.aliyuncs.com/bg-1.jpg"] as string[],

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
      "技术宅一枚",
      "二次元爱好者",
      "React / Next.js 折腾家",
      "轻音乐收藏家",
    ],
  },

  // ---------- 页脚 ----------
  footer: "Miku小屋 · 记录代码、音乐与二次元的日常",
};

export default siteConfig;
