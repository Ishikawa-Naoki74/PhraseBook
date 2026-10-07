import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByVideo = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, { videoId }) => {
    return await ctx.db
      .query("phrases")
      .withIndex("by_video", (q) => q.eq("videoId", videoId))
      .order("desc")
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const phrases = await ctx.db.query("phrases").order("desc").collect();
    return Promise.all(
      phrases.map(async (phrase) => {
        const video = await ctx.db.get(phrase.videoId);
        return { ...phrase, videoTitle: video?.title ?? "" };
      })
    );
  },
});

export const add = mutation({
  args: {
    videoId: v.id("videos"),
    kind: v.union(v.literal("phrase"), v.literal("word"), v.literal("memo")),
    en: v.string(),
    ja: v.string(),
    example: v.optional(v.string()),
    exampleJa: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("phrases", { ...args, starred: false, addedAt: Date.now() });
  },
});

export const toggleStar = mutation({
  args: { id: v.id("phrases") },
  handler: async (ctx, { id }) => {
    const phrase = await ctx.db.get(id);
    if (!phrase) return;
    await ctx.db.patch(id, { starred: !phrase.starred });
  },
});

export const remove = mutation({
  args: { id: v.id("phrases") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
