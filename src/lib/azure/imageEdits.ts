import "server-only";
import { DefaultAzureCredential } from "@azure/identity";
import { env } from "@/lib/config/env";
import { cloneFormData } from "@/lib/utils/formData";

// Azure OpenAI (Foundry) のトークンスコープ
const scope = "https://cognitiveservices.azure.com/.default";
const credential = new DefaultAzureCredential();

// トークン再利用で API 呼び出し回数を削減
let cachedToken: { token: string; expiresOnTimestamp: number } | null = null;

// Managed Identity / Azure CLI などから AAD トークンを取得
async function getBearerToken(): Promise<string | null> {
  // API Key が設定されている場合は AAD トークンを使わない
  if (env.AZURE_OPENAI_API_KEY) {
    return null;
  }

  const now = Date.now();
  // 有効期限が 1 分以上残っているトークンは再利用
  if (cachedToken && cachedToken.expiresOnTimestamp - now > 60_000) {
    return cachedToken.token;
  }

  const token = await credential.getToken(scope);
  if (!token) {
    throw new Error("Azure AD トークンを取得できませんでした。");
  }

  cachedToken = {
    token: token.token,
    expiresOnTimestamp: token.expiresOnTimestamp,
  };

  return token.token;
}

// 画像編集 API のエンドポイントを組み立てる
function buildEndpointUrl() {
  const endpoint = env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
  return `${endpoint}/openai/deployments/${env.AZURE_OPENAI_DEPLOYMENT_NAME}/images/edits?api-version=${env.OPENAI_API_VERSION}`;
}

// 一時的なエラーはリトライし、回復できない場合は例外を投げる
async function fetchWithRetry(
  url: string,
  buildInit: () => RequestInit,
  maxRetries = 2,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(url, buildInit());
      if (
        response.ok ||
        ![429, 500, 502, 503, 504].includes(response.status)
      ) {
        return response;
      }
      // リトライ対象のステータスのみリトライ
      lastError = new Error(`Retryable status: ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    const waitMs = 500 * Math.pow(2, attempt);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  throw lastError ?? new Error("Azure OpenAI への接続に失敗しました。");
}

// 画像編集 API を呼び出し、ストリーミング/非ストリーミング両対応で返す
export async function submitImageEdit(
  entries: Array<[string, FormDataEntryValue]>,
  stream: boolean,
): Promise<Response> {
  const token = await getBearerToken();
  const headers: HeadersInit = {};

  // Managed Identity / Azure CLI を使う場合は Bearer トークン
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  // API Key が指定されている場合は api-key ヘッダー
  } else if (env.AZURE_OPENAI_API_KEY) {
    headers["api-key"] = env.AZURE_OPENAI_API_KEY;
  }

  // SSE を受け取る場合は Accept を設定
  if (stream) {
    headers.Accept = "text/event-stream";
  }

  // FormData は一度複製して fetch に渡す
  const response = await fetchWithRetry(buildEndpointUrl(), () => ({
    method: "POST",
    headers,
    body: cloneFormData(entries),
    signal: AbortSignal.timeout(120_000),
  }));

  // エラー時の本文をログに残し、原因調査に役立てる
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Azure OpenAI error", response.status, errorText);
  }

  // ストリーミングは body をそのまま返却
  if (stream && response.body) {
    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "text/plain",
      },
    });
  }

  // JSON レスポンスを返す
  return response;
}
