import fs from "fs";
import path from "path";

/**
 * 判断一个相对 public/ 的资源在构建/开发机上是否存在。
 * 用于“头像/背景图等由用户后上传”的占位逻辑（TODO 提示）。
 * 仅可在 Server Components / 构建期使用。
 */
export function publicPathExists(relOrUrl?: string): boolean {
  if (!relOrUrl) return false;
  if (/^(https?:)?\/\//.test(relOrUrl)) return true; // 外链视为可用
  const p = path.join(process.cwd(), "public", relOrUrl.replace(/^\/+/, ""));
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}
