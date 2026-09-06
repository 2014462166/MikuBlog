"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Disc3,
  ListMusic,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { Track } from "@/data/music";
import type { LyricLine } from "@/lib/lrc";
import { formatTime } from "@/lib/lrc";
import Cover, { paletteFor } from "./Cover";
import type { RepeatMode } from "./MusicProvider";

export type OverlayProps = {
  open: boolean;
  tracks: Track[];
  current: Track;
  index: number;
  playing: boolean;
  started: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  muted: boolean;
  repeat: RepeatMode;
  lyrics: LyricLine[];
  lyricIndex: number;
  onClose: () => void;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (t: number) => void;
  onPlayAt: (i: number) => void;
  onVolume: (v: number) => void;
  onToggleMute: () => void;
  onCycleRepeat: () => void;
};

export default function PlayerOverlay(props: OverlayProps) {
  const {
    open,
    tracks,
    current,
    index,
    playing,
    started,
    currentTime,
    duration,
    progress,
    volume,
    muted,
    repeat,
    lyrics,
    lyricIndex,
    onClose,
    onToggle,
    onNext,
    onPrev,
    onSeek,
    onPlayAt,
    onVolume,
    onToggleMute,
    onCycleRepeat,
  } = props;

  const [listOpen, setListOpen] = useState(false);
  const lyricBoxRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setListOpen(false);
  }, [open, index]);

  useEffect(() => {
    if (lyricBoxRef.current && activeLineRef.current) {
      const box = lyricBoxRef.current;
      const el = activeLineRef.current;
      const target = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
      box.scrollTo({ top: target, behavior: "smooth" });
    }
  }, [lyricIndex, open]);

  if (!open) return null;

  const [c1, c2, c3] = paletteFor(current);
  const seekStyle = {
    "--fill": `${Math.min(100, Math.max(0, progress * 100))}%`,
  } as CSSProperties;
  const volStyle = {
    "--fill": `${(muted ? 0 : volume) * 100}%`,
  } as CSSProperties;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      {/* 背景压暗 */}
      <button
        type="button"
        aria-label="关闭播放器"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-black/55 backdrop-blur-2xl dark:bg-black/70"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="沉浸式音乐播放器"
        className="glass-strong relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.8rem] p-5 no-scrollbar sm:p-7"
      >
        {/* 氛围光斑 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full opacity-35 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c2}, transparent 70%)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(circle, ${c3}, transparent 70%)` }}
        />

        {/* 顶栏 */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--ink-2)]">
            <Disc3 className="h-5 w-5 text-[var(--accent)]" />
            沉浸模式
            <span className="rounded-full border border-[var(--glass-brd)] bg-[var(--glass-bg)] px-2 py-0.5 text-xs">
              {index + 1} / {tracks.length}
            </span>
          </div>
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:rotate-90 hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 主区域 */}
        <div className="relative mt-6 flex flex-col items-center gap-8 sm:flex-row sm:items-center">
          {/* 唱片 */}
          <div className="relative shrink-0">
            <div
              className="absolute inset-0 scale-90 rounded-full opacity-40 blur-2xl"
              style={{ background: `linear-gradient(135deg, ${c1}, ${c3})` }}
            />
            <Cover
              track={current}
              spinning={playing}
              playing={playing}
              className="relative h-44 w-44 rounded-full border-4 border-white/40 shadow-2xl shadow-black/30 dark:border-white/10 sm:h-52 sm:w-52"
            />
          </div>

          {/* 信息 + 歌词 */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-xl font-extrabold text-[var(--ink)] sm:text-2xl">
                  {current.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-3)]">{current.artist}</p>
              </div>
              {started && (
                <div
                  className={`eq ${playing ? "" : "eq-paused"} mt-1 text-pink-300`}
                  aria-hidden
                >
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>

            {/* 歌词滚动区 */}
            <div
              ref={lyricBoxRef}
              className="no-scrollbar mt-4 max-h-48 min-h-[9rem] flex-1 overflow-y-auto rounded-2xl px-2 py-2"
            >
              {lyrics.length > 0 ? (
                <div className="flex flex-col items-center gap-3">
                  {lyrics.map((line, i) => (
                    <div
                      key={i}
                      ref={i === lyricIndex ? activeLineRef : undefined}
                      className={`max-w-full text-center transition-all duration-500 ${
                        i === lyricIndex
                          ? "scale-105 font-bold text-[var(--ink)]"
                          : i < lyricIndex
                            ? "text-[var(--ink-3)]"
                            : "text-[var(--ink-3)] opacity-45"
                      }`}
                    >
                      {line.text}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[var(--ink-3)]">
                  {started && playing && (
                    <div className="eq text-[var(--accent)]" aria-hidden>
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                  <p className="text-sm">
                    {started
                      ? "（纯音乐 / 暂无歌词，享受此刻吧）"
                      : "点击播放，开始一段沉浸之旅"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 进度条 */}
        <div className="relative mt-6 flex items-center gap-3 text-xs tabular-nums text-[var(--ink-3)]">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            className="range"
            min={0}
            max={duration || 0}
            step={0.5}
            value={Math.min(currentTime, duration || 0)}
            onChange={(e) => onSeek(Number(e.target.value))}
            style={seekStyle}
            aria-label="播放进度"
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        {/* 控制按钮 */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCycleRepeat}
            aria-label={`循环模式：${repeat}`}
            title={`循环：${repeat === "all" ? "列表循环" : repeat === "one" ? "单曲循环" : "顺序播放"}`}
            className={`relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10 ${
              repeat !== "off" ? "text-[var(--accent)]" : "text-[var(--ink-3)]"
            }`}
          >
            <Repeat className="h-[18px] w-[18px]" />
            {repeat === "one" && (
              <span className="absolute right-1 top-0 text-[9px] font-bold">1</span>
            )}
          </button>

          <button
            type="button"
            onClick={onPrev}
            aria-label="上一首"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:scale-110 hover:text-[var(--ink)]"
          >
            <SkipBack className="h-6 w-6 fill-current" />
          </button>

          <button
            type="button"
            onClick={onToggle}
            aria-label={playing ? "暂停" : "播放"}
            className="flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl transition hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${c1}, ${c2} 50%, ${c3})`,
              boxShadow: `0 14px 34px -8px ${c2}99`,
            }}
          >
            {playing ? (
              <Pause className="h-7 w-7 fill-current" />
            ) : (
              <Play className="ml-1 h-7 w-7 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="下一首"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:scale-110 hover:text-[var(--ink)]"
          >
            <SkipForward className="h-6 w-6 fill-current" />
          </button>

          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            aria-label="播放列表"
            title="播放列表"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10 ${
              listOpen ? "text-[var(--accent)]" : "text-[var(--ink-3)]"
            }`}
          >
            <ListMusic className="h-5 w-5" />
          </button>
        </div>

        {/* 音量 */}
        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "取消静音" : "静音"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:text-[var(--ink)]"
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            className="range w-32 sm:w-40"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => onVolume(Number(e.target.value))}
            style={volStyle}
            aria-label="音量"
          />
        </div>

        {/* 播放列表 */}
        {listOpen && (
          <div className="mt-4 border-t border-[var(--glass-brd)] pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--ink-3)]">
              播放列表
            </p>
            <ul className="flex max-h-52 flex-col gap-1.5 overflow-y-auto pr-1 no-scrollbar">
              {tracks.map((t, i) => {
                const isCurrent = i === index;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => onPlayAt(i)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                        isCurrent
                          ? "bg-gradient-to-r from-teal-400/15 via-pink-400/10 to-transparent text-[var(--ink)]"
                          : "text-[var(--ink-2)] hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <Cover track={t} className="h-9 w-9 shrink-0 rounded-lg" />
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-sm ${isCurrent ? "font-bold" : "font-medium"}`}>
                          {t.title}
                        </span>
                        <span className="block truncate text-xs text-[var(--ink-3)]">
                          {t.artist}
                        </span>
                      </span>
                      {isCurrent && started && (
                        <span className="eq shrink-0 text-pink-300" aria-hidden>
                          <span />
                          <span />
                          <span />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
