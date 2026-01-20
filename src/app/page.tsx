import Link from "next/link";

// ランディングページ
export default function Home() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl bg-white p-10 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        {/* ヒーロー領域 */}
        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
          Azure AI Foundry
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-zinc-900 dark:text-white">
          GPT-Image-1.5 画像編集プレイグラウンド
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
          参照画像をアップロードし、プロンプトと各種オプションを調整して画像編集を実行できます。
          プロンプトテンプレートもサーバ上のテキストファイルとして管理します。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {/* CTA */}
          <Link
            href="/items"
            className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
          >
            画像編集を開始
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            使い方を見る
          </Link>
        </div>
      </section>
      {/* 右カラム: 特長一覧 */}
      <section className="space-y-4">
        {[
          {
            title: "完全な編集オプション",
            body: "サイズ、品質、入力忠実度、背景、出力形式など全オプションをフォームから指定可能。",
          },
          {
            title: "テンプレート管理",
            body: "prompt-templates ディレクトリの .txt を自動読み込みして即時利用。",
          },
          {
            title: "Azure 認証",
            body: "DefaultAzureCredential を利用し、ローカルは Azure CLI、ACA では Managed Identity を想定。",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {card.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {card.body}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
