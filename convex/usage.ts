import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 指定日のAI利用回数を返す(クライアントがローカル日付を渡す)
export const forDate = query({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const row = await ctx.db
      .query("aiUsage")
      .withIndex("by_date", (q) => q.eq("date", date))
      .unique();
    return row?.count ?? 0;
  },
});

// 指定日のカウントを1増やす(AIリクエスト成功時に呼ぶ)
export const increment = mutation({
  args: { date: v.string() },
  handler: async (ctx, { date }) => {
    const row = await ctx.db
      .query("aiUsage")
      .withIndex("by_date", (q) => q.eq("date", date))
      .unique();
    if (row) {
      await ctx.db.patch(row._id, { count: row.count + 1 });
      return row.count + 1;
    }
    await ctx.db.insert("aiUsage", { date, count: 1 });
    return 1;
  },
});
