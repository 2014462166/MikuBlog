import type { NextConfig } from "next";

// —— GitHub Pages 智能 basePath ——
// 本地 npm run dev / build：未设置 GITHUB_REPOSITORY，basePath 为空，正常 / 开头。
// GitHub Actions 构建：自动带上仓库名（如 /MikuBlog），
// 若仓库本身是 <user>.github.io 用户站则不加前缀。
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserSite = repo.toLowerCase().endsWith(".github.io");
const basePath = repo && !isUserSite ? `/${repo}` : "";

// 同步给客户端可读的 base 前缀（lib/site-url.ts 的 asset() 会用到，
// 用于包装图片/音频等相对资源，避免子路径部署下 404）。
if (!process.env.NEXT_PUBLIC_BASE_PATH) {
  process.env.NEXT_PUBLIC_BASE_PATH = basePath;
}

const nextConfig: NextConfig = {
  output: "export", // 纯静态导出，适配 GitHub Pages / 云存储静态托管
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
