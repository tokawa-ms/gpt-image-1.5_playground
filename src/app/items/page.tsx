"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/client";

// テンプレート一覧の最小構造
type TemplateSummary = {
  name: string;
};

// 画像編集 API のレスポンス（必要部分のみ）
type ImageEditResponse = {
  created?: number;
  data?: Array<{ b64_json: string }>;
  error?: { code?: string; message?: string };
};

// 画面で選択可能なオプションの一覧
const sizeOptions = ["1024x1024", "1024x1536", "1536x1024"] as const;
const qualityOptions = ["low", "medium", "high"] as const;
const outputFormatOptions = ["png", "jpeg"] as const;
const inputFidelityOptions = ["low", "medium", "high"] as const;

export default function ItemsPage() {
  const { t } = useI18n();

  // テンプレート・入力値・UI 状態
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [prompt, setPrompt] = useState<string>("");
  const [promptLibraryLoading, setPromptLibraryLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [maskFile, setMaskFile] = useState<File | null>(null);

  // 画像編集パラメータ
  const [size, setSize] = useState<(typeof sizeOptions)[number]>("1024x1024");
  const [quality, setQuality] = useState<(typeof qualityOptions)[number]>("medium");
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [model, setModel] = useState<string>("gpt-image-1.5");
  const [user, setUser] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputFidelity, setInputFidelity] = useState<
    (typeof inputFidelityOptions)[number]
  >("high");
  const [outputFormat, setOutputFormat] = useState<
    (typeof outputFormatOptions)[number]
  >("png");
  const [outputCompression, setOutputCompression] = useState<number>(100);
  const [background, setBackground] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);

  // 出力フォーマットに合わせた data URL の MIME
  const outputMime = useMemo(
    () => (outputFormat === "jpeg" ? "image/jpeg" : "image/png"),
    [outputFormat],
  );

  // 初回にテンプレート一覧を読み込む
  useEffect(() => {
    async function loadTemplates() {
      setPromptLibraryLoading(true);
      try {
        const response = await fetch("/api/templates");
        if (!response.ok) {
          throw new Error(t("items.errors.fetchTemplates"));
        }
        const data = (await response.json()) as TemplateSummary[];
        setTemplates(data);
      } catch (err) {
        console.error(err);
      } finally {
        setPromptLibraryLoading(false);
      }
    }

    loadTemplates();
  }, [t]);

  // 選択したテンプレートを読み込んでプロンプトに反映
  async function handleTemplateLoad(name: string) {
    if (!name) {
      return;
    }
    setPromptLibraryLoading(true);
    try {
      const response = await fetch(`/api/templates/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error(t("items.errors.fetchTemplate"));
      }
      const data = (await response.json()) as { name: string; content: string };
      setPrompt(data.content);
      // 読み込み後にテキストエリアへフォーカス
      requestAnimationFrame(() => {
        promptRef.current?.focus();
      });
    } catch (err) {
      console.error(err);
      setError(t("items.errors.fetchTemplate"));
    } finally {
      setPromptLibraryLoading(false);
    }
  }

  // フォーム送信で画像編集 API を呼び出す
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // 参照画像が無い場合は即エラー表示
    if (!imageFile) {
      setError(t("items.errors.noImage"));
      return;
    }

    setIsSubmitting(true);
    try {
      // API へ送る FormData を構築
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("model", model);
      formData.append("size", size);
      formData.append("quality", quality);
      formData.append("n", String(numberOfImages));
      formData.append("image", imageFile);
      if (maskFile) {
        formData.append("mask", maskFile);
      }
      if (user) {
        formData.append("user", user);
      }
      if (inputFidelity) {
        formData.append("input_fidelity", inputFidelity);
      }
      if (outputFormat) {
        formData.append("output_format", outputFormat);
      }
      formData.append("output_compression", String(outputCompression));
      if (background) {
        formData.append("background", background);
      }
      const response = await fetch("/api/image-edit", {
        method: "POST",
        body: formData,
      });

      // HTTP エラーはメッセージを取得して表示
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody?.message ?? t("items.errors.requestFailed"));
      }

      const data = (await response.json()) as ImageEditResponse;
      if (data.error?.message) {
        throw new Error(data.error.message);
      }
      // base64 を data URL に変換し、最新結果を先頭に並べる
      const images = data.data?.map((entry) => entry.b64_json) ?? [];
      setResults((prev) => [
        ...images.map((b64) => `data:${outputMime};base64,${b64}`),
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : t("items.errors.generic"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
          {t("items.title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          {t("items.description")}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        {/* 左カラム: 入力フォーム */}
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-2">
            <label htmlFor="image-file" className="text-sm font-semibold">
              {t("items.form.image")}
            </label>
            <input
              id="image-file"
              type="file"
              accept="image/png,image/jpeg"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-600 hover:file:bg-indigo-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="mask-file" className="text-sm font-semibold">
              {t("items.form.mask")}
            </label>
            <input
              id="mask-file"
              type="file"
              accept="image/png"
              onChange={(event) =>
                setMaskFile(event.target.files?.[0] ?? null)
              }
              className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-700 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-600 hover:file:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {t("items.form.prompt")}
            </label>
            <textarea
              ref={promptRef}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={6}
              placeholder={t("items.form.promptPlaceholder")}
              className="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
            />
          </div>
          {/* テンプレート選択エリア */}
          <div className="grid gap-3 rounded-xl border border-dashed border-zinc-200 p-4 text-sm dark:border-zinc-700">
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="template-select"
                className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                {t("items.form.templateLabel")}
              </label>
              <select
                id="template-select"
                value={selectedTemplate}
                onChange={(event) => setSelectedTemplate(event.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              >
                <option value="">{t("items.form.templatePlaceholder")}</option>
                {templates.map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleTemplateLoad(selectedTemplate)}
                disabled={!selectedTemplate || promptLibraryLoading}
                className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {promptLibraryLoading
                  ? t("items.form.templateLoading")
                  : t("items.form.templateLoad")}
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            {/* 詳細オプションは折りたたみ表示 */}
            <details className="rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-700">
              <summary className="cursor-pointer text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                {t("items.form.optionsTitle")}
              </summary>
              <div className="mt-4 grid gap-4">
                <label className="text-sm font-medium">
                  {t("items.form.model")}
                  <input
                    id="model-name"
                    type="text"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.size")}
                  <select
                    id="size-select"
                    value={size}
                    onChange={(event) =>
                      setSize(event.target.value as (typeof sizeOptions)[number])
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    {sizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.quality")}
                  <select
                    id="quality-select"
                    value={quality}
                    onChange={(event) =>
                      setQuality(
                        event.target.value as (typeof qualityOptions)[number],
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    {qualityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.numberOfImages")}
                  <input
                    id="image-count"
                    type="number"
                    min={1}
                    max={10}
                    value={numberOfImages}
                    onChange={(event) =>
                      setNumberOfImages(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.inputFidelity")}
                  <select
                    id="input-fidelity"
                    value={inputFidelity}
                    onChange={(event) =>
                      setInputFidelity(
                        event.target.value as (typeof inputFidelityOptions)[number],
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    {inputFidelityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.outputFormat")}
                  <select
                    id="output-format"
                    value={outputFormat}
                    onChange={(event) =>
                      setOutputFormat(
                        event.target.value as (typeof outputFormatOptions)[number],
                      )
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  >
                    {outputFormatOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.outputCompression")}
                  <input
                    id="output-compression"
                    type="number"
                    min={0}
                    max={100}
                    value={outputCompression}
                    onChange={(event) =>
                      setOutputCompression(Number(event.target.value))
                    }
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.background")}
                  <input
                    id="background-value"
                    type="text"
                    value={background}
                    onChange={(event) => setBackground(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
                <label className="text-sm font-medium">
                  {t("items.form.userId")}
                  <input
                    id="user-id"
                    type="text"
                    value={user}
                    onChange={(event) => setUser(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
                  />
                </label>
              </div>
            </details>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            {isSubmitting ? t("items.form.submitLoading") : t("items.form.submit")}
          </button>
          {error && (
            <p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
              {error}
            </p>
          )}
        </section>

        {/* 右カラム: 結果表示 */}
        <section className="flex h-full flex-col space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              {t("items.results.title")}
            </h2>
          </div>
          {isSubmitting ? (
            // 実行中はスケルトン表示
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: Math.max(1, numberOfImages) }).map(
                  (_, item) => (
                    <div
                      key={item}
                      className="h-40 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 animate-pulse"
                    >
                      <div className="h-5 w-20 rounded-full bg-indigo-200" />
                      <div className="mt-4 h-24 rounded-xl bg-indigo-100" />
                    </div>
                  ),
                )}
              </div>
              {results.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {t("items.results.previous")}
                  </p>
                  {/* 以前の結果を一覧表示 */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {results.map((src, index) => (
                      <button
                        type="button"
                        key={`${src}-${index}`}
                        onClick={() => setSelectedImage(src)}
                        aria-label={t("items.results.expandLabel").replace(
                          "{index}",
                          String(index + 1),
                        )}
                        className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                      >
                        <Image
                          src={src}
                          alt={t("items.results.expandLabel").replace(
                            "{index}",
                            String(index + 1),
                          )}
                          width={512}
                          height={512}
                          className="h-auto w-full"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : results.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-zinc-200 text-sm text-zinc-500 dark:border-zinc-700">
              {t("items.results.empty")}
            </div>
          ) : (
            // 実行後の結果一覧
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((src, index) => (
                <button
                  type="button"
                  key={`${src}-${index}`}
                  onClick={() => setSelectedImage(src)}
                  aria-label={t("items.results.expandLabel").replace(
                    "{index}",
                    String(index + 1),
                  )}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <Image
                    src={src}
                    alt={t("items.results.expandLabel").replace(
                      "{index}",
                      String(index + 1),
                    )}
                    width={512}
                    height={512}
                    className="h-auto w-full"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </section>
      </form>

      {selectedImage && (
        // クリックした画像を拡大表示するモーダル
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-6 rounded-full bg-white/90 px-3 py-2 text-xs font-semibold text-zinc-800 shadow"
          >
            {t("common.close")}
          </button>
          <div className="max-h-full max-w-5xl">
            <Image
              src={selectedImage}
              alt={t("items.results.expandedAlt")}
              width={1280}
              height={1280}
              className="h-auto w-full rounded-2xl bg-white"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
