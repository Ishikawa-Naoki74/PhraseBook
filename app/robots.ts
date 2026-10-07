import type { MetadataRoute } from "next";

// 個人利用のため、すべてのクローラーにインデックスを禁止する
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/",
    },
  };
}
