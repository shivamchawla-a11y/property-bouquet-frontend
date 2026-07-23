const API = "https://propertybouquet.com/api";

const REVALIDATE_TIME = 3600;
const BASE_URL = "https://propertybouquet.com";

const FETCH_OPTIONS = {
  next: {
    revalidate: REVALIDATE_TIME,
  },
};

/**
 * Safely fetch API data without breaking the sitemap
 */
async function safeFetch(url) {
  try {
    const res = await fetch(url, FETCH_OPTIONS);

    if (!res.ok) {
      console.warn(`Sitemap: ${url} returned ${res.status}`);
      return [];
    }

    const json = await res.json();

    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.error(`Sitemap fetch failed: ${url}`, error);
    return [];
  }
}

/**
 * Add URL only once
 */
function addUrl(map, url, options = {}) {
  if (!url || map.has(url)) return;

  map.set(url, {
    url,
    lastModified: new Date(
      options.lastModified || Date.now()
    ),
    changeFrequency:
      options.changeFrequency || "weekly",
    priority: options.priority ?? 0.8,
  });
}

export default async function sitemap() {
  const urls = new Map();

  /* ===============================
      STATIC PAGES
  =============================== */

  addUrl(urls, BASE_URL, {
    priority: 1,
    changeFrequency: "daily",
  });

  addUrl(urls, `${BASE_URL}/properties`, {
    priority: 0.95,
    changeFrequency: "daily",
  });

  // addUrl(urls, `${BASE_URL}/developers`, {
  //   priority: 0.92,
  //   changeFrequency: "weekly",
  // });

  // addUrl(urls, `${BASE_URL}/locations`, {
  //   priority: 0.90,
  //   changeFrequency: "weekly",
  // });

  // addUrl(urls, `${BASE_URL}/categories`, {
  //   priority: 0.88,
  //   changeFrequency: "weekly",
  // });

  addUrl(urls, `${BASE_URL}/knowledge`, {
    priority: 0.86,
    changeFrequency: "weekly",
  });

  addUrl(urls, `${BASE_URL}/insights`, {
    priority: 0.86,
    changeFrequency: "weekly",
  });

  try {
    /* ===============================
        FETCH ALL DATA
    =============================== */

    const [
      properties,
      developers,
      locations,
      categories,
      knowledgeArticles,
      insights,
    ] = await Promise.all([
      safeFetch(`${API}/properties`),
      safeFetch(`${API}/developers`),
      safeFetch(`${API}/locations`),
      safeFetch(`${API}/categories`),
      safeFetch(`${API}/knowledge`),
      safeFetch(`${API}/news`),
    ]);

        /* ===============================
        PROPERTIES
    =============================== */

    properties.forEach((property) => {
      if (
        !property?.slug ||
        property.status !== "published" ||
        property.isDeleted ||
        property.isActive === false
      ) {
        return;
      }

      addUrl(urls, `${BASE_URL}/${property.slug}`, {
        lastModified:
          property.updatedAt || property.createdAt,
        priority: 0.95,
        changeFrequency: "weekly",
      });
    });

    /* ===============================
        DEVELOPERS
    =============================== */

    developers.forEach((developer) => {
      if (
        !developer?.slug ||
        developer.isDeleted ||
        developer.isActive === false
      ) {
        return;
      }

      addUrl(
        urls,
        `${BASE_URL}/developers/${developer.slug}`,
        {
          lastModified:
            developer.updatedAt ||
            developer.createdAt,
          priority: 0.88,
          changeFrequency: "monthly",
        }
      );
    });

    /* ===============================
        LOCATIONS
    =============================== */

    locations.forEach((location) => {
      if (
        !location?.slug ||
        location.isDeleted
      ) {
        return;
      }

      addUrl(
        urls,
        `${BASE_URL}/locations/${location.slug}`,
        {
          lastModified:
            location.updatedAt ||
            location.createdAt,
          priority: 0.87,
          changeFrequency: "weekly",
        }
      );
    });

    /* ===============================
        CATEGORIES
    =============================== */

    categories.forEach((category) => {
      if (
        !category?.slug ||
        category.isDeleted
      ) {
        return;
      }

      addUrl(
        urls,
        `${BASE_URL}/categories/${category.slug}`,
        {
          lastModified:
            category.updatedAt ||
            category.createdAt,
          priority: 0.86,
          changeFrequency: "monthly",
        }
      );
    });

    /* ===============================
        KNOWLEDGE ARTICLES
    =============================== */

    knowledgeArticles.forEach((article) => {
      if (
        !article?.slug ||
        article.isDeleted ||
        article.status === "draft"
      ) {
        return;
      }

      addUrl(
        urls,
        `${BASE_URL}/knowledge/${article.slug}`,
        {
          lastModified:
            article.updatedAt ||
            article.createdAt,
          priority: 0.82,
          changeFrequency: "monthly",
        }
      );
    });

    /* ===============================
        INSIGHTS / NEWS
    =============================== */

    insights.forEach((article) => {
      if (
        !article?.slug ||
        article.isDeleted ||
        article.status === "draft"
      ) {
        return;
      }

      addUrl(
        urls,
        `${BASE_URL}/insights/${article.slug}`,
        {
          lastModified:
            article.updatedAt ||
            article.createdAt,
          priority: 0.82,
          changeFrequency: "monthly",
        }
      );
    });

      } catch (error) {
    console.error(
      "❌ Sitemap generation failed:",
      error
    );
  }

  /* ==========================================
      SORT URLS
      (Homepage → Main Pages → Dynamic Pages)
  ========================================== */

  const sortedUrls = [...urls.values()].sort(
    (a, b) => {
      // Homepage first
      if (a.url === BASE_URL) return -1;
      if (b.url === BASE_URL) return 1;

      // Higher priority first
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }

      // Alphabetical for consistency
      return a.url.localeCompare(b.url);
    }
  );

  return sortedUrls;
}