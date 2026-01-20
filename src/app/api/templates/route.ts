import { listPromptTemplates } from "@/lib/promptTemplates";

export const runtime = "nodejs";

// テンプレート一覧を返す API
export async function GET() {
  const templates = await listPromptTemplates();
  return Response.json(templates.map((name) => ({ name })));
}
