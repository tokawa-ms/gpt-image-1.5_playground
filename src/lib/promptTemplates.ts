import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/config/env";

// 既定のテンプレート保存ディレクトリ
const defaultDir = path.join(process.cwd(), "prompt-templates");

// 環境変数で上書きできるようにする
function getTemplatesDir(): string {
  const configured = env.PROMPT_TEMPLATES_DIR?.trim();
  return configured ? configured : defaultDir;
}

// .txt ファイルのみをテンプレート一覧として返す
export async function listPromptTemplates(): Promise<string[]> {
  try {
    const entries = await fs.readdir(getTemplatesDir(), { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
      .map((entry) => entry.name.replace(/\.txt$/i, ""))
      .sort();
  } catch (error) {
    console.error("Failed to read prompt templates", error);
    return [];
  }
}

// テンプレート本文を取得（パス・トラバーサル対策込み）
export async function getPromptTemplate(
  name: string,
): Promise<{ name: string; content: string } | null> {
  if (!name) {
    return null;
  }
  const normalized = name.replace(/\.[^/.]+$/, "");
  const fileName = `${normalized}.txt`;
  const templatePath = path.resolve(getTemplatesDir(), fileName);

  // ディレクトリ外への参照を防ぐ
  if (!templatePath.startsWith(path.resolve(getTemplatesDir()))) {
    return null;
  }

  try {
    const content = await fs.readFile(templatePath, "utf-8");
    return { name: normalized, content };
  } catch (error) {
    console.error("Failed to read prompt template", error);
    return null;
  }
}
