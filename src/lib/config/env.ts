import "server-only";
import { z } from "zod";
import { config } from "dotenv";

// ローカル開発では .env 系を読み込む
if (process.env.NODE_ENV !== "production") {
  config();
}

// 必須・任意の環境変数を型安全に検証
const envSchema = z.object({
  AZURE_OPENAI_ENDPOINT: z.string().url(),
  AZURE_OPENAI_DEPLOYMENT_NAME: z.string().min(1),
  OPENAI_API_VERSION: z.string().min(1).default("2025-04-01-preview"),
  AZURE_OPENAI_API_KEY: z.string().optional(),
  PROMPT_TEMPLATES_DIR: z.string().optional(),
  APPLICATIONINSIGHTS_CONNECTION_STRING: z.string().optional(),
  AUTH_USERNAME: z.string().min(1),
  AUTH_PASSWORD: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

// 実行時の環境変数を必要になった時点で検証
export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse({
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
    AZURE_OPENAI_DEPLOYMENT_NAME: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
    OPENAI_API_VERSION: process.env.OPENAI_API_VERSION ?? "2025-04-01-preview",
    AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
    PROMPT_TEMPLATES_DIR: process.env.PROMPT_TEMPLATES_DIR,
    APPLICATIONINSIGHTS_CONNECTION_STRING:
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
    AUTH_USERNAME: process.env.AUTH_USERNAME,
    AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  });

  if (!parsed.success) {
    console.error("Environment validation failed", parsed.error.flatten());
    throw new Error("必要な環境変数が不足しています。README を確認してください。");
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
