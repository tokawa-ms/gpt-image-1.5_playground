import Link from "next/link";

// グローバルナビゲーションのリンク一覧
const links = [
  { href: "/", label: "Home" },
  { href: "/items", label: "Playground" },
  { href: "/about", label: "About" },
  { href: "/settings", label: "Settings" },
  { href: "/login", label: "Login" },
];

// 全ページ共通のヘッダー
export function SiteHeader() {
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
              GPT-Image 1.5 Playground
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Azure AI Foundry Image Edit
            </p>
          </div>
        </div>
        {/* 右側: ページ遷移 */}
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
      </div>
    </header>
  );
}
