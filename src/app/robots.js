export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",

        allow: "/",

        disallow: [
          "/admin/",
          "/auth/",
          "/login",
          "/forgot-password",
          "/reset-password",
          "/api/",
        ],
      },

      /*
       * OpenAI crawler
       * Allows public Property Bouquet pages to be
       * discovered for AI/search experiences.
       */
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },

      /*
       * OpenAI GPT crawler
       */
      {
        userAgent: "GPTBot",
        allow: "/",
      },

      /*
       * Google AI crawler
       */
      {
        userAgent: "Google-Extended",
        allow: "/",
      },

      /*
       * Anthropic crawler
       */
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
    ],

    sitemap: "https://propertybouquet.com/sitemap.xml",

    host: "https://propertybouquet.com",
  };
}