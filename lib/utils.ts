// サムネイルが無い動画用のフォールバック背景(デザインカンプのグラデーション)
const THUMB_GRADIENTS = [
  "linear-gradient(135deg,#3a3444,#211d29)",
  "linear-gradient(135deg,#2c2c3a,#191922)",
  "linear-gradient(135deg,#33323f,#1f1f29)",
  "linear-gradient(135deg,#2e3340,#1b1e26)",
  "linear-gradient(135deg,#382f3f,#221c29)",
  "linear-gradient(135deg,#1c1618,#15100f)",
];

export function thumbGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return THUMB_GRADIENTS[hash % THUMB_GRADIENTS.length];
}

export function thumbUrl(youtubeId?: string): string | null {
  return youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : null;
}

export function formatAddedAt(timestamp: number): string {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}に追加`;
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/live\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export type AiMode = "examples" | "paraphrase" | "swap" | "idioms";

export type ExamplesResult = { examples: { en: string; ja: string }[] };
export type ParaphraseResult = { paraphrases: { en: string; ja: string; nuance: string }[] };
export type SwapResult = {
  swaps: {
    original: string;
    originalJa: string;
    alternatives: { word: string; sentence: string; ja: string }[];
  }[];
};
export type IdiomItem = { pattern: string; meaning: string; examples: { en: string; ja: string }[] };
export type IdiomsResult = { idioms: IdiomItem[] };
export type AiResult = ExamplesResult | ParaphraseResult | SwapResult | IdiomsResult;

// ローカルタイムの当日キー(YYYY-MM-DD)
export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function callAi(mode: AiMode, en: string, ja: string): Promise<AiResult> {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, en, ja, date: todayKey() }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "AI リクエストに失敗しました");
  }
  return data;
}
