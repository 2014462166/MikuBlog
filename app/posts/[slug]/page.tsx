import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getAllPosts, getPost } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { markdownToHtml } from "@/lib/markdown";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "文章不存在" };
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const plainLen = post.content.replace(/[#>*`\-\d.\[\]()!|]/g, "").trim().length;

  return (
    <article>
      {/* 返回 */}
      <Link
        href="/posts"
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-[var(--ink-2)] transition hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" />
        返回文章列表
      </Link>

      <div className="glass mt-3 overflow-hidden rounded-[1.8rem]">
        {/* 顶部渐变横幅 */}
        <div
          aria-hidden
          className="relative h-2 w-full bg-gradient-to-r from-[#39C5BB] via-[#ff9ec7] to-[#ff5c9e]"
        />

        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--ink-3)]">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span>·</span>
            <span>约 {plainLen > 0 ? plainLen : post.content.length} 字</span>
            {post.tags.length > 0 && (
              <>
                <span>·</span>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span key={t} className="chip cursor-default">
                      # {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <h1 className="mt-4 text-2xl font-black leading-snug text-[var(--ink)] sm:text-4xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-3 border-l-2 border-[var(--accent)] pl-4 text-[15px] leading-relaxed text-[var(--ink-2)]">
              {post.description}
            </p>
          )}

          <div className="mt-8">
            {/* 渲染后的 Markdown */}
            <div
              className="md-body"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
