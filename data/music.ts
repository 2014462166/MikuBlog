// data/music.ts —— 播放列表配置（你可以随意增删、排序）
//
// 🎵 音乐放哪里？
//   A. 本地（最简单）：把 mp3 直接放进仓库 public/music/ 目录，
//      然后 src 写 "/music/你下载的歌曲.mp3"。
//      ⚠ GitHub 单文件建议 < 100MB，纯音乐/普通歌曲都没问题。
//   B. 阿里云 OSS（GitHub Pages 上也能用）：
//      1. OSS 控制台开通 bucket → 上传 mp3；
//      2. bucket「权限管理 → 读写权限」设为「公共读」；
//      3. 得到形如 https://你的bucket.oss-cn-hangzhou.aliyuncs.com/xxx.mp3 的直链，
//         直接填入 src 即可（浏览器会跨域直连播放，无需 GitHub 参与）。
//      ⚠ 若需防盗刷可换私有读 + 前端签名，作为进阶玩法。
//   C. 其它任意图床/云直链 .mp3 同理可直接使用。
//
// cover：留空则播放器自动生成“初音青/蓝/粉”渐变封面；也可填本地 /covers/xxx.svg 或图床地址
// lrc：可选的简单歌词文本，每行 "[mm:ss] 歌词"

// 本地示例（把歌放到 public/music 后取消注释即可）：
// {
//   id: "local-1",
//   title: "我的第一首歌",
//   artist: "我自己",
//   src: "/music/my-song.mp3",
// },
// 阿里云 OSS 示例：
// {
//   id: "oss-1",
//   title: "云端的一首歌",
//   artist: "我",
//   src: "https://my-blog.oss-cn-hangzhou.aliyuncs.com/songs/my-song.mp3",
// },

export type Track = {
  id: string;
  title: string;
  artist: string;
  src: string;
  cover?: string;
  lrc?: string;
  /** 渐变色，用于氛围背景 [from, to] */
  gradient?: [string, string];
};

export const defaultTracks: Track[] = [
  {
    id: "calm-1",
    title: "アイロニ",
    artist: "miku",
    src: "/music/1n - アイロニ(pianover).mp3",
  },
  {
    id: "calm-2",
    title: "心做し",
    artist: "miku",
    src: "/music/李好 - 心做し (心理作用)(钢琴版).mp3",
  },
  {
    id: "calm-3",
    title: "歌に形はないけれど",
    artist: "miku",
    src: "/music/まらしぃ - 歌に形はないけれど (虽然歌声无形).mp3",
  },
];

