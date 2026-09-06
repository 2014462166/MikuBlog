import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  FileText,
  Folder,
  ImageUp,
  MessageSquare,
} from "lucide-react";
import siteConfig from "@/siteConfig";
import { getAllChatters, getAllPosts } from "@/lib/content";
import { publicPathExists } from "@/lib/public-file";
import { projectsData } from "@/data/projects";
import PostCard from "@/components/PostCard";
import TypedHero from "@/components/TypedHero";

function SectionHeader({
  icon,
  title,
  subtitle,
  moreHref,
  moreLabel,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-[var(--ink)] sm:text-2xl">
          {icon}
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--ink-3)]">{subtitle}</p>
        )}
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--ink-2)] transition hover:text-[var(--accent)]"
        >
          {moreLabel ?? "查看全部"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const posts = getAllPosts();
  const chatters = getAllChatters();
  const hasAvatar = publicPathExists(siteConfig.avatar);
  const featuredPosts = posts.slice(0, 3);
  const latestChatters = chatters.slice(0, 3);
  const featuredProjects = projectsData.filter((p) => p.featured).slice(0, 2);

  const categories = [
    {
      href: "/posts",
      label: "文章",
      desc: "技术踩坑 · 学习笔记 · 深度长文",
      count: posts.length,
      Icon: FileText,
      gradient: "from-[#39C5BB] to-[#ff9ec7]",
    },
    {
      href: "/projects",
      label: "项目",
      desc: "我折腾过的工具与小作品",
      count: projectsData.length,
      Icon: Folder,
      gradient: "from-[#06b6d4] to-[#22d3ee]",
    },
    {
      href: "/chatters",
      label: "杂谈",
      desc: "碎片记录 · 灵感与生活",
      count: chatters.length,
      Icon: MessageSquare,
      gradient: "from-[#ff5c9e] to-[#fb7185]",
    },
  ];

  return (
    <>
      {/* ============ Hero ============ */}
      <section className="anim-rise grid grid-cols-1 items-center gap-10 pt-4 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <span className="chip mb-5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            {siteConfig.hero.greeting}
          </span>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-[var(--ink)] sm:text-5xl">
            {siteConfig.author}
          </h1>
          <p className="mt-3 min-h-[2.6rem] text-lg text-[var(--ink-2)] sm:text-xl">
            <TypedHero />
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-[var(--ink-2)]">
            {siteConfig.bio}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/posts" className="btn btn-primary">
              <FileText className="h-4 w-4" />
              浏览文章
            </Link>
            <Link href="/projects" className="btn btn-ghost">
              <Folder className="h-4 w-4" />
              看看项目
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ink-3)]">
            <span>
              <b className="text-base font-extrabold text-[var(--ink)]">{posts.length}</b> 篇文章
            </span>
            <span>
              <b className="text-base font-extrabold text-[var(--ink)]">{projectsData.length}</b> 个项目
            </span>
            <span>
              <b className="text-base font-extrabold text-[var(--ink)]">{chatters.length}</b> 条杂谈
            </span>
            <span>
              <b className="text-base font-extrabold text-[var(--ink)]">{siteConfig.since}</b> 建站
            </span>
          </div>
        </div>

        {/* 头像卡片 */}
        <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px]">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-[#39C5BB]/40 via-[#ff9ec7]/30 to-[#22d3ee]/30 blur-2xl"
            />
            {hasAvatar ? (
              <div className="glass-strong relative overflow-hidden rounded-full p-2.5">
                <div className="relative aspect-square overflow-hidden rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={siteConfig.avatar}
                    alt={`${siteConfig.author} 的头像`}
                    className="h-full w-full object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/10"
                  />
                </div>
              </div>
            ) : (
              /* TODO 占位：等你在 public/ 放入头像 */
              <div className="glass-strong relative overflow-hidden rounded-full p-2.5">
                <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed border-[#ff9ec7]/50 bg-gradient-to-br from-[#39C5BB]/10 to-[#ff9ec7]/10 px-6 text-center">
                  <ImageUp className="h-7 w-7 text-[var(--accent)]" />
                  <p className="text-lg font-black tracking-[0.35em] text-[var(--ink)]">
                    TODO
                  </p>
                  <p className="text-[11px] leading-relaxed text-[var(--ink-3)]">
                    把头像放到 public/avatar.png
                    <br />
                    （siteConfig.ts → avatar 已默认该路径）
                  </p>
                </div>
              </div>
            )}

            {/* 状态浮签 */}
            <div className="glass-strong absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--ink-2)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              敲代码中…
            </div>
            <div className="glass-strong absolute -right-3 top-8 hidden rotate-6 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[var(--ink-2)] sm:block">
              ✦ {siteConfig.role.split("·")[0]}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 分类导览 ============ */}
      <section>
        <SectionHeader
          title="分类导览"
          subtitle="文章、项目、杂谈，三种不同的记录方式"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {categories.map(({ href, label, desc, count, Icon, gradient }, i) => (
            <Link
              key={href}
              href={href}
              className="glass group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-20px_var(--shadow-color)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                aria-hidden
                className={`absolute -right-8 -top-8 h-28 w-28 rounded-3xl bg-gradient-to-br ${gradient} opacity-20 blur-xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-40`}
              />
              <div className="relative">
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="mt-4 flex items-center justify-between">
                  <h3 className="text-lg font-extrabold text-[var(--ink)]">{label}</h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-[var(--ink-3)]">
                    {count} 篇
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--ink-3)]">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ 最新文章 ============ */}
      {featuredPosts.length > 0 && (
        <section>
          <SectionHeader
            icon={<FileText className="h-5 w-5 text-[var(--accent)]" />}
            title="最新文章"
            subtitle="按时间倒序排列，记录每一次折腾"
            moreHref="/posts"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((p) => (
              <PostCard
                key={p.slug}
                post={{
                  slug: p.slug,
                  title: p.title,
                  description: p.description,
                  date: p.date,
                  tags: p.tags,
                  featured: p.featured,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ============ 重点项目 ============ */}
      {featuredProjects.length > 0 && (
        <section>
          <SectionHeader
            icon={<Folder className="h-5 w-5 text-[var(--accent)]" />}
            title="重点项目"
            subtitle="精选放在首页的几个作品"
            moreHref="/projects"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featuredProjects.map((p) => (
              <div key={p.name} className="glass group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_var(--shadow-color)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{p.icon}</span>
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${p.name} 外链`}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--glass-brd)] text-[var(--ink-2)] transition group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#39C5BB] group-hover:to-[#ff9ec7] group-hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <h3 className="mt-3 font-bold text-[var(--ink)]">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--ink-2)]">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map((t) => (
                    <span key={t} className="chip cursor-default">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ 最新杂谈 ============ */}
      {latestChatters.length > 0 && (
        <section>
          <SectionHeader
            icon={<MessageSquare className="h-5 w-5 text-[var(--accent)]" />}
            title="最新杂谈"
            subtitle="短小的碎片，也值得被好好记录"
            moreHref="/chatters"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {latestChatters.map((c) => (
              <Link
                key={c.slug}
                href={`/chatters/${c.slug}`}
                className="glass group flex flex-col rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_var(--shadow-color)]"
              >
                <div className="flex items-center justify-between text-xs text-[var(--ink-3)]">
                  <span className="text-sm">{c.mood}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {c.date ? c.date.slice(0, 10).replace(/-/g, ".") : ""}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-[15px] font-semibold leading-relaxed text-[var(--ink)]">
                  {c.description || c.content.replace(/^#+\s*/gm, "").slice(0, 80)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-[var(--ink-3)] transition group-hover:text-[var(--accent)]">
                  继续阅读
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
