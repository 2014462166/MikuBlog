"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";

  if (!mounted) {
    return (
      <button
        type="button"
        aria-hidden
        className="glass pointer-events-none h-9 w-9 rounded-full opacity-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "切换到日间模式" : "切换到夜间模式"}
      title={dark ? "切换到日间" : "切换到夜间"}
      className="glass relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-[var(--ink-2)] transition hover:text-[var(--ink)]"
    >
      <Sun
        className={`absolute h-[17px] w-[17px] transition-all duration-500 ${
          dark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-50 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-[17px] w-[17px] transition-all duration-500 ${
          dark
            ? "rotate-90 scale-50 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
    </button>
  );
}
