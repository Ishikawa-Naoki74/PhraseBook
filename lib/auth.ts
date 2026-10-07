// 簡易パスワード認証(個人利用向け)
// APP_PASSWORD が設定されている場合のみ有効。セッションは SHA-256 ハッシュを Cookie に保存する。

export const SESSION_COOKIE = "pb_session";

export async function sessionToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`phrasebook:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
