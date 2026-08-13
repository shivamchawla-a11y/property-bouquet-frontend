const API = "https://propertybouquet.com/api";
const BASE_URL = "https://propertybouquet.com";

const REVALIDATE_TIME = 3600;

/**
 * Revalidate the generated sitemap every hour.
 */
export const revalidate = REVALIDATE_TIME;

/**
 * Common fetch configuration.
 */
const FETCH_OPTIONS = {
  next: {
    revalidate: REVALIDATE_TIME,
  },
};

/**
 * Safely fetch API data.
 *
 * If one API endpoint fails, the sitemap should still
 * generate successfully using the remaining data.
 */
async function safeFetch(url) {
  try {
    const response = await fetch(url, FETCH_OPTIONS);

    if (!response.ok) {
      console.warn(
        `⚠️ Sitemap API request failed: ${url} → ${response.status}`
      );

      return [];
    }

    const json = await response.json();

    /**
     * Your API currently returns data in:
     *
     * {
     *   data: [...]
     * }
     */
    if (Array.isArray(json?.data)) {
      return json.data;
    }

    /**
     * Fallback in case an endpoint directly returns an array.
     */
    if (Array.isArray(json)) {
      return json;
    }

    console.warn(
      `⚠️ Sitemap API returned unexpected data format: ${url}`
    );

    return [];
  } catch (error) {
    console.error(
      `❌ Sitemap fetch failed: ${url}`,
      error
    );

    return [];
  }
}

/**
 * Convert a possible database date into a valid Date.
 *
 * Returns undefined if the date is invalid.
 */
function getValidDate(...values) {
  for (const value of values) {
    if (!value) continue;

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}

/**
 * Check whether a document should be considered active.
 */
function isActive(item) {
  if (!item) return false;

  if (item.isDeleted === true) {
    return false;
  }

  if (item.isActive === false) {
    return false;
  }

  return true;
}

/**
 * Check whether content should be publicly indexed.
 *
 * Used for knowledge articles and insights.
 */
function isPublishedContent(item) {
  if (!isActive(item)) {
    return false;
  }

  /**
   * If a status exists, only "published" content
   * should enter the sitemap.
   */
  if (
    item.status !== undefined &&
    item.status !== null &&
    item.status !== "published"
  ) {
    return false;
  }

  return true;
}

/**
 * Add a URL to the sitemap only once.
 *
 * Using a Map prevents duplicate URLs.
 */
function addUrl(
  sitemap,
  path,
  {
    lastModified,
    changeFrequency = "weekly",
    priority = 0.7,
  } = {}
) {
  if (!path) return;

  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  if (sitemap.has(url)) {
    return;
  }

  const entry = {
    url,
    changeFrequency,
    priority,
  };

  const validLastModified = getValidDate(lastModified);

  /**
   * Only send lastModified when we actually have
   * a valid database date.
   *
   * This is better than falsely claiming that every
   * URL was modified today.
   */
  if (validLastModified) {
    entry.lastModified = validLastModified;
  }

  sitemap.set(url, entry);
}

/**
 * Generate the complete XML sitemap.
 */
export default async function sitemap() {
  const sitemap = new Map();

  /* =========================================================
     STATIC PUBLIC PAGES
  ========================================================= */

  /**
   * Homepage
   */
  addUrl(sitemap, "/", {
    priority: 1,
    changeFrequency: "daily",
  });

  /**
   * Main property listing page
   */
  addUrl(sitemap, "/properties", {
    priority: 0.95,
    changeFrequency: "daily",
  });

  /**
   * Developers directory
   */
  addUrl(sitemap, "/developers", {
    priority: 0.88,
    changeFrequency: "weekly",
  });

  /**
   * Knowledge Centre
   */
  addUrl(sitemap, "/knowledge", {
    priority: 0.82,
    changeFrequency: "weekly",
  });

  /**
   * Property Insights
   */
  addUrl(sitemap, "/insights", {
    priority: 0.82,
    changeFrequency: "weekly",
  });

  /**
   * About page
   */
  addUrl(sitemap, "/about", {
    priority: 0.70,
    changeFrequency: "monthly",
  });

  /**
   * Contact page
   */
  addUrl(sitemap, "/contact", {
    priority: 0.70,
    changeFrequency: "monthly",
  });

  /* =========================================================
     FETCH DYNAMIC WEBSITE DATA
  ========================================================= */

  /**
   * Important:
   *
   * We intentionally DO NOT fetch locations or categories
   * because those public pages currently do not exist.
   *
   * This prevents non-existent URLs from entering the sitemap.
   */
  const [
    properties,
    developers,
    knowledgeArticles,
    insights,
  ] = await Promise.all([
    /**
     * all=true is important for the sitemap.
     *
     * We want the complete property inventory rather than
     * a normal paginated/default API response.
     */
    safeFetch(`${API}/properties?all=true`),

    safeFetch(`${API}/developers`),

    safeFetch(`${API}/knowledge`),

    /**
     * Your insights/news API currently uses /news.
     */
    safeFetch(`${API}/news`),
  ]);

  /* =========================================================
     PROPERTY PAGES
  ========================================================= */

  properties.forEach((property) => {
    /**
     * Only publicly published properties should be indexed.
     */
    if (
      !property?.slug ||
      property.status !== "published" ||
      property.isDeleted === true ||
      property.isActive === false
    ) {
      return;
    }

    addUrl(
      sitemap,
      `/${property.slug}`,
      {
        lastModified: getValidDate(
          property.updatedAt,
          property.createdAt
        ),
        priority: 0.95,
        changeFrequency: "weekly",
      }
    );
  });

  /* =========================================================
     DEVELOPER DIRECTORY + DEVELOPER DETAIL PAGES
  ========================================================= */

  developers.forEach((developer) => {
    /**
     * Skip invalid, deleted or inactive developers.
     */
    if (
      !developer?.slug ||
      developer.isDeleted === true ||
      developer.isActive === false
    ) {
      return;
    }

    addUrl(
      sitemap,
      `/developers/${developer.slug}`,
      {
        lastModified: getValidDate(
          developer.updatedAt,
          developer.createdAt
        ),
        priority: 0.82,
        changeFrequency: "monthly",
      }
    );
  });

  /* =========================================================
     KNOWLEDGE ARTICLES
  ========================================================= */

  knowledgeArticles.forEach((article) => {
    /**
     * Only published knowledge articles.
     */
    if (
      !article?.slug ||
      !isPublishedContent(article)
    ) {
      return;
    }

    addUrl(
      sitemap,
      `/knowledge/${article.slug}`,
      {
        lastModified: getValidDate(
          article.updatedAt,
          article.createdAt
        ),
        priority: 0.78,
        changeFrequency: "monthly",
      }
    );
  });

  /* =========================================================
     PROPERTY INSIGHTS / NEWS
  ========================================================= */

  insights.forEach((article) => {
    /**
     * Only published insights.
     */
    if (
      !article?.slug ||
      !isPublishedContent(article)
    ) {
      return;
    }

    addUrl(
      sitemap,
      `/insights/${article.slug}`,
      {
        lastModified: getValidDate(
          article.updatedAt,
          article.createdAt
        ),
        priority: 0.78,
        changeFrequency: "weekly",
      }
    );
  });

  /* =========================================================
     FINAL SORTING
  ========================================================= */

  const sortedUrls = [...sitemap.values()].sort(
    (a, b) => {
      /**
       * Homepage always first.
       */
      if (a.url === BASE_URL) {
        return -1;
      }

      if (b.url === BASE_URL) {
        return 1;
      }

      /**
       * Higher priority first.
       */
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }

      /**
       * Alphabetical ordering provides a deterministic sitemap.
       */
      return a.url.localeCompare(b.url);
    }
  );

  console.log(
    `✅ Sitemap generated successfully: ${sortedUrls.length} URLs`
  );

  return sortedUrls;
}