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
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("all");
  const [expanded, setExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const repeatRef = useRef<RepeatMode>("all");
  const volumeRef = useRef(0.85);
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
      const v = localStorage.getItem(VOLUME_KEY);
      if (v !== null) setVolume(Number(v));
      setMuted(localStorage.getItem(MUTE_KEY) === "1");
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
