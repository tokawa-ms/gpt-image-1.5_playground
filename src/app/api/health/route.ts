export const runtime = "nodejs";

// ヘルスチェック用の軽量エンドポイント
export async function GET() {
  return Response.json({ status: "ok", timestamp: new Date().toISOString() });
}
