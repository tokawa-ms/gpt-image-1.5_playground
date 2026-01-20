import { submitImageEdit } from "@/lib/azure/imageEdits";

export const runtime = "nodejs";

// UI で受け付けるサイズ・品質・フォーマットの範囲を固定し、不正な入力をサーバー側で弾く
const allowedSizes = new Set(["1024x1024", "1024x1536", "1536x1024"]);
const allowedQuality = new Set(["low", "medium", "high"]);
const allowedOutputFormat = new Set(["png", "jpeg"]);
const allowedInputFidelity = new Set(["low", "medium", "high"]);

// FormData から文字列を安全に取り出し、空白だけの値は空文字にする
function toString(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") {
    return "";
  }
  return value.trim();
}

// 数値に変換できない場合はフォールバック値を使う
function toNumber(value: string, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function POST(request: Request) {
  try {
    // 受信したフォームを読み取り、各オプションを正規化
    const incomingForm = await request.formData();
    const image = incomingForm.get("image");
    const mask = incomingForm.get("mask");
    const prompt = toString(incomingForm.get("prompt"));
    const size = toString(incomingForm.get("size")) || "1024x1024";
    const quality = toString(incomingForm.get("quality")) || "high";
    const n = toNumber(toString(incomingForm.get("n")), 1);
    const model = toString(incomingForm.get("model")) || "gpt-image-1.5";
    const user = toString(incomingForm.get("user"));
    const inputFidelity = toString(incomingForm.get("input_fidelity"));
    const outputFormat = toString(incomingForm.get("output_format"));
    const outputCompression = toString(incomingForm.get("output_compression"));
    const background = toString(incomingForm.get("background"));
    const stream = toString(incomingForm.get("stream")) === "true";
    const partialImages = toString(incomingForm.get("partial_images"));

    // 画像は必須。未指定の場合は 400 を返す
    if (!(image instanceof File)) {
      return Response.json({ message: "image が必要です" }, { status: 400 });
    }

    // 不正な値は事前に弾く
    if (!allowedSizes.has(size)) {
      return Response.json({ message: "size が不正です" }, { status: 400 });
    }

    if (!allowedQuality.has(quality)) {
      return Response.json({ message: "quality が不正です" }, { status: 400 });
    }

    if (outputFormat && !allowedOutputFormat.has(outputFormat)) {
      return Response.json({ message: "output_format が不正です" }, { status: 400 });
    }

    if (inputFidelity && !allowedInputFidelity.has(inputFidelity)) {
      return Response.json({ message: "input_fidelity が不正です" }, { status: 400 });
    }

    // Azure OpenAI 画像編集 API に送る FormData を組み立て
    const entries: Array<[string, FormDataEntryValue]> = [];
    entries.push(["image[]", image]);
    entries.push(["prompt", prompt]);
    entries.push(["model", model]);
    entries.push(["size", size]);
    entries.push(["quality", quality]);
    entries.push(["n", String(Math.min(Math.max(n, 1), 10))]);

    if (mask instanceof File) {
      entries.push(["mask", mask]);
    }
    if (user) {
      entries.push(["user", user]);
    }
    if (inputFidelity) {
      entries.push(["input_fidelity", inputFidelity]);
    }
    if (outputFormat) {
      entries.push(["output_format", outputFormat]);
    }
    if (outputCompression) {
      entries.push(["output_compression", outputCompression]);
    }
    if (background) {
      entries.push(["background", background]);
    }
    entries.push(["stream", String(stream)]);
    if (stream && partialImages) {
      entries.push(["partial_images", partialImages]);
    }

    // 運用時の診断に使えるよう、主要パラメータのみログ出力
    console.log("Image edit request", {
      size,
      quality,
      n,
      model,
      stream,
      hasMask: mask instanceof File,
    });

    const response = await submitImageEdit(entries, stream);

    // ストリーミングの場合はそのまま返し、クライアント側で処理させる
    if (stream) {
      return response;
    }

    // 非ストリーミングは JSON を返す
    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Image edit failed", error);
    return Response.json(
      { message: "画像編集の実行中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
