"use client";

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/** next-themes 的 class 策略 + system 支持（html 上挂 .dark） */
export function ThemeProvider(props: ThemeProviderProps) {
  return <NextThemesProvider {...props} />;
}
