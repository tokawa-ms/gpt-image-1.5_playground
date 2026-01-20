import { getPromptTemplate } from "@/lib/promptTemplates";

export const runtime = "nodejs";

// 指定したテンプレート名の本文を返す API
export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> },
) {
  const params = await context.params;
  const template = await getPromptTemplate(params?.name ?? "");
  if (!template) {
    return Response.json({ message: "Template not found" }, { status: 404 });
  }

  return Response.json(template);
}
