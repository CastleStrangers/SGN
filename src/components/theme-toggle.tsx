"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ThemeToggle() {
  const t = useTranslations('common');
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={!mounted ? "" : resolvedTheme === "dark" ? t('dayMode') : t('nightMode')}
      suppressHydrationWarning
    >
      <Sun className="w-5 h-5 hidden dark:block text-yellow-400" />
      <Moon className="w-5 h-5 block dark:hidden text-gray-600" />
    </button>
  );
}
