import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getAllChatters, getChatter } from "@/lib/content";
import { formatDate } from "@/lib/date";
import { renderMarkdown } from "@/lib/markdown";
import ArticleToc from "@/components/ArticleToc";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllChatters().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getChatter(slug);
  if (!c) return { title: "杂谈不存在" };
  return { title: c.title, description: c.description ?? undefined };
}

export default async function ChatterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chatter = getChatter(slug);
  if (!chatter) notFound();

  const { html, toc } = await renderMarkdown(chatter.content);

  return (
    <article>
      <Link
        href="/chatters"
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium text-[var(--ink-2)] transition hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10"
      >
        <ArrowLeft className="h-4 w-4" />
        返回杂谈列表
      </Link>

      <div className="glass mt-3 overflow-hidden rounded-[1.8rem]">
        <div
          aria-hidden
          className="relative h-2 w-full bg-gradient-to-r from-[#ff5c9e] via-[#ff9ec7] to-[#39C5BB]"
        />
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-3)]">
            {chatter.mood && <span className="text-base">{chatter.mood}</span>}
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(chatter.date)}
            </span>
          </div>
          <h1 className="mt-3 text-2xl font-black leading-snug text-[var(--ink)] sm:text-3xl">
            {chatter.title}
          </h1>

          <div className="mt-6">
            <div
              className="md-body max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
