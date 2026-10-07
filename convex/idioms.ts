import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const idioms = await ctx.db.query("idioms").withIndex("by_addedAt").order("desc").collect();
    return Promise.all(
      idioms.map(async (idiom) => {
        const video = idiom.sourceVideoId ? await ctx.db.get(idiom.sourceVideoId) : null;
        return { ...idiom, sourceVideoTitle: video?.title ?? null };
      })
    );
  },
});

export const add = mutation({
  args: {
    pattern: v.string(),
    meaning: v.string(),
    examples: v.array(v.object({ en: v.string(), ja: v.string() })),
    sourceVideoId: v.optional(v.id("videos")),
    sourcePhraseId: v.optional(v.id("phrases")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("idioms", { ...args, starred: false, addedAt: Date.now() });
  },
});

// あるフレーズから抽出・保存された構文を返す
export const bySourcePhrase = query({
  args: { phraseId: v.id("phrases") },
  handler: async (ctx, { phraseId }) => {
    return await ctx.db
      .query("idioms")
      .withIndex("by_sourcePhrase", (q) => q.eq("sourcePhraseId", phraseId))
      .order("desc")
      .collect();
  },
});

export const toggleStar = mutation({
  args: { id: v.id("idioms") },
  handler: async (ctx, { id }) => {
    const idiom = await ctx.db.get(id);
    if (!idiom) return;
    await ctx.db.patch(id, { starred: !idiom.starred });
  },
});

export const remove = mutation({
  args: { id: v.id("idioms") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
