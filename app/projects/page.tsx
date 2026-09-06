import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Folder } from "lucide-react";
import { projectsData } from "@/data/projects";
import { GitHubIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "项目",
  description: "我折腾过的工具与作品。",
};

export default function ProjectsPage() {
  return (
    <>
      <section className="mt-2">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] text-white shadow-lg shadow-cyan-500/25">
            <Folder className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-[var(--ink)]">项目陈列</h1>
            <p className="text-sm text-[var(--ink-3)]">
              共 {projectsData.length} 个 · 在 data/projects.ts 中维护
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projectsData.map((p) => (
          <div
            key={p.name}
            className="glass group relative flex flex-col overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_-24px_var(--shadow-color)]"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-cyan-400/20 to-pink-300/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="relative flex items-start justify-between gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/50 text-2xl shadow-sm dark:bg-white/10">
                {p.icon ?? "📦"}
              </span>
              <div className="flex items-center gap-1.5">
                {p.featured && (
                  <span className="rounded-full bg-gradient-to-r from-[#39C5BB] to-[#ff9ec7] px-2 py-0.5 text-[11px] font-semibold text-white">
                    精选
                  </span>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.name} 链接`}
                    title="访问"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-brd)] text-[var(--ink-2)] transition hover:border-transparent hover:bg-gradient-to-r hover:from-[#39C5BB] hover:to-[#ff9ec7] hover:text-white"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {p.github && (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${p.name} 的 GitHub`}
                    title="GitHub"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-brd)] text-[var(--ink-2)] transition hover:border-transparent hover:bg-gradient-to-r hover:from-[#39C5BB] hover:to-[#ff9ec7] hover:text-white"
                  >
                    <GitHubIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <h2 className="relative mt-4 text-xl font-extrabold text-[var(--ink)]">
              {p.name}
            </h2>
            <p className="relative mt-2 flex-1 text-sm leading-relaxed text-[var(--ink-2)]">
              {p.description}
            </p>
            {p.highlight && (
              <p className="relative mt-2 text-xs font-medium text-[var(--accent)]">
                ✦ {p.highlight}
              </p>
            )}

            <div className="relative mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="chip cursor-default">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass mt-6 rounded-2xl p-5 text-center text-sm text-[var(--ink-3)]">
        想在这里展示你的项目？编辑
        <code className="mx-1 rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
          data/projects.ts
        </code>
        即可（支持跳转到你的仓库 / 在线地址）。
      </div>
    </>
  );
}
