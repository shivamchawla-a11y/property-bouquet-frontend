export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/*",
          "/auth",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/api/*",
        ],
      },

      // AI Crawlers (Allowed)
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
    ],

    sitemap: "https://propertybouquet.com/sitemap.xml",

    host: "https://propertybouquet.com",
  };
}