"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { defaultTracks, type Track } from "@/data/music";
import { asset } from "@/lib/site-url";
import { parseLrc, activeLyricIndex, type LyricLine } from "@/lib/lrc";
import PlayerDock from "./PlayerDock";
import PlayerOverlay from "./PlayerOverlay";
import LaunchButton from "./LaunchButton";

export type RepeatMode = "off" | "all" | "one";

const VOLUME_KEY = "myblog:volume";
const MUTE_KEY = "myblog:muted";
const REPEAT_KEY = "myblog:repeat";

export default function MusicProvider({ children }: { children: React.ReactNode }) {
  const tracks: Track[] = defaultTracks;

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  /** 用户是否已开始播放（用于控制底部 Dock 的出现时机） */
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.39); // 默认音量 39%
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [expanded, setExpanded] = useState(false);
  /** 自动播放被策略拦截时的“点击页面开启声音”提示 */
  const [tapToSound, setTapToSound] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const repeatRef = useRef<RepeatMode>("all");
  const volumeRef = useRef(0.39);
  const mutedRef = useRef(false);

  const getAudio = (): HTMLAudioElement | null => {
    if (typeof window === "undefined") return null;
    if (!audioRef.current) audioRef.current = new Audio();
    return audioRef.current;
  };

  /* ---------- 挂载：绑定事件 + 恢复偏好 ---------- */
  useEffect(() => {
    const a = getAudio();
    if (!a) return;
    a.preload = "none";

    try {
      // 音量/静音不恢复历史值：保持“默认 39% 且可听”
      const r = localStorage.getItem(REPEAT_KEY) as RepeatMode | null;
      if (r === "off" || r === "one") setRepeat(r);
    } catch {
      /* ignore */
    }

    const onTime = () => setCurrentTime(a.currentTime);
    const onDuration = () => {
      if (isFinite(a.duration) && a.duration > 0) setDuration(a.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      if (repeatRef.current === "one") {
        a.currentTime = 0;
        void a.play().catch(() => {});
        return;
      }
      const next = indexRef.current + 1;
      if (next >= tracks.length) {
        if (repeatRef.current === "all") startAt(0);
        else {
          setPlaying(false);
          setStarted(false);
        }
      } else {
        startAt(next);
      }
    };
    const onError = () => setPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("durationchange", onDuration);
    a.addEventListener("loadedmetadata", onDuration);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("durationchange", onDuration);
      a.removeEventListener("loadedmetadata", onDuration);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      a.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- 音量 / 静音 / 重复偏好持久化 ---------- */
  useEffect(() => {
    volumeRef.current = volume;
    mutedRef.current = muted;
    repeatRef.current = repeat;
    const a = audioRef.current;
    if (a) a.volume = muted ? 0 : volume;
    try {
      localStorage.setItem(VOLUME_KEY, String(volume));
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
      localStorage.setItem(REPEAT_KEY, repeat);
    } catch {
      /* ignore */
    }
  }, [volume, muted, repeat]);

  /* ---------- 打开沉浸层时锁定滚动 ---------- */
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [expanded]);

  /* ---------- 核心操作 ---------- */
  const startAt = (target: number) => {
    const a = getAudio();
    if (!a || tracks.length === 0) return;
    const idx = ((target % tracks.length) + tracks.length) % tracks.length;
    indexRef.current = idx;
    setIndex(idx);
    const t = tracks[idx];
    // 链接尚未配置（OSS 待填）时静默跳过，避免播放报错
    if (!t.src) {
      setPlaying(false);
      return;
    }
    a.src = asset(t.src);
    a.volume = mutedRef.current ? 0 : volumeRef.current;
    a.load();
    setCurrentTime(0);
    setDuration(0);
    setStarted(true);
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false);
        setStarted(true);
      });
  };

  const toggle = () => {
    const a = getAudio();
    if (!a) return;
    if (!started) {
      startAt(indexRef.current);
      return;
    }
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => setStarted(true));
    }
  };

  const step = (dir: 1 | -1) => {
    if (tracks.length === 0) return;
    startAt(indexRef.current + dir);
  };

  const seek = (t: number) => {
    const a = audioRef.current;
    if (!a || !isFinite(t)) return;
    a.currentTime = Math.max(0, Math.min(t, duration || t));
    setCurrentTime(a.currentTime);
  };

  const changeVolume = (v: number) => {
    const nv = Math.min(1, Math.max(0, v));
    if (muted && nv > 0) setMuted(false);
    setVolume(nv);
  };

  const toggleMute = () => setMuted((m) => !m);

  const cycleRepeat = () => {
    setRepeat((r) => (r === "all" ? "off" : r === "off" ? "one" : "all"));
  };

  /* ---------- 派生数据 ---------- */
  const current: Track | null = tracks[index] ?? null;
  const lyrics: LyricLine[] = useMemo(() => parseLrc(current?.lrc), [current]);
  const lyricIndex = activeLyricIndex(lyrics, currentTime);
  const progress = duration > 0 ? currentTime / duration : 0;

  /* 默认播放：
     ① 先尝试“带声音自动播放”（浏览器允许时最理想）；
     ② 若被自动播放策略拦截 → 立即以【静音】状态自动开播（动画/进度照常跑），
        并提示“点击页面开启声音”，任意一次点击即切到默认音量；
     ③ 极端情况（连静音播放都被拒）→ 首次任意点击时才开始。 */
  const autoStartedRef = useRef(false);
  useEffect(() => {
    const a = getAudio();
    const first = tracks[0];
    if (!a || !first?.src) return;

    const timer = setTimeout(() => {
      if (autoStartedRef.current) return;
      autoStartedRef.current = true;

      const boot = (mute: boolean) => {
        a.muted = mute;
        a.src = asset(first.src);
        a.volume = mute || mutedRef.current ? 0 : volumeRef.current;
        a.load();
        return a.play();
      };

      const addUnlock = () => {
        const unlock = () => {
          document.removeEventListener("pointerdown", unlock);
          document.removeEventListener("keydown", unlock);
          const el = audioRef.current;
          if (!el) return;
          el.muted = mutedRef.current ? true : false;
          el.volume = mutedRef.current ? 0 : volumeRef.current;
          setTapToSound(false);
          if (el.paused) startAt(0);
        };
        document.addEventListener("pointerdown", unlock);
        document.addEventListener("keydown", unlock);
      };

      boot(false)
        .then(() => {
          setStarted(true);
          setPlaying(true);
        })
        .catch(() => {
          boot(true)
            .then(() => {
              setStarted(true);
              setPlaying(true);
              setTapToSound(true);
              addUnlock();
            })
            .catch(() => {
              addUnlock();
            });
        });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
      {current && (
        <>
          {!expanded &&
            (started ? (
              <PlayerDock
                track={current}
                playing={playing}
                started={started}
                currentTime={currentTime}
                duration={duration}
                progress={progress}
                onToggle={toggle}
                onNext={() => step(1)}
                onExpand={() => setExpanded(true)}
              />
            ) : (
              <LaunchButton onClick={() => setExpanded(true)} />
            ))}
          {tapToSound && (
            <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[65] flex justify-center px-4">
              <div className="glass-strong animate-pulse rounded-full px-4 py-2 text-xs font-bold text-[var(--ink)]">
                ♪ 音乐已开始播放，点击页面任意位置开启声音
              </div>
            </div>
          )}
          <PlayerOverlay
            open={expanded}
            tracks={tracks}
            current={current}
            index={index}
            playing={playing}
            started={started}
            currentTime={currentTime}
            duration={duration}
            progress={progress}
            volume={volume}
            muted={muted}
            repeat={repeat}
            lyrics={lyrics}
            lyricIndex={lyricIndex}
            onClose={() => setExpanded(false)}
            onToggle={toggle}
            onNext={() => step(1)}
            onPrev={() => step(-1)}
            onSeek={seek}
            onPlayAt={startAt}
            onVolume={changeVolume}
            onToggleMute={toggleMute}
            onCycleRepeat={cycleRepeat}
          />
        </>
      )}
    </>
  );
}
