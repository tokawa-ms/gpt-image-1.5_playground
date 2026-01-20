import { NextRequest, NextResponse } from "next/server";

// 認証なしでアクセスできるパス
const PUBLIC_PATHS = new Set([
  "/login",
  "/api/health",
  "/api/auth/login",
  "/api/auth/logout",
  "/favicon.ico",
  "/robots.txt",
]);

// 静的アセットや公開パスは認証をスキップ
function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) {
    return true;
  }
  return pathname.startsWith("/_next") || pathname.startsWith("/images");
}

// 環境変数に基づく期待トークンを生成
function getExpectedToken(): string | null {
  const username = process.env.AUTH_USERNAME ?? "";
  const password = process.env.AUTH_PASSWORD ?? "";
  if (!username || !password) {
    return null;
  }
  return btoa(`${username}:${password}`);
}

// 認証 Cookie をチェックし、未認証の場合はログインへ誘導
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const expectedToken = getExpectedToken();
  if (!expectedToken) {
    // 必須の認証情報が無い場合は即エラー
    if (pathname.startsWith("/api")) {
      return NextResponse.json(
        { message: "AUTH_USERNAME と AUTH_PASSWORD が必要です。" },
        { status: 500 },
      );
    }
    return new NextResponse(
      "AUTH_USERNAME と AUTH_PASSWORD が必要です。",
      { status: 500 },
    );
  }

  // Cookie が一致していれば許可
  const cookieValue = request.cookies.get("simple_auth")?.value;

  if (cookieValue === expectedToken) {
    // 認証済みでログインページに来た場合はトップに戻す
    if (pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API は 401、画面はログインページへリダイレクト
  if (pathname.startsWith("/api")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: "/:path*",
};
