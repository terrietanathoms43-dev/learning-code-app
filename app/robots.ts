import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/profile",
        "/login",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: "https://learning-code-app.vercel.app/sitemap.xml",
  };
}
