import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageSquare } from "lucide-react";
import { getAllChatters } from "@/lib/content";
import { formatDate } from "@/lib/date";

export const metadata: Metadata = {
  title: "杂谈",
  description: "碎片记录、灵感与生活里的句子。",
};

function excerpt(c: { description?: string; content: string }) {
  const d = (c.description ?? "").trim();
  if (d) return d;
  const raw = c.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*`|-]/g, "")
    .trim();
  return raw.slice(0, 90) + (raw.length > 90 ? "…" : "");
}

export default function ChattersPage() {
  const chatters = getAllChatters();

  return (
    <>
      <section className="mt-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff5c9e] to-[#fb7185] text-white shadow-lg shadow-rose-400/25">
            <MessageSquare className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)]">杂谈</h1>
            <p className="text-sm text-[var(--ink-3)]">
              共 {chatters.length} 条 · 在 content/chatters/ 中添加 .md 即可
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4">
        {chatters.map((c, i) => (
          <Link
            key={c.slug}
            href={`/chatters/${c.slug}`}
            className="glass group relative overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_var(--shadow-color)] sm:p-6"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#ff5c9e] via-[#ff9ec7] to-[#39C5BB] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-5">
              {/* 序号徽标 */}
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff5c9e]/20 to-[#ff9ec7]/20 text-lg font-black text-transparent sm:flex [background-clip:text] [-webkit-background-clip:text] [background-image:linear-gradient(135deg,#ff5c9e,#ff9ec7)]">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--ink-3)]">
                  {c.mood && <span className="text-sm">{c.mood}</span>}
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(c.date)}
                  </span>
                </div>
                <h2 className="mt-1.5 text-lg font-bold text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                  {c.title}
                </h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--ink-2)]">
                  {excerpt(c)}
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-[var(--glass-brd)] text-[var(--ink-2)] transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#ff5c9e] group-hover:to-[#ff9ec7] group-hover:text-white sm:self-start">
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-[-45deg]" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
