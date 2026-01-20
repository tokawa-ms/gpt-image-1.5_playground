import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { LocaleProvider } from "@/lib/i18n/client";
import { getServerI18n } from "@/lib/i18n/server";

// UI 全体で使うフォントを読み込む
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 等幅フォント（コード表示など）に使用
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ページのメタ情報（タイトル・説明文）
export const metadata: Metadata = {
  title: "GPT-Image 1.5 Playground",
  description: "Azure AI Foundry GPT-Image-1.5 image edit playground",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, t } = await getServerI18n();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50`}
      >
        {/* ヘッダー・メイン・フッターを持つ全体レイアウト */}
        <LocaleProvider initialLocale={locale}>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
              {children}
            </main>
            <footer className="border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {t("footer.text")}
            </footer>
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
