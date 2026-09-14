// ============================================================
// PROPERTY BOUQUET — PRODUCTION SEO SITEMAP
// ============================================================
//
// File:
// src/app/sitemap.js
//
// Canonical domain:
// https://propertybouquet.com
//
// IMPORTANT:
// This sitemap contains ONLY canonical public URLs.
//
// EXCLUDED:
// - Admin pages
// - Authentication pages
// - API routes
// - Draft properties
// - Deleted properties
// - Inactive properties
// - Draft knowledge content
// - Draft insight/news content
// - Query/filter URLs
// - Duplicate URLs
// - Non-canonical URLs
//
// Developer URL architecture:
//
// m3m
// → /developers/m3m-developer-projects
//
// signature-global
// → /developers/signature-global-developer-projects
//
// spiti-developer
// → /developers/spiti-developer-projects
//
// ats-infrastructure-ltd
// → /developers/ats-infrastructure-ltd-developer-projects
// ============================================================

const API =
  "https://propertybouquet.com/api";

const BASE_URL =
  "https://propertybouquet.com";

const REVALIDATE_TIME = 3600;


// ============================================================
// FETCH OPTIONS
// ============================================================

const FETCH_OPTIONS = {
  next: {
    revalidate: REVALIDATE_TIME,
  },
};


// ============================================================
// SAFE FETCH
// ============================================================

async function safeFetch(url) {
  try {
    const response = await fetch(
      url,
      FETCH_OPTIONS
    );

    if (!response.ok) {
      console.warn(
        `⚠️ Sitemap API request failed: ${url} → ${response.status}`
      );

      return [];
    }

    const json = await response.json();

    // Standard API response
    if (Array.isArray(json?.data)) {
      return json.data;
    }

    // Direct array
    if (Array.isArray(json)) {
      return json;
    }

    // Properties
    if (Array.isArray(json?.properties)) {
      return json.properties;
    }

    // Developers
    if (Array.isArray(json?.developers)) {
      return json.developers;
    }

    // Articles
    if (Array.isArray(json?.articles)) {
      return json.articles;
    }

    // News
    if (Array.isArray(json?.news)) {
      return json.news;
    }

    console.warn(
      `⚠️ Sitemap API returned an unexpected data format: ${url}`
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


// ============================================================
// VALID DATE
// ============================================================

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


// ============================================================
// ACTIVE DOCUMENT CHECK
// ============================================================

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


// ============================================================
// PUBLISHED CONTENT CHECK
// ============================================================

function isPublishedContent(item) {
  if (!isActive(item)) {
    return false;
  }

  if (
    item.status !== undefined &&
    item.status !== null &&
    item.status !== "published"
  ) {
    return false;
  }

  return true;
}


// ============================================================
// CANONICAL URL NORMALIZER
// ============================================================
//
// This is important.
//
// It guarantees that sitemap URLs:
// - use HTTPS
// - use non-www
// - contain no query strings
// - contain no hash fragments
// - don't have unnecessary trailing slashes
// - remain on propertybouquet.com
// ============================================================

function normalizeUrl(path) {
  if (!path) {
    return null;
  }

  let value = String(path).trim();

  if (!value) {
    return null;
  }

  // ----------------------------------------------------------
  // Absolute URL
  // ----------------------------------------------------------

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);

      // Only allow our own domain.
      if (
        parsed.hostname !==
        "propertybouquet.com"
      ) {
        return null;
      }

      // Force HTTPS.
      parsed.protocol = "https:";

      // Force non-www.
      parsed.hostname =
        "propertybouquet.com";

      // Remove query parameters.
      parsed.search = "";

      // Remove hash.
      parsed.hash = "";

      // Normalize pathname.
      let pathname =
        parsed.pathname || "/";

      if (
        pathname !== "/" &&
        pathname.endsWith("/")
      ) {
        pathname =
          pathname.slice(0, -1);
      }

      parsed.pathname = pathname;

      return parsed.toString();
    } catch {
      return null;
    }
  }

  // ----------------------------------------------------------
  // Relative URL
  // ----------------------------------------------------------

  if (!value.startsWith("/")) {
    value = `/${value}`;
  }

  // Remove query string.
  value = value.split("?")[0];

  // Remove hash.
  value = value.split("#")[0];

  // Remove trailing slash except homepage.
  if (
    value !== "/" &&
    value.endsWith("/")
  ) {
    value = value.slice(0, -1);
  }

  return `${BASE_URL}${value}`;
}


// ============================================================
// ADD URL
// ============================================================

function addUrl(
  sitemap,
  path,
  {
    lastModified,
    changeFrequency = "weekly",
    priority = 0.7,
  } = {}
) {
  const url = normalizeUrl(path);

  if (!url) {
    return;
  }

  // Prevent duplicates.
  if (sitemap.has(url)) {
    return;
  }

  const entry = {
    url,
    changeFrequency,
    priority,
  };

  const validLastModified =
    getValidDate(lastModified);

  if (validLastModified) {
    entry.lastModified =
      validLastModified;
  }

  sitemap.set(url, entry);
}


// ============================================================
// SAFE SLUG
// ============================================================

function safeSlug(slug) {
  if (!slug) {
    return null;
  }

  const value =
    String(slug).trim();

  if (!value) {
    return null;
  }

  return encodeURIComponent(
    value
  );
}


// ============================================================
// PUBLIC DEVELOPER SLUG BUILDER
// ============================================================

function buildPublicDeveloperSlug(
  developerSlug
) {
  if (!developerSlug) {
    return "";
  }

  const cleanSlug =
    String(developerSlug)
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "";
  }

  // Already canonical.
  if (
    cleanSlug.endsWith(
      "-developer-projects"
    )
  ) {
    return cleanSlug;
  }

  // Existing "-developer".
  if (
    cleanSlug.endsWith(
      "-developer"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // Normal backend slug.
  return `${cleanSlug}-developer-projects`;
}


// ============================================================
// MAIN SITEMAP
// ============================================================

export default async function sitemap() {
  const sitemap =
    new Map();

  // ==========================================================
  // STATIC PUBLIC PAGES
  // ==========================================================

  addUrl(sitemap, "/", {
    priority: 1.0,
    changeFrequency: "daily",
  });

  addUrl(
    sitemap,
    "/properties",
    {
      priority: 0.95,
      changeFrequency: "daily",
    }
  );

  addUrl(
    sitemap,
    "/developers",
    {
      priority: 0.90,
      changeFrequency: "weekly",
    }
  );

  addUrl(
    sitemap,
    "/knowledge",
    {
      priority: 0.82,
      changeFrequency: "weekly",
    }
  );

  addUrl(
    sitemap,
    "/insights",
    {
      priority: 0.82,
      changeFrequency: "weekly",
    }
  );

  addUrl(
    sitemap,
    "/about",
    {
      priority: 0.70,
      changeFrequency: "monthly",
    }
  );

  addUrl(
    sitemap,
    "/contact",
    {
      priority: 0.70,
      changeFrequency: "monthly",
    }
  );

  // Human-facing sitemap.
  addUrl(
    sitemap,
    "/sitemap",
    {
      priority: 0.60,
      changeFrequency: "monthly",
    }
  );

  // Legal pages.
  addUrl(
    sitemap,
    "/privacy-policy",
    {
      priority: 0.50,
      changeFrequency: "yearly",
    }
  );

  addUrl(
    sitemap,
    "/disclaimer",
    {
      priority: 0.50,
      changeFrequency: "yearly",
    }
  );

  addUrl(
    sitemap,
    "/terms-of-use",
    {
      priority: 0.50,
      changeFrequency: "yearly",
    }
  );


  // ==========================================================
  // PUBLIC SEO TOOLS
  // ==========================================================

  addUrl(
    sitemap,
    "/tools/roi-calculator",
    {
      priority: 0.85,
      changeFrequency: "monthly",
    }
  );

  addUrl(
    sitemap,
    "/tools/area-converter",
    {
      priority: 0.85,
      changeFrequency: "monthly",
    }
  );


  // ==========================================================
  // FETCH DYNAMIC DATA
  // ==========================================================

  const [
    properties,
    developers,
    knowledgeArticles,
    insights,
  ] = await Promise.all([
    safeFetch(
      `${API}/properties?all=true`
    ),

    safeFetch(
      `${API}/developers`
    ),

    safeFetch(
      `${API}/knowledge`
    ),

    safeFetch(
      `${API}/news`
    ),
  ]);


  // ==========================================================
  // PROPERTY PAGES
  // ==========================================================

  properties.forEach(
    (property) => {
      if (!property) {
        return;
      }

      const slug =
        safeSlug(
          property.slug
        );

      if (!slug) {
        return;
      }

      // Published only.
      if (
        property.status !==
        "published"
      ) {
        return;
      }

      // Deleted excluded.
      if (
        property.isDeleted === true
      ) {
        return;
      }

      // Inactive excluded.
      if (
        property.isActive === false
      ) {
        return;
      }

      addUrl(
        sitemap,
        `/${slug}`,
        {
          lastModified:
            getValidDate(
              property.updatedAt,
              property.createdAt
            ),
          priority: 0.95,
          changeFrequency: "weekly",
        }
      );
    }
  );


  // ==========================================================
  // DEVELOPER PAGES
  // ==========================================================

  developers.forEach(
    (developer) => {
      if (!developer) {
        return;
      }

      const backendDeveloperSlug =
        developer.slug ||
        developer.backendSlug ||
        developer.developerSlug ||
        developer.data?.slug ||
        developer.data?.backendSlug ||
        developer.data?.developerSlug ||
        developer.developer?.slug ||
        "";

      const publicDeveloperSlug =
        buildPublicDeveloperSlug(
          backendDeveloperSlug
        );

      if (!publicDeveloperSlug) {
        return;
      }

      if (
        developer.isDeleted === true
      ) {
        return;
      }

      if (
        developer.isActive === false
      ) {
        return;
      }

      addUrl(
        sitemap,
        `/developers/${encodeURIComponent(
          publicDeveloperSlug
        )}`,
        {
          lastModified:
            getValidDate(
              developer.updatedAt,
              developer.createdAt
            ),
          priority: 0.82,
          changeFrequency: "monthly",
        }
      );
    }
  );


  // ==========================================================
  // KNOWLEDGE ARTICLES
  // ==========================================================

  knowledgeArticles.forEach(
    (article) => {
      if (!article) {
        return;
      }

      const slug =
        safeSlug(
          article.slug
        );

      if (!slug) {
        return;
      }

      if (
        !isPublishedContent(
          article
        )
      ) {
        return;
      }

      addUrl(
        sitemap,
        `/knowledge/${slug}`,
        {
          lastModified:
            getValidDate(
              article.updatedAt,
              article.createdAt
            ),
          priority: 0.78,
          changeFrequency: "monthly",
        }
      );
    }
  );


  // ==========================================================
  // PROPERTY INSIGHTS / NEWS
  // ==========================================================

  insights.forEach(
    (article) => {
      if (!article) {
        return;
      }

      const slug =
        safeSlug(
          article.slug
        );

      if (!slug) {
        return;
      }

      if (
        !isPublishedContent(
          article
        )
      ) {
        return;
      }

      addUrl(
        sitemap,
        `/insights/${slug}`,
        {
          lastModified:
            getValidDate(
              article.updatedAt,
              article.createdAt
            ),
          priority: 0.78,
          changeFrequency: "weekly",
        }
      );
    }
  );


  // ==========================================================
  // FINAL SORT
  // ==========================================================

  const sortedUrls =
    [...sitemap.values()]
      .sort((a, b) => {
        // Homepage first.
        if (
          a.url ===
          `${BASE_URL}/`
        ) {
          return -1;
        }

        if (
          b.url ===
          `${BASE_URL}/`
        ) {
          return 1;
        }

        // Higher priority first.
        if (
          a.priority !==
          b.priority
        ) {
          return (
            b.priority -
            a.priority
          );
        }

        // Alphabetical.
        return a.url.localeCompare(
          b.url
        );
      });


  // ==========================================================
  // DIAGNOSTICS
  // ==========================================================

  console.log(
    `✅ Property Bouquet sitemap generated successfully: ${sortedUrls.length} URLs`
  );

  console.log(
    `📊 Sitemap breakdown → Properties: ${properties.length}, Developers: ${developers.length}, Knowledge: ${knowledgeArticles.length}, Insights: ${insights.length}`
  );


  // ==========================================================
  // RETURN
  // ==========================================================

  return sortedUrls;
}