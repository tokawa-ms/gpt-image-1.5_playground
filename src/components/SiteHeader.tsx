"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/client";

// 全ページ共通のヘッダー
export function SiteHeader() {
  const { locale, setLocale, supportedLocales, t } = useI18n();
  const links = [
    { href: "/", label: t("header.nav.home") },
    { href: "/items", label: t("header.nav.playground") },
    { href: "/about", label: t("header.nav.about") },
    { href: "/settings", label: t("header.nav.settings") },
    { href: "/login", label: t("header.nav.login") },
  ];

  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        {/* 左側: ブランド表示 */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold text-white">
            GI
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("header.brandTitle")}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("header.brandSubtitle")}
            </p>
          </div>
        </div>
        {/* 右側: ページ遷移 */}
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-300">
            <label htmlFor="language-select" className="font-semibold">
              {t("header.language.label")}
            </label>
            <select
              id="language-select"
              value={locale}
              onChange={(event) => setLocale(event.target.value as typeof locale)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
            >
              {supportedLocales.map((option) => (
                <option key={option} value={option}>
                  {t(`header.language.options.${option}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
