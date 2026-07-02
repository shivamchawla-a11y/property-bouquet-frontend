const API = "https://property-bouquet-backend.onrender.com/api";

export default async function sitemap() {
  const baseUrl = "https://propertybouquet.com";

  const sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/knowledge`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  try {
    const [
      propertiesRes,
      developersRes,
      locationsRes,
      categoriesRes,
      knowledgeRes,
      insightsRes,
    ] = await Promise.all([
      fetch(`${API}/properties`, { cache: "no-store" }),
      fetch(`${API}/developers`, { cache: "no-store" }),
      fetch(`${API}/locations`, { cache: "no-store" }),
      fetch(`${API}/categories`, { cache: "no-store" }),
      fetch(`${API}/knowledge`, { cache: "no-store" }),
      fetch(`${API}/news`, { cache: "no-store" }),
    ]);

    const [
      propertiesData,
      developersData,
      locationsData,
      categoriesData,
      knowledgeData,
      insightsData,
    ] = await Promise.all([
      propertiesRes.json(),
      developersRes.json(),
      locationsRes.json(),
      categoriesRes.json(),
      knowledgeRes.json(),
      insightsRes.json(),
    ]);

    // Properties
    if (propertiesData?.data) {
      propertiesData.data.forEach((property) => {
        if (!property.slug) return;

        sitemap.push({
          url: `${baseUrl}/property/${property.slug}`,
          lastModified: new Date(
            property.updatedAt || property.createdAt || Date.now()
          ),
          changeFrequency: "weekly",
          priority: 0.9,
        });
      });
    }

    // Developers
    if (developersData?.data) {
      developersData.data.forEach((developer) => {
        if (!developer.slug) return;

        sitemap.push({
          url: `${baseUrl}/developers/${developer.slug}`,
          lastModified: new Date(
            developer.updatedAt || developer.createdAt || Date.now()
          ),
          changeFrequency: "monthly",
          priority: 0.85,
        });
      });
    }

    // Locations
    if (locationsData?.data) {
      locationsData.data.forEach((location) => {
        if (!location.slug) return;

        sitemap.push({
          url: `${baseUrl}/locations/${location.slug}`,
          lastModified: new Date(
            location.updatedAt || location.createdAt || Date.now()
          ),
          changeFrequency: "weekly",
          priority: 0.85,
        });
      });
    }

    // Categories
    if (categoriesData?.data) {
      categoriesData.data.forEach((category) => {
        if (!category.slug) return;

        sitemap.push({
          url: `${baseUrl}/categories/${category.slug}`,
          lastModified: new Date(
            category.updatedAt || category.createdAt || Date.now()
          ),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    }

    // Knowledge Articles
    if (knowledgeData?.data) {
      knowledgeData.data.forEach((article) => {
        if (!article.slug) return;

        sitemap.push({
          url: `${baseUrl}/knowledge/${article.slug}`,
          lastModified: new Date(
            article.updatedAt || article.createdAt || Date.now()
          ),
          changeFrequency: "monthly",
          priority: 0.75,
        });
      });
    }

    // Insights / News
    if (insightsData?.data) {
      insightsData.data.forEach((article) => {
        if (!article.slug) return;

        sitemap.push({
          url: `${baseUrl}/insights/${article.slug}`,
          lastModified: new Date(
            article.updatedAt || article.createdAt || Date.now()
          ),
          changeFrequency: "monthly",
          priority: 0.75,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return sitemap;
}