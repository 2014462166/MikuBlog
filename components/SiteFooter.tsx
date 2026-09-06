import Link from "next/link";
import { Heart, Mail } from "lucide-react";
import siteConfig from "@/siteConfig";
import { GitHubIcon } from "@/components/icons";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/projects", label: "项目" },
  { href: "/chatters", label: "杂谈" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = siteConfig.socials;

  return (
    <footer className="relative mx-auto mt-16 w-full max-w-5xl px-4 pb-28 sm:px-6 md:pb-24">
      <div className="glass rounded-3xl px-6 py-8 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-lg font-extrabold text-[var(--ink)]">
              {siteConfig.titleShort}
            </p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-[var(--ink-3)]">
              {siteConfig.bio}
            </p>
          </div>

          <nav aria-label="页脚导航" className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-[var(--ink-2)] transition hover:text-[var(--accent)]"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {socials.github && (
              <a
                href={socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:-translate-y-0.5 hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <GitHubIcon className="h-[18px] w-[18px]" />
              </a>
            )}
            {socials.email && (
              <a
                href={`mailto:${socials.email}`}
                aria-label="邮箱"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink-2)] transition hover:-translate-y-0.5 hover:text-[var(--ink)] hover:bg-black/5 dark:hover:bg-white/10"
              >
                <Mail className="h-[18px] w-[18px]" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-[var(--glass-brd)] pt-5 text-xs text-[var(--ink-3)] sm:flex-row sm:items-center">
          <p>
            © {siteConfig.since === year ? year : `${siteConfig.since} – ${year}`}{" "}
            {siteConfig.author}
          </p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> by{" "}
            <span className="font-semibold text-[var(--ink-2)]">{siteConfig.author}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
