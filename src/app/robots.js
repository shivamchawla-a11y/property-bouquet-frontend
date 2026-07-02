export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: [
          "/admin",
          "/admin/*",
          "/login",
          "/auth",
          "/forgot-password",
          "/reset-password",
          "/api",
        ],
      },
    ],
    sitemap: "https://propertybouquet.com/sitemap.xml",
    host: "https://propertybouquet.com",
  };
}