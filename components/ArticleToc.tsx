import { BookOpen } from "lucide-react";
import type { TocItem } from "@/lib/markdown";

/** 文章「本页概览」：点击标题跳转到正文对应小标题 */
export default function ArticleToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  const visible = items.filter((i) => i.level >= 2 && i.level <= 4);

  return (
    <div className="glass-soft mt-6 rounded-2xl p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
        <BookOpen className="h-4 w-4 text-[var(--accent)]" />
        本页概览
        <span className="rounded-full bg-[var(--glass-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--ink-3)]">
          {visible.length}
        </span>
      </p>

      <nav aria-label="文章概览" className="mt-3 grid grid-cols-1 gap-x-3 gap-y-0.5 sm:grid-cols-2">
        {visible.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`group flex items-start gap-1.5 rounded-lg px-2 py-1.5 text-[13px] leading-snug transition hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/5 ${
              item.level === 3 ? "pl-6 text-[var(--ink-3)]" : "font-medium text-[var(--ink-2)]"
            }`}
          >
            <span
              aria-hidden
              className={`mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full ${
                item.level === 2 ? "bg-[var(--accent)]" : "bg-[var(--ink-3)] opacity-60"
              }`}
            />
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
