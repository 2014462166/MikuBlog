"use client";

import { useEffect, useState } from "react";

/** 全屏背景图淡入淡出轮播 */
export default function BackgroundSlideshow({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(
      () => setActive((v) => (v + 1) % images.length),
      8000,
    );
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div aria-hidden className="absolute inset-0">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
