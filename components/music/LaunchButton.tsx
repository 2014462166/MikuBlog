"use client";

import { Music } from "lucide-react";

type Props = { onClick: () => void };

/** 启动按钮：未开始播放前，右下角/底部居中的圆形音乐按钮 */
export default function LaunchButton({ onClick }: Props) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-3">
      <button
        type="button"
        onClick={onClick}
        aria-label="打开音乐播放器"
        title="打开沉浸式音乐播放器"
        className="pointer-events-auto group relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-2xl shadow-pink-400/40 transition hover:scale-105"
        style={{
          background:
            "linear-gradient(135deg,#39C5BB,#ff9ec7 55%,#ff5c9e)",
        }}
      >
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border-2 border-pink-300/60"
          style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
        />
        <Music className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
      </button>
    </div>
  );
}
