import { BookOpen } from "lucide-react";
import type { TocItem } from "@/lib/markdown";

/** 文章「本页概览」：左侧流水线时间轴，点击标题跳转到正文对应小标题 */
export default function ArticleToc({ items }: { items: TocItem[] }) {
  const visible = items.filter((i) => i.level >= 2 && i.level <= 4);
  if (visible.length === 0) return null;

  return (
    <nav aria-label="文章概览" className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
        <BookOpen className="h-4 w-4 text-[var(--accent)]" />
        本页概览
        <span className="rounded-full bg-[var(--glass-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--ink-3)]">
          {visible.length}
        </span>
      </p>

      <ol className="mt-3">
        {visible.map((item, idx) => {
          const last = idx === visible.length - 1;
          const isH3 = item.level === 3;
          return (
            <li key={item.id} className="relative grid grid-cols-[18px_minmax(0,1fr)] items-baseline gap-x-2 pb-2.5">
              {/* 节点 */}
              <span className="relative flex justify-center" aria-hidden>
                {isH3 ? (
                  <span className="mt-[9px] h-[7px] w-[7px] rounded-full border-2 border-[var(--ink-3)] bg-transparent" />
                ) : (
                  <span className="relative mt-[6px] flex h-[11px] w-[11px] items-center justify-center">
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "color-mix(in srgb, var(--accent) 25%, transparent)",
                      }}
                    />
                    <span className="relative h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
                  </span>
                )}
              </span>

              {/* 标题 */}
              <a
                href={`#${item.id}`}
                className={`block rounded-md py-1 text-[13px] leading-snug transition hover:text-[var(--accent)] ${
                  isH3
                    ? "pl-1 text-[var(--ink-3)]"
                    : "font-semibold text-[var(--ink-2)]"
                }`}
              >
                {item.text}
              </a>

              {/* 流水线竖线（节点之间的连接线） */}
              {!last && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-[8px] top-[20px] bottom-[-6px] w-[2px]"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--accent) 55%, transparent), color-mix(in srgb, var(--accent) 15%, transparent))",
                  }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
