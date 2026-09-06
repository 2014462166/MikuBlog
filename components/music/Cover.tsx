"use client";

import type { Track } from "@/data/music";

/** 根据 track 生成稳定的渐变配色（无封面时的兜底 / 氛围背景色）—— 初音青 / 蓝 / 粉 系 */
const FALLBACK_PALETTES: [string, string, string][] = [
  ["#00a6c8", "#2dd4d8", "#ffb7d9"],
  ["#0077d9", "#4cc3ff", "#bfe8ff"],
  ["#ff5c9e", "#ff9ec7", "#ffe3ef"],
  ["#008f8c", "#2dd4bf", "#a6f5e2"],
  ["#5b6ee0", "#38bdf8", "#d6f0ff"],
];

export function paletteFor(track: Track): [string, string, string] {
  let h = 0;
  for (const c of track.id) h = (h * 31 + c.charCodeAt(0)) % 997;
  return FALLBACK_PALETTES[h % FALLBACK_PALETTES.length];
}

type CoverProps = {
  track: Track;
  className?: string;
  /** 是否旋转（唱片效果） */
  spinning?: boolean;
  playing?: boolean;
};

export default function Cover({ track, className = "", spinning = false, playing = false }: CoverProps) {
  const [c1, c2, c3] = paletteFor(track);
  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{
        animation: spinning ? `spin-slow 12s linear infinite` : undefined,
        animationPlayState: playing ? "running" : "paused",
        background: `linear-gradient(135deg, ${c1}, ${c2} 55%, ${c3})`,
      }}
    >
      {track.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={track.cover}
          alt={track.title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-[2.4em] font-black text-white/40 select-none"
            aria-hidden
          >
            ♪
          </span>
        </div>
      )}
      {/* 玻璃反光 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/10" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]" />
    </div>
  );
}
