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
    ],

    sitemap: "https://propertybouquet.com/sitemap.xml",

    host: "https://propertybouquet.com",
  };
}