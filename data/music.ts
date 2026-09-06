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

// ============================================================
// ✏️ 阿里云 OSS 待填位置
// 1) 上传三首 mp3 到 OSS，bucket 设为【公共读】；
// 2) 依次复制直链粘贴到下面对应位置（形如
//    https://xxx.oss-cn-hangzhou.aliyuncs.com/songs/song-1.mp3）。
// 填好后音乐播放器即可正常在线播放。
// 若暂时想用本地演示：把 mp3 放进 public/music/，然后把下面改成
// "/music/你的文件名.mp3" 即可（GitHub 单文件建议 <100MB）。
// ============================================================
const OSS_SRC = {
  song1: "https://mymikublog.oss-cn-beijing.aliyuncs.com/1n%20-%20%E3%82%A2%E3%82%A4%E3%83%AD%E3%83%8B%28pianover%29.mp3", // ← 待填：第一首 OSS 直链
  song2: "https://mymikublog.oss-cn-beijing.aliyuncs.com/%E6%9D%8E%E5%A5%BD%20-%20%E5%BF%83%E5%81%9A%E3%81%97%20%28%E5%BF%83%E7%90%86%E4%BD%9C%E7%94%A8%29%28%E9%92%A2%E7%90%B4%E7%89%88%29.mp3", // ← 待填：第二首 OSS 直链
  song3: "https://mymikublog.oss-cn-beijing.aliyuncs.com/%E3%81%BE%E3%82%89%E3%81%97%E3%81%83%20-%20%E6%AD%8C%E3%81%AB%E5%BD%A2%E3%81%AF%E3%81%AA%E3%81%84%E3%81%91%E3%82%8C%E3%81%A9%20%28%E8%99%BD%E7%84%B6%E6%AD%8C%E5%A3%B0%E6%97%A0%E5%BD%A2%29.mp3", // ← 待填：第三首 OSS 直链
};

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
    title: "アイロニ（钢琴版）",
    artist: "miku",
    src: OSS_SRC.song1,
  },
  {
    id: "calm-2",
    title: "心做し（钢琴版）",
    artist: "miku",
    src: OSS_SRC.song2,
  },
  {
    id: "calm-3",
    title: "歌に形はないけれど（钢琴版）",
    artist: "miku",
    src: OSS_SRC.song3,
  },
];

