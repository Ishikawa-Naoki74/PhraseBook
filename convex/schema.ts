import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videos: defineTable({
    title: v.string(),
    channel: v.string(),
    url: v.string(),
    youtubeId: v.optional(v.string()),
    duration: v.optional(v.string()),
    channelUrl: v.optional(v.string()),
    channelIcon: v.optional(v.string()),
    addedAt: v.number(),
  }).index("by_addedAt", ["addedAt"]),

  phrases: defineTable({
    videoId: v.id("videos"),
    kind: v.union(v.literal("phrase"), v.literal("word"), v.literal("memo")),
    en: v.string(),
    ja: v.string(),
    // 単語の場合の例文(英文とその訳)。任意。
    example: v.optional(v.string()),
    exampleJa: v.optional(v.string()),
    // 単語をイメージで覚えるための画像URL。任意。
    imageUrl: v.optional(v.string()),
    starred: v.boolean(),
    addedAt: v.number(),
  })
    .index("by_video", ["videoId"])
    .index("by_video_kind", ["videoId", "kind"]),

  // 使い回せる構文・イディオム集(動画に縛られない独立コレクション)
  idioms: defineTable({
    pattern: v.string(),
    meaning: v.string(),
    examples: v.array(v.object({ en: v.string(), ja: v.string() })),
    sourceVideoId: v.optional(v.id("videos")),
    sourcePhraseId: v.optional(v.id("phrases")),
    starred: v.boolean(),
    addedAt: v.number(),
  })
    .index("by_addedAt", ["addedAt"])
    .index("by_sourcePhrase", ["sourcePhraseId"]),

  // Gemini API の日次利用回数(date は YYYY-MM-DD)
  aiUsage: defineTable({
    date: v.string(),
    count: v.number(),
  }).index("by_date", ["date"]),
});
