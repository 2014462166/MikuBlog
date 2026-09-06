"use client";

import { useEffect, useState } from "react";
import siteConfig from "@/siteConfig";

/** 打字机效果：循环展示 siteConfig.hero.typed 里的文案 */
export default function TypedHero() {
  const roles = siteConfig.hero.typed;
  const [wordIdx, setWordIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = roles[wordIdx % roles.length];
    let delay = deleting ? 38 : 92;
    if (!deleting && text === word) {
      delay = 1700;
      const t = setTimeout(() => setDeleting(true), delay);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      delay = 350;
      const t = setTimeout(() => {
        setDeleting(false);
        setWordIdx((i) => i + 1);
      }, delay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setText(word.slice(0, text.length + (deleting ? -1 : 1))),
      delay,
    );
    return () => clearTimeout(t);
  }, [text, deleting, wordIdx, roles]);

  return (
    <span className="font-bold">
      <span className="text-gradient">{text}</span>
      <span
        className="ml-1 inline-block h-[1.05em] w-[2.5px] translate-y-[3px] animate-pulse rounded-full bg-[var(--accent)] align-baseline"
        aria-hidden
      />
    </span>
  );
}
