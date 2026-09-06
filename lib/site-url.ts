/**
 * 站点子路径前缀工具
 * 本地：PUBLIC_BASE_PATH = ""（访问 /avatar.png）
 * GitHub Pages 项目站：PUBLIC_BASE_PATH = "/MikuBlog"（资源在 /MikuBlog/avatar.png）
 * 图片/音频若以 "/" 开头写相对本站资源，必须用 asset() 包装，否则子路径部署下会 404。
 * 外链(http/https) 与 data/blob 原样返回。
 */
export const PUBLIC_BASE_PATH: string = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(p?: string): string {
  if (!p) return "";
  if (/^(https?:)?\/\//.test(p) || p.startsWith("data:") || p.startsWith("blob:")) {
    return p;
  }
  const rel = p.startsWith("/") ? p : `/${p}`;
  return `${PUBLIC_BASE_PATH}${rel}`;
}
