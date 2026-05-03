"use client";

import { useEffect } from "react";
import { useThemeStore } from "../../store/themeStore";

export default function ThemeInitializer() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    const cleanup = initTheme();
    return () => cleanup?.();
  }, [initTheme]);

  return null;
}
