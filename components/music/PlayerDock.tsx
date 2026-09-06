"use client";

import { Pause, Play, SkipForward } from "lucide-react";
import type { Track } from "@/data/music";
import Cover from "./Cover";

export type DockProps = {
  track: Track;
  playing: boolean;
  started: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  onToggle: () => void;
  onNext: () => void;
  onExpand: () => void;
};

export default function PlayerDock(props: DockProps) {
  const { track, playing, started, currentTime, duration, progress, onToggle, onNext, onExpand } = props;
  if (!started) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-3 sm:bottom-5">
      <div
        role="button"
        tabIndex={0}
        aria-label={`打开沉浸式播放器：${track.title}`}
        onClick={onExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onExpand();
        }}
        className="glass-strong pointer-events-auto relative w-full max-w-md cursor-pointer overflow-hidden rounded-2xl p-2.5 pl-3 transition-transform duration-300 hover:-translate-y-0.5"
      >
        {/* 顶部播放进度 */}
        <div
          className="absolute left-0 top-0 h-[3px] rounded-full bg-gradient-to-r from-teal-400 via-pink-400 to-cyan-400"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />

        <div className="flex items-center gap-3">
          <Cover
            track={track}
            spinning
            playing={playing}
            className="h-11 w-11 shrink-0 rounded-xl"
          />
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-semibold text-[var(--ink)]">
              {track.title}
            </p>
            <p className="truncate text-xs text-[var(--ink-3)]">{track.artist}</p>
          </div>

          <div className="flex items-center gap-1 text-[var(--ink-2)]">
            <button
              type="button"
              aria-label={playing ? "暂停" : "播放"}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg shadow-pink-400/30 transition hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg,#39C5BB,#ff9ec7 55%,#ff5c9e)",
              }}
            >
              {playing ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
            </button>
            <button
              type="button"
              aria-label="下一首"
              title="下一首"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
