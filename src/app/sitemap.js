const API = "/api";

export default async function sitemap() {
const BASE_URL = "https://propertybouquet.com";

  const sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },

  {
    url: `${BASE_URL}/properties`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.95,
  },

  {
    url: `${BASE_URL}/developers`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    url: `${BASE_URL}/locations`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    url: `${BASE_URL}/categories`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  },

  {
    url: `${BASE_URL}/knowledge`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  },

  {
    url: `${BASE_URL}/insights`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
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
      fetch(`${API}/properties`, { next: {
    revalidate: 3600,
  }, }),
      fetch(`${API}/developers`, { next: {
    revalidate: 3600,
  }, }),
      fetch(`${API}/locations`, { next: {
    revalidate: 3600,
  }, }),
      fetch(`${API}/categories`, { next: {
    revalidate: 3600,
  }, }),
      fetch(`${API}/knowledge`, { next: {
    revalidate: 3600,
  },}),
      fetch(`${API}/news`, { next: {
    revalidate: 3600,
  }, }),
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
        if (
  !property.slug ||
  property.status !== "published" ||
  !property.isActive ||
  property.isDeleted
) {
  return;
}

        sitemap.push({
          url: `${BASE_URL}/${property.slug}`,
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
          url: `${BASE_URL}/developers/${developer.slug}`,
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
          url: `${BASE_URL}/locations/${location.slug}`,
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
          url: `${BASE_URL}/categories/${category.slug}`,
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
          url: `${BASE_URL}/knowledge/${article.slug}`,
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
          url: `${BASE_URL}/insights/${article.slug}`,
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