import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getExpectedToken, isValidCredentials } from "@/lib/auth";

export const runtime = "nodejs";

// 簡易認証: ユーザー名とパスワードが一致したら Cookie を発行
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as
      | { username?: string; password?: string }
      | undefined;

    const username = body?.username?.trim() ?? "";
    const password = body?.password ?? "";

    // 不一致の場合は 401 を返す
    if (!isValidCredentials(username, password)) {
      return NextResponse.json(
        { message: "ユーザー名またはパスワードが違います。" },
        { status: 401 },
      );
    }

    // 認証成功時は httpOnly Cookie を設定
    const response = NextResponse.json({ ok: true });
    response.cookies.set(AUTH_COOKIE_NAME, getExpectedToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json(
      { message: "ログインに失敗しました。" },
      { status: 500 },
    );
  }
}
