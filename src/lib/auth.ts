import "server-only";
import { getEnv } from "@/lib/config/env";

// Cookie 名は middleware と合わせる
export const AUTH_COOKIE_NAME = "simple_auth" as const;

// 環境変数のユーザー名・パスワードから期待トークンを生成
export function getExpectedToken(): string {
  const env = getEnv();
  return Buffer.from(`${env.AUTH_USERNAME}:${env.AUTH_PASSWORD}`).toString(
    "base64",
  );
}

// 入力された資格情報が一致しているか判定
export function isValidCredentials(username: string, password: string): boolean {
  const env = getEnv();
  return (
    username.trim() === env.AUTH_USERNAME && password === env.AUTH_PASSWORD
  );
}
