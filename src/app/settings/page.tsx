// 設定ガイドページ（UI からの変更は不可）
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          設定
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          環境変数で Azure OpenAI の接続情報を設定します。UI では設定変更は行いません。
        </p>
      </header>
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        {/* 主な環境変数を一覧表示 */}
        <p className="mb-3 font-semibold">主な環境変数</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>AZURE_OPENAI_ENDPOINT</li>
          <li>AZURE_OPENAI_DEPLOYMENT_NAME</li>
          <li>OPENAI_API_VERSION</li>
          <li>PROMPT_TEMPLATES_DIR（任意）</li>
          <li>AUTH_USERNAME</li>
          <li>AUTH_PASSWORD</li>
        </ul>
      </section>
    </div>
  );
}
