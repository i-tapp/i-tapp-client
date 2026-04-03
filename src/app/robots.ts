import type { Metadata, MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "https://www.i-tapp.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/ads.txt"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
