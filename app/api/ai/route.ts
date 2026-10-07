import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const DEFAULT_MODEL = "gemini-2.5-flash";
const DEFAULT_DAILY_LIMIT = 250;

type Mode = "examples" | "paraphrase" | "swap" | "idioms";

// Gemini のHTTPステータス/エラー本文から日本語の分かりやすいメッセージを作る
function errorMessage(status: number, body: string): string {
  if (status === 429) {
    // 本文から日次/分次のどちらの上限かを判定
    const perMinute = /per.?minute|PerMinute|requests per minute|RPM/i.test(body);
    const perDay = /per.?day|PerDay|requests per day|RPD/i.test(body);
    if (perDay && !perMinute) {
      return "本日の無料枠(1日あたりのリクエスト上限)に達しました。太平洋時間の深夜にリセットされます。";
    }
    if (perMinute) {
      return "短時間にリクエストが集中し、1分あたりの上限に達しました。1分ほど待ってから、もう一度お試しください。";
    }
    return "Gemini API のレート制限(利用枠の上限)に達しました。少し時間をおいてから、もう一度お試しください。";
  }
  if (status === 400 || status === 401 || status === 403) {
    return "APIキーが無効か、権限がありません。設定のAPIキーを確認してください。";
  }
  if (status === 404) {
    return "モデルが見つかりません。GEMINI_MODEL の設定を確認してください。";
  }
  if (status === 503 || status === 500) {
    return "Gemini 側が一時的に混雑しています。少し待ってから、もう一度お試しください。";
  }
  return `Gemini API エラー (${status}) が発生しました。少し待ってから、もう一度お試しください。`;
}

// AI利用回数を Convex に記録する(失敗してもAI応答は妨げない)
async function recordUsage(date: string) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url || !date) return;
  try {
    const client = new ConvexHttpClient(url);
    await client.mutation(api.usage.increment, { date });
  } catch (e) {
    console.error("usage increment failed:", e);
  }
}

function buildPrompt(mode: Mode, en: string, ja: string): string {
  const context = ja
    ? `英語表現: "${en}"\n日本語の意味: "${ja}"`
    : `英語表現: "${en}"`;

  switch (mode) {
    case "examples":
      return `あなたは日本人向け英語学習アプリのアシスタントです。
次の英語表現(単語または英文)を学習者が使いこなせるように、この表現(またはその中の重要な語彙・構文)を使った自然な例文を3つ作成してください。
日常会話・ビジネス・カジュアルなど、場面の異なる例文にしてください。

${context}

各例文について、英文(en)と自然な日本語訳(ja)を返してください。`;
    case "paraphrase":
      return `あなたは日本人向け英語学習アプリのアシスタントです。
次の英語表現とほぼ同じ意味を伝える「別の言い方」を3〜4つ提案してください。
フォーマル・カジュアル・口語的など、ニュアンスの異なる言い換えを含めてください。

${context}

各言い換えについて、英文(en)、日本語訳(ja)、元の表現とのニュアンスの違いの説明(nuance、日本語で簡潔に)を返してください。`;
    case "swap":
      return `あなたは日本人向け英語学習アプリのアシスタントです。
次の英語表現の中から、入れ替えて練習する価値のある重要な単語を2〜3個選び、それぞれについて置き換え可能な別の単語を2〜3個提案してください。

${context}

各対象単語について:
- original: 元の単語(表現内に実際に登場する形で)
- originalJa: その単語の日本語の意味
- alternatives: 置き換え候補の配列。各候補について word(置き換える単語)、sentence(その単語で置き換えた完全な英文)、ja(その英文の日本語訳)を返してください。

置き換え後の英文は文法的に正しく自然な文にしてください(必要に応じて活用形を調整)。`;
    case "idioms":
      return `あなたは日本人向け英語学習アプリのアシスタントです。
次の英語表現の中から、他の文でも「使い回せる」便利な構文・イディオム・定型表現を最大3つ抽出してください。
単なる単語ではなく、パターンとして応用できるものを選んでください。適切なものが無ければ空の配列で構いません。

${context}

各構文について:
- pattern: 使い回せる形。可変部分は ~ や ... で示す(例: "the best way to ~ is to ..." や "It's not about ~, it's about ...")
- meaning: 日本語での意味・使いどころの説明(簡潔に)
- examples: その構文を使った別の場面の例文を2つ。各例文は en(英文)と ja(自然な日本語訳)。`;
  }
}

const SCHEMAS: Record<Mode, object> = {
  examples: {
    type: "OBJECT",
    properties: {
      examples: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            en: { type: "STRING" },
            ja: { type: "STRING" },
          },
          required: ["en", "ja"],
        },
      },
    },
    required: ["examples"],
  },
  paraphrase: {
    type: "OBJECT",
    properties: {
      paraphrases: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            en: { type: "STRING" },
            ja: { type: "STRING" },
            nuance: { type: "STRING" },
          },
          required: ["en", "ja", "nuance"],
        },
      },
    },
    required: ["paraphrases"],
  },
  swap: {
    type: "OBJECT",
    properties: {
      swaps: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            original: { type: "STRING" },
            originalJa: { type: "STRING" },
            alternatives: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  word: { type: "STRING" },
                  sentence: { type: "STRING" },
                  ja: { type: "STRING" },
                },
                required: ["word", "sentence", "ja"],
              },
            },
          },
          required: ["original", "originalJa", "alternatives"],
        },
      },
    },
    required: ["swaps"],
  },
  idioms: {
    type: "OBJECT",
    properties: {
      idioms: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            pattern: { type: "STRING" },
            meaning: { type: "STRING" },
            examples: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  en: { type: "STRING" },
                  ja: { type: "STRING" },
                },
                required: ["en", "ja"],
              },
            },
          },
          required: ["pattern", "meaning", "examples"],
        },
      },
    },
    required: ["idioms"],
  },
};

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL ?? DEFAULT_MODEL,
    dailyLimit: Number(process.env.GEMINI_DAILY_LIMIT ?? DEFAULT_DAILY_LIMIT),
  });
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません。.env.local に GEMINI_API_KEY=... を追加して開発サーバーを再起動してください。" },
      { status: 400 }
    );
  }

  let body: { mode?: Mode; en?: string; ja?: string; date?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストボディが不正です。" }, { status: 400 });
  }

  const { mode, en, ja, date } = body;
  if (!mode || !["examples", "paraphrase", "swap", "idioms"].includes(mode) || !en?.trim()) {
    return NextResponse.json({ error: "mode と en は必須です。" }, { status: 400 });
  }

  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    let res: Response;
    let attempt = 0;
    // 503(過負荷)・429(レート制限)は少し待ってリトライ
    do {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 1500 * attempt));
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(mode, en.trim(), ja?.trim() ?? "") }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: SCHEMAS[mode],
            temperature: 0.8,
          },
        }),
      });
      attempt++;
    } while ((res.status === 503 || res.status === 429) && attempt < 3);

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error:", res.status, errText);
      return NextResponse.json(
        { error: errorMessage(res.status, errText) },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "Gemini から有効な応答が得られませんでした。" }, { status: 502 });
    }

    const parsed = JSON.parse(text);
    if (date) await recordUsage(date);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("AI route error:", e);
    return NextResponse.json({ error: "AI リクエスト中にエラーが発生しました。" }, { status: 500 });
  }
}
