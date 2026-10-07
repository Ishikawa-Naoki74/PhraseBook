# PhraseBook

YouTube で学ぶ、伝わる英語 — 保存した動画・フレーズを管理し、Gemini API で例文作成・言い換え・単語入れ替え練習ができるローカル専用アプリ。

## 構成

- **Next.js 16** (App Router) — UI と API ルート
- **Convex** (匿名ローカルデプロイメント) — データベース(videos / phrases)
- **Gemini API** — AI 機能(例文作成・言い換え表現・単語の入れ替え)

## 起動方法

ターミナルを 2 つ使います:

```bash
# ターミナル1: Convex(データベース)
npx convex dev

# ターミナル2: Next.js
npm run dev
```

http://localhost:3000 を開く。

## Gemini API キーの設定(AI機能に必要)

1. [Google AI Studio](https://aistudio.google.com/apikey) で API キーを取得
2. `.env.local` の `GEMINI_API_KEY=` にキーを設定
3. `npm run dev` を再起動

モデルは `GEMINI_MODEL` で変更可能(既定: `gemini-2.5-flash`)。

## 機能

- **動画一覧**: YouTube URL を貼るとタイトル・チャンネル名・サムネイルを自動取得(oEmbed)
- **フレーズ管理**: 動画ごとにフレーズ / 単語 / メモを保存、スター付け
- **AI機能**(各フレーズカードのボタン、または「AI活用」ページ):
  - AIで例文を作成 — 場面の異なる例文を3つ生成
  - 言い換え表現 — ニュアンス解説付きの言い換えを提案
  - 単語を入れ替えてみる — 重要単語の置き換え候補をクリックして練習
  - 生成結果は「+ フレーズとして保存」でそのまま保存可能
- **学習記録**: 保存状況のサマリー
- **検索**: ヘッダーの検索ボックス(⌘K)で動画・フレーズを絞り込み
