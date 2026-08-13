const API = "https://propertybouquet.com/api";
const BASE_URL = "https://propertybouquet.com";

const REVALIDATE_TIME = 3600;

/**
 * Common fetch configuration.
 *
 * The sitemap API data is cached and revalidated every hour.
 *
 * IMPORTANT:
 * We intentionally do NOT use:
 *
 * export const revalidate = REVALIDATE_TIME;
 *
 * because Next.js 16 can reject that segment configuration
 * on this metadata route.
 */
const FETCH_OPTIONS = {
  next: {
    revalidate: REVALIDATE_TIME,
  },
};

/**
 * Safely fetch API data.
 *
 * If one API endpoint fails, sitemap generation continues
 * using the remaining available data.
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
     * Your API normally returns:
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
 * Convert possible database date values into a valid Date.
 *
 * Returns undefined when none of the supplied values
 * contain a valid date.
 */
function getValidDate(...values) {
  for (const value of values) {
    if (!value) {
      continue;
    }

    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return undefined;
}

/**
 * Check whether a document is active and should be
 * considered for public indexing.
 */
function isActive(item) {
  if (!item) {
    return false;
  }

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
 * Used for Knowledge Centre articles and Insights.
 */
function isPublishedContent(item) {
  if (!isActive(item)) {
    return false;
  }

  /**
   * If a status field exists, only published content
   * should be included.
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
 * A Map is used to prevent duplicate URLs.
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
  if (!path) {
    return;
  }

  const url = path.startsWith("http")
    ? path
    : `${BASE_URL}${
        path.startsWith("/") ? path : `/${path}`
      }`;

  /**
   * Prevent duplicate URLs.
   */
  if (sitemap.has(url)) {
    return;
  }

  const entry = {
    url,
    changeFrequency,
    priority,
  };

  /**
   * Only include lastModified when we have a valid
   * database date.
   *
   * This is better than falsely claiming that every
   * page was modified today.
   */
  const validLastModified = getValidDate(lastModified);

  if (validLastModified) {
    entry.lastModified = validLastModified;
  }

  sitemap.set(url, entry);
}

/**
 * Generate the complete Property Bouquet sitemap.
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
     DYNAMIC WEBSITE DATA
  ========================================================= */

  /**
   * IMPORTANT:
   *
   * We intentionally DO NOT include:
   *
   * /locations
   * /locations/[slug]
   * /categories
   * /categories/[slug]
   *
   * because these are not currently public website routes.
   *
   * We also do not include:
   *
   * /admin
   * /auth
   * /login
   * /forgot-password
   * /reset-password
   *
   * because these are private/system routes.
   */

  const [
    properties,
    developers,
    knowledgeArticles,
    insights,
  ] = await Promise.all([
    /**
     * Fetch the complete property inventory.
     *
     * all=true is important so the sitemap does not
     * accidentally receive only a paginated/default
     * subset of properties.
     */
    safeFetch(`${API}/properties?all=true`),

    /**
     * Fetch developers.
     */
    safeFetch(`${API}/developers`),

    /**
     * Fetch Knowledge Centre articles.
     */
    safeFetch(`${API}/knowledge`),

    /**
     * Your Insights / News API uses /news.
     */
    safeFetch(`${API}/news`),
  ]);

  /* =========================================================
     PROPERTY DETAIL PAGES
  ========================================================= */

  properties.forEach((property) => {
    /**
     * Only publicly published properties should enter
     * the sitemap.
     */
    if (
      !property?.slug ||
      property.status !== "published" ||
      property.isDeleted === true ||
      property.isActive === false
    ) {
      return;
    }

    /**
     * Property pages use:
     *
     * https://propertybouquet.com/{slug}
     */
    addUrl(sitemap, `/${property.slug}`, {
      lastModified: getValidDate(
        property.updatedAt,
        property.createdAt
      ),
      priority: 0.95,
      changeFrequency: "weekly",
    });
  });

  /* =========================================================
     DEVELOPER DETAIL PAGES
  ========================================================= */

  developers.forEach((developer) => {
    /**
     * Skip developers without a slug.
     */
    if (!developer?.slug) {
      return;
    }

    /**
     * Skip deleted developers.
     */
    if (developer.isDeleted === true) {
      return;
    }

    /**
     * Skip inactive developers.
     */
    if (developer.isActive === false) {
      return;
    }

    /**
     * Developer pages use:
     *
     * https://propertybouquet.com/developers/{slug}
     */
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
     KNOWLEDGE CENTRE ARTICLES
  ========================================================= */

  knowledgeArticles.forEach((article) => {
    /**
     * Only valid published articles should be indexed.
     */
    if (
      !article?.slug ||
      !isPublishedContent(article)
    ) {
      return;
    }

    /**
     * Knowledge pages use:
     *
     * https://propertybouquet.com/knowledge/{slug}
     */
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
     PROPERTY INSIGHTS / NEWS ARTICLES
  ========================================================= */

  insights.forEach((article) => {
    /**
     * Only valid published insight articles should be indexed.
     */
    if (
      !article?.slug ||
      !isPublishedContent(article)
    ) {
      return;
    }

    /**
     * Insights pages use:
     *
     * https://propertybouquet.com/insights/{slug}
     */
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
     FINAL URL SORTING
  ========================================================= */

  const sortedUrls = [...sitemap.values()].sort(
    (a, b) => {
      /**
       * Keep homepage first.
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
       * Alphabetical ordering provides deterministic
       * sitemap output.
       */
      return a.url.localeCompare(b.url);
    }
  );

  /**
   * Helpful production log.
   */
  console.log(
    `✅ Sitemap generated successfully: ${sortedUrls.length} URLs`
  );

  return sortedUrls;
}