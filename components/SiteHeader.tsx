"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Folder,
  Home,
  Menu,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import siteConfig from "@/siteConfig";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "首页", Icon: Home },
  { href: "/posts", label: "文章", Icon: FileText },
  { href: "/projects", label: "项目", Icon: Folder },
  { href: "/chatters", label: "杂谈", Icon: MessageSquare },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname === "/index.html" : pathname.startsWith(href);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
      <div className="glass-strong pointer-events-auto relative w-full max-w-5xl rounded-2xl px-3 py-2.5 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          {/* 品牌 */}
          <Link
            href="/"
            aria-label={siteConfig.title}
            className="group flex min-w-0 items-center gap-2.5 rounded-xl px-1 py-0.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#39C5BB] via-[#ff9ec7] to-[#ff5c9e] text-white shadow-lg shadow-pink-400/25">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="truncate text-[15px] font-extrabold tracking-tight text-[var(--ink)]">
              {siteConfig.titleShort}
            </span>
          </Link>

          {/* 桌面导航 */}
          <nav aria-label="主导航" className="hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-[#39C5BB] to-[#ff9ec7] text-white shadow-md shadow-pink-400/25"
                      : "text-[var(--ink-2)] hover:bg-black/5 hover:text-[var(--ink)] dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "关闭菜单" : "打开菜单"}
              aria-expanded={open}
              className="glass flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:text-[var(--ink)] md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* 移动端展开菜单 */}
        {open && (
          <nav
            aria-label="移动端导航"
            className="mt-2 flex flex-col gap-1 border-t border-[var(--glass-brd)] pt-2 md:hidden"
          >
            {NAV.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-gradient-to-r from-[#39C5BB] to-[#ff9ec7] text-white"
                      : "text-[var(--ink-2)] hover:bg-black/5 hover:text-[var(--ink)] dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
