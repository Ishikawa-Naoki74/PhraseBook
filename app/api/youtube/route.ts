import { NextRequest, NextResponse } from "next/server";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

// チャンネルページの og:image(アバター画像)を取得し、小さいサイズに調整する
async function fetchChannelIcon(channelUrl: string): Promise<string | null> {
  try {
    const res = await fetch(channelUrl, { headers: { "User-Agent": UA } });
    if (!res.ok) return null;
    const html = await res.text();
    const match =
      html.match(/<meta property="og:image" content="([^"]+)"/) ||
      html.match(/<link rel="image_src" href="([^"]+)"/);
    if (!match) return null;
    // 例: ...=s900-c-k-... を小さめの s176 に置き換える(アバター用途)
    return match[1].replace(/=s\d+-/, "=s176-");
  } catch {
    return null;
  }
}

// YouTube oEmbed API でタイトル・チャンネル名・チャンネルURLを取得(APIキー不要)
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "url パラメータが必要です。" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { headers: { "User-Agent": UA } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "動画情報を取得できませんでした。URLを確認してください。" },
        { status: 404 }
      );
    }
    const data = await res.json();
    const channelUrl: string | undefined = data.author_url;
    const channelIcon = channelUrl ? await fetchChannelIcon(channelUrl) : null;

    return NextResponse.json({
      title: data.title,
      channel: data.author_name,
      channelUrl: channelUrl ?? null,
      channelIcon,
    });
  } catch {
    return NextResponse.json({ error: "動画情報の取得に失敗しました。" }, { status: 500 });
  }
}
