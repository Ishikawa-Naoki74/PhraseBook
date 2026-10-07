import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const videos = await ctx.db.query("videos").withIndex("by_addedAt").order("desc").collect();
    return Promise.all(
      videos.map(async (video) => {
        const phrases = await ctx.db
          .query("phrases")
          .withIndex("by_video", (q) => q.eq("videoId", video._id))
          .collect();
        return { ...video, phraseCount: phrases.length };
      })
    );
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    channel: v.string(),
    url: v.string(),
    youtubeId: v.optional(v.string()),
    duration: v.optional(v.string()),
    channelUrl: v.optional(v.string()),
    channelIcon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videos", { ...args, addedAt: Date.now() });
  },
});

// 既存動画にチャンネル情報(アイコン等)を後から付与する
export const setChannelMeta = mutation({
  args: {
    id: v.id("videos"),
    channelUrl: v.optional(v.string()),
    channelIcon: v.optional(v.string()),
  },
  handler: async (ctx, { id, channelUrl, channelIcon }) => {
    await ctx.db.patch(id, { channelUrl, channelIcon });
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, { id }) => {
    const phrases = await ctx.db
      .query("phrases")
      .withIndex("by_video", (q) => q.eq("videoId", id))
      .collect();
    for (const phrase of phrases) {
      await ctx.db.delete(phrase._id);
    }
    await ctx.db.delete(id);
  },
});
