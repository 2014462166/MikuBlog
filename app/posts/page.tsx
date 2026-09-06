import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { getAllPosts } from "@/lib/content";
import PostList from "@/components/PostList";

export const metadata: Metadata = {
  title: "文章",
  description: "技术笔记与深度长文归档。",
};

export default function PostsPage() {
  const posts = getAllPosts();
  return (
    <>
      <section className="mt-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#39C5BB] to-[#ff9ec7] text-white shadow-lg shadow-pink-400/25">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)]">文章归档</h1>
            <p className="text-sm text-[var(--ink-3)]">
              共 {posts.length} 篇 · 点击标签或搜索快速筛选
            </p>
          </div>
        </div>
      </section>
      <PostList
        posts={posts.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          date: p.date,
          tags: p.tags,
          featured: p.featured,
        }))}
      />
    </>
  );
}
