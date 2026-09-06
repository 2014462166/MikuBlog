/**
 * AuroraBackground —— 全站背景层（初音二次元向）
 * 1) 若你在 siteConfig.backgrounds 里配置了已上传到 public/backgrounds 的壁纸，
 *    则渲染为“全屏淡入淡出轮播 + 昼夜可读性轻纱”；
 * 2) 否则回退为内置的“极光渐变 + 深色星空”，保持毛玻璃的“有内容”底层。
 */

import fs from "fs";
import path from "path";
import { siteConfig } from "@/siteConfig";
import { publicPathExists } from "@/lib/public-file";
import { asset } from "@/lib/site-url";
import BackgroundSlideshow from "./BackgroundSlideshow";

const STARS = [
  { top: "12%", left: "18%", d: 2.6, delay: 0 },
  { top: "22%", left: "76%", d: 3.4, delay: 1.2 },
  { top: "42%", left: "88%", d: 2.2, delay: 0.6 },
  { top: "58%", left: "8%", d: 3.0, delay: 2.0 },
  { top: "70%", left: "38%", d: 2.4, delay: 1.6 },
  { top: "84%", left: "70%", d: 2.0, delay: 0.3 },
  { top: "30%", left: "46%", d: 1.8, delay: 2.8 },
  { top: "90%", left: "22%", d: 2.8, delay: 1.0 },
];

export default function AuroraBackground() {
  // 优先使用 siteConfig.backgrounds 指定的顺序；
  // 若为空则自动扫描 public/backgrounds 下所有图片（无需手动改配置）。
  const configured = siteConfig.backgrounds ?? [];
  const autoImages = (() => {
    const dir = path.join(process.cwd(), "public", "backgrounds");
    try {
      return fs
        .readdirSync(dir)
        .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
        .map((f) => `/backgrounds/${f}`)
        .sort();
    } catch {
      return [];
    }
  })();
  const sources = (configured.length > 0 ? configured : autoImages).filter((u) =>
    publicPathExists(u),
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {sources.length > 0 ? (
        /* ---------- 你的壁纸轮播 ---------- */
        <>
          <BackgroundSlideshow images={sources.map(asset)} />
          {/* 可读性轻纱（昼夜不同） */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/35 to-white/65 transition-colors duration-700 dark:from-[#06070f]/75 dark:via-[#06070f]/55 dark:to-[#06070f]/80" />
          <div
            className="absolute inset-x-0 bottom-0 h-44"
            style={{ background: "linear-gradient(to top, var(--page-bg), transparent)" }}
          />
        </>
      ) : (
        /* ---------- 内置极光回退 ---------- */
        <>
          {/* 日间层 */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#fdfdff_0%,#eef3ff_45%,#f8f2fe_100%)] opacity-100 transition-opacity duration-700 dark:opacity-0">
            <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_-5%,rgba(120,210,255,0.5),transparent_70%)]" />
            <div
              className="absolute -left-[8%] top-[6%] h-[46vw] w-[46vw] rounded-full blur-[110px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(45,212,191,0.5), transparent 70%)",
                animation: "float-slow 22s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -right-[10%] top-[24%] h-[42vw] w-[42vw] rounded-full blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,158,199,0.5), transparent 70%)",
                animation: "float-slow 27s ease-in-out infinite",
                animationDelay: "-8s",
              }}
            />
            <div
              className="absolute bottom-[-6%] left-[16%] h-[44vw] w-[44vw] rounded-full blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.45), transparent 70%)",
                animation: "float-slow 30s ease-in-out infinite",
                animationDelay: "-16s",
              }}
            />
          </div>

          {/* 夜间层 */}
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(13,148,136,0.5),transparent_70%),linear-gradient(180deg,#05060f_0%,#07121c_100%)] opacity-0 transition-opacity duration-700 dark:opacity-100">
            <div
              className="absolute -left-[10%] top-[-4%] h-[52vw] w-[52vw] rounded-full blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(20,184,166,0.35), transparent 70%)",
                animation: "float-slow 26s ease-in-out infinite",
              }}
            />
            <div
              className="absolute -right-[12%] top-[20%] h-[46vw] w-[46vw] rounded-full blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(244,63,94,0.25), transparent 70%)",
                animation: "float-slow 30s ease-in-out infinite",
                animationDelay: "-10s",
              }}
            />
            <div
              className="absolute bottom-[-10%] left-[10%] h-[50vw] w-[50vw] rounded-full blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(56,189,248,0.25), transparent 70%)",
                animation: "float-slow 34s ease-in-out infinite",
                animationDelay: "-20s",
              }}
            />
            {STARS.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: s.top,
                  left: s.left,
                  width: 3,
                  height: 3,
                  animation: `twinkle ${s.d}s ease-in-out infinite`,
                  animationDelay: `${s.delay}s`,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
