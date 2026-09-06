"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import PostCard, { type PostCardData } from "./PostCard";

export default function PostList({ posts }: { posts: PostCardData[] }) {
  const [tag, setTag] = useState<string>("全部");
  const [query, setQuery] = useState("");

  const tags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => (p.tags ?? []).forEach((t) => set.add(t)));
    return Array.from(set);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const okTag = tag === "全部" || (p.tags ?? []).includes(tag);
      const okQ = !q || p.title.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
      return okTag && okQ;
    });
  }, [posts, tag, query]);

  return (
    <div>
      {/* 筛选区 */}
      <div className="glass-soft flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTag("全部")}
            className={`chip ${tag === "全部" ? "chip-active" : ""}`}
          >
            全部 {posts.length}
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`chip ${tag === t ? "chip-active" : ""}`}
            >
              # {t}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-[var(--glass-brd)] bg-[var(--glass-bg)] px-3 py-1.5 sm:w-56">
          <Search className="h-4 w-4 shrink-0 text-[var(--ink-3)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章…"
            className="w-full bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--ink-3)]"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-10 text-center text-sm text-[var(--ink-3)]">
          没有找到匹配的内容，换个关键词或标签试试吧～
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
