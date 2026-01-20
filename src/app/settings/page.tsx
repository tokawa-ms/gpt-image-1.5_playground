import { getServerI18n } from "@/lib/i18n/server";

// 設定ガイドページ（UI からの変更は不可）
export default async function SettingsPage() {
  const { t } = await getServerI18n();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {t("settings.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {t("settings.description")}
        </p>
      </header>
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        {/* 主な環境変数を一覧表示 */}
        <p className="mb-3 font-semibold">{t("settings.sectionTitle")}</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>AZURE_OPENAI_ENDPOINT</li>
          <li>AZURE_OPENAI_DEPLOYMENT_NAME</li>
          <li>OPENAI_API_VERSION</li>
          <li>
            PROMPT_TEMPLATES_DIR
            <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
              ({t("settings.optional")})
            </span>
          </li>
          <li>AUTH_USERNAME</li>
          <li>AUTH_PASSWORD</li>
        </ul>
      </section>
    </div>
  );
}
