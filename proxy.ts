import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, sessionToken } from "@/lib/auth";

// APP_PASSWORD が設定されている場合、ログイン済み Cookie がないリクエストを /login へリダイレクトする
export async function proxy(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    // パスワード未設定(ローカル開発など)は保護しない
    return NextResponse.next();
  }

  const expected = await sessionToken(password);
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (cookie === expected) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  // ログイン画面・ログインAPI・robots.txt・静的アセット以外をすべて保護する
  matcher: ["/((?!login|api/login|robots.txt|_next/static|_next/image|favicon.ico).*)"],
};
