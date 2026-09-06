import Link from "next/link";
import { ArrowRight, CalendarDays, Pin } from "lucide-react";
import { formatDate } from "@/lib/date";

export type PostCardData = {
  slug: string;
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
};

export default function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="glass group relative block overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_var(--shadow-color)] sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-teal-400/20 to-pink-300/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--ink-3)]">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {formatDate(post.date)}
        </span>
        {post.featured && (
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#39C5BB] to-[#ff5c9e] px-2 py-0.5 text-[11px] font-semibold text-white">
            <Pin className="h-3 w-3" />
            置顶
          </span>
        )}
      </div>

      <h3 className="relative mt-3 text-lg font-bold leading-snug text-[var(--ink)] transition-colors group-hover:text-[var(--accent)] sm:text-xl">
        {post.title}
      </h3>
      {post.description && (
        <p className="relative mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-2)]">
          {post.description}
        </p>
      )}

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(post.tags ?? []).slice(0, 3).map((t) => (
            <span key={t} className="chip cursor-default">
              # {t}
            </span>
          ))}
        </div>
        <span
          aria-hidden
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--glass-brd)] text-[var(--ink-2)] transition-all duration-300 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#39C5BB] group-hover:to-[#ff9ec7] group-hover:text-white"
        >
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
        </span>
      </div>
    </Link>
  );
}
