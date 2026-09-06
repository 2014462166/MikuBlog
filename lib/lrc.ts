export type LyricLine = { time: number; text: string };

/** 解析简易 LRC：每行形如 "[mm:ss.xx] 歌词" / "[mm:ss] 歌词" */
export function parseLrc(lrcText?: string): LyricLine[] {
  if (!lrcText) return [];
  const lines: LyricLine[] = [];
  const re = /\[(\d{1,2}):(\d{1,2})(?:[.:](\d{1,3}))?\]/g;
  for (const raw of lrcText.split("\n")) {
    const matches = Array.from(raw.matchAll(re));
    if (matches.length === 0) continue;
    const text = raw.replace(re, "").trim();
    if (!text) continue;
    for (const m of matches) {
      const min = parseInt(m[1], 10);
      const sec = parseInt(m[2], 10);
      const frac = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) : 0;
      lines.push({ time: min * 60 + sec + frac / 1000, text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/** 给定当前时间返回应高亮的歌词行索引（-1 表示无） */
export function activeLyricIndex(lines: LyricLine[], time: number): number {
  if (lines.length === 0) return -1;
  if (time < lines[0].time) return -1;
  let idx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (time >= lines[i].time) idx = i;
    else break;
  }
  return idx;
}
