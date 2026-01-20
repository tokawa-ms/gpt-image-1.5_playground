"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

// 簡易認証用のログインページ
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 直前の遷移先があればそこへ戻す
  const nextPath = useMemo(() => {
    const raw = searchParams.get("next");
    return raw && raw.startsWith("/") ? raw : "/";
  }, [searchParams]);

  // 入力フォームの状態
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 認証 API に送信し、成功したらリダイレクト
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { message?: string };
        setError(payload.message ?? "ログインに失敗しました。");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      console.error("Login request failed", error);
      setError("ログインに失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          ログイン
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          環境変数で設定したユーザー名とパスワードを入力してください。
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            ユーザー名
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-indigo-500/40"
              required
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            パスワード
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-indigo-500/40"
              required
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </div>
  );
}
