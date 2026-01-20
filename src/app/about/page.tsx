// 使い方説明ページ
export default function AboutPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          使い方
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          GPT-Image-1.5 の画像編集 API を利用して、参照画像を編集します。
        </p>
      </header>
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-6 text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
        {/* 手順を番号付きで表示 */}
        <ol className="list-decimal space-y-3 pl-5">
          <li>Playground ページで参照画像（PNG/JPG）をアップロードします。</li>
          <li>自由形式のプロンプトを入力します（テンプレートも利用できます）。</li>
          <li>編集オプションを必要に応じて調整します。</li>
          <li>実行すると、編集された画像がプレビューされます。</li>
        </ol>
      </section>
    </div>
  );
}
