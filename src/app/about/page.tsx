import { getServerI18n } from "@/lib/i18n/server";

// 使い方説明ページ
export default async function AboutPage() {
  const { t } = await getServerI18n();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {t("about.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {t("about.description")}
        </p>
      </header>
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        {/* 手順を番号付きで表示 */}
        <ol className="list-decimal space-y-3 pl-5">
          <li>{t("about.steps.step1")}</li>
          <li>{t("about.steps.step2")}</li>
          <li>{t("about.steps.step3")}</li>
          <li>{t("about.steps.step4")}</li>
        </ol>
      </section>
    </div>
  );
}
