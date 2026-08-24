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
// INCLUDED:
// - Homepage
// - Properties directory
// - Developers directory
// - Knowledge Centre
// - Property Insights
// - About
// - Contact
// - Human-facing Sitemap
// - Privacy Policy
// - Disclaimer
// - Terms of Use
// - Public property pages
// - Public developer pages
// - Published knowledge articles
// - Published insight/news articles
// - Public SEO tools
//
// EXCLUDED:
// - Admin pages
// - Authentication pages
// - API routes
// - Draft properties
// - Deleted properties
// - Inactive properties
// - Inactive/deleted developers
// - Draft knowledge content
// - Draft insight/news content
// - Query/filter URLs
// - Duplicate URLs
//
// IMPORTANT:
// - Canonical domain is NON-WWW.
// - No query parameters are added.
// - No fake lastModified dates are generated.
// - API failure does not break the sitemap.
// - Duplicate URLs are automatically removed.
//
// ============================================================

const API = "https://propertybouquet.com/api";
const BASE_URL = "https://propertybouquet.com";

const REVALIDATE_TIME = 3600;

// ============================================================
// FETCH OPTIONS
// ============================================================
//
// Cache API responses for one hour.
//
// We use fetch-level revalidation rather than a route-level
// revalidate export so this remains compatible with the current
// Next.js setup.
//

const FETCH_OPTIONS = {
  next: {
    revalidate: REVALIDATE_TIME,
  },
};

// ============================================================
// SAFE FETCH
// ============================================================
//
// If an API endpoint fails, sitemap generation continues.
//
// This prevents one unavailable CMS endpoint from taking down
// the complete sitemap.
//

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

    // ----------------------------------------------------------
    // Standard API response:
    //
    // {
    //   data: [...]
    // }
    // ----------------------------------------------------------

    if (Array.isArray(json?.data)) {
      return json.data;
    }

    // ----------------------------------------------------------
    // Direct array response.
    // ----------------------------------------------------------

    if (Array.isArray(json)) {
      return json;
    }

    // ----------------------------------------------------------
    // Some APIs may return:
    //
    // {
    //   properties: [...]
    // }
    //
    // or similar structures.
    //
    // These fallbacks make the sitemap more tolerant without
    // changing the canonical URL architecture.
    // ----------------------------------------------------------

    if (Array.isArray(json?.properties)) {
      return json.properties;
    }

    if (Array.isArray(json?.developers)) {
      return json.developers;
    }

    if (Array.isArray(json?.articles)) {
      return json.articles;
    }

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
// VALID DATE HELPER
// ============================================================
//
// Returns the first valid date from the supplied values.
//
// We NEVER use the current date as a fallback because doing so
// would falsely indicate that every URL was recently modified.
//

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

  // Explicitly deleted
  if (item.isDeleted === true) {
    return false;
  }

  // Explicitly inactive
  if (item.isActive === false) {
    return false;
  }

  return true;
}

// ============================================================
// PUBLISHED CONTENT CHECK
// ============================================================
//
// Used for:
// - Knowledge Centre
// - Insights
// - News
//
// If status exists, only "published" is allowed.
//
// If status does not exist, active content may still be included.
//

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
// NORMALIZE URL
// ============================================================
//
// Converts relative paths to the canonical Property Bouquet
// domain.
//
// Examples:
//
// "/"                  → https://propertybouquet.com/
// "/properties"       → https://propertybouquet.com/properties
// "properties"        → https://propertybouquet.com/properties
//
// Absolute URLs are preserved.
//

function normalizeUrl(path) {
  if (!path) {
    return null;
  }

  const value = String(path).trim();

  if (!value) {
    return null;
  }

  // ----------------------------------------------------------
  // Already absolute
  // ----------------------------------------------------------

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // ----------------------------------------------------------
  // Relative path
  // ----------------------------------------------------------

  const normalizedPath = value.startsWith("/")
    ? value
    : `/${value}`;

  return `${BASE_URL}${normalizedPath}`;
}

// ============================================================
// ADD URL
// ============================================================
//
// Map-based storage guarantees that the final sitemap never
// contains duplicate URLs.
//

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

  // ----------------------------------------------------------
  // Never add duplicates.
  // ----------------------------------------------------------

  if (sitemap.has(url)) {
    return;
  }

  const entry = {
    url,
    changeFrequency,
    priority,
  };

  // ----------------------------------------------------------
  // Add lastModified only when a genuine date exists.
  // ----------------------------------------------------------

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
//
// Prevent malformed URLs if a slug unexpectedly contains
// spaces or special characters.
//

function safeSlug(slug) {
  if (!slug) {
    return null;
  }

  const value = String(slug).trim();

  if (!value) {
    return null;
  }

  return encodeURIComponent(value);
}

// ============================================================
// MAIN SITEMAP
// ============================================================

export default async function sitemap() {
  const sitemap = new Map();

  // ==========================================================
  // STATIC PUBLIC PAGES
  // ==========================================================

  // ----------------------------------------------------------
  // HOMEPAGE
  // ----------------------------------------------------------

  addUrl(sitemap, "/", {
    priority: 1.0,
    changeFrequency: "daily",
  });

  // ----------------------------------------------------------
  // PROPERTY DIRECTORY
  // ----------------------------------------------------------

  addUrl(sitemap, "/properties", {
    priority: 0.95,
    changeFrequency: "daily",
  });

  // ----------------------------------------------------------
  // DEVELOPERS DIRECTORY
  // ----------------------------------------------------------

  addUrl(sitemap, "/developers", {
    priority: 0.90,
    changeFrequency: "weekly",
  });

  // ----------------------------------------------------------
  // KNOWLEDGE CENTRE
  // ----------------------------------------------------------

  addUrl(sitemap, "/knowledge", {
    priority: 0.82,
    changeFrequency: "weekly",
  });

  // ----------------------------------------------------------
  // PROPERTY INSIGHTS
  // ----------------------------------------------------------

  addUrl(sitemap, "/insights", {
    priority: 0.82,
    changeFrequency: "weekly",
  });

  // ----------------------------------------------------------
  // ABOUT
  // ----------------------------------------------------------

  addUrl(sitemap, "/about", {
    priority: 0.70,
    changeFrequency: "monthly",
  });

  // ----------------------------------------------------------
  // CONTACT
  // ----------------------------------------------------------

  addUrl(sitemap, "/contact", {
    priority: 0.70,
    changeFrequency: "monthly",
  });

  // ----------------------------------------------------------
  // HUMAN-FACING SITEMAP
  //
  // This is different from /sitemap.xml.
  // ----------------------------------------------------------

  addUrl(sitemap, "/sitemap", {
    priority: 0.60,
    changeFrequency: "monthly",
  });

  // ----------------------------------------------------------
  // PRIVACY POLICY
  // ----------------------------------------------------------

  addUrl(sitemap, "/privacy", {
    priority: 0.50,
    changeFrequency: "yearly",
  });

  // ----------------------------------------------------------
  // DISCLAIMER
  // ----------------------------------------------------------

  addUrl(sitemap, "/disclaimer", {
    priority: 0.50,
    changeFrequency: "yearly",
  });

  // ----------------------------------------------------------
  // TERMS OF USE
  // ----------------------------------------------------------

  addUrl(sitemap, "/terms-of-use", {
    priority: 0.50,
    changeFrequency: "yearly",
  });

  // ==========================================================
  // PUBLIC PROPERTY TOOLS
  // ==========================================================
  //
  // IMPORTANT:
  // Only include routes that actually exist publicly.
  //
  // Current known public tools:
  //
  // /tools/roi-calculator
  // /tools/area-converter
  //
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
  //
  // All API requests run in parallel.
  //
  // If one fails, safeFetch() returns [] and the rest of the
  // sitemap continues normally.
  //
  // ==========================================================

  const [
    properties,
    developers,
    knowledgeArticles,
    insights,
  ] = await Promise.all([
    // --------------------------------------------------------
    // PROPERTIES
    // --------------------------------------------------------
    //
    // all=true ensures we don't accidentally sitemap only
    // the default paginated API response.
    //

    safeFetch(
      `${API}/properties?all=true`
    ),

    // --------------------------------------------------------
    // DEVELOPERS
    // --------------------------------------------------------

    safeFetch(
      `${API}/developers`
    ),

    // --------------------------------------------------------
    // KNOWLEDGE CENTRE
    // --------------------------------------------------------

    safeFetch(
      `${API}/knowledge`
    ),

    // --------------------------------------------------------
    // INSIGHTS / NEWS
    // --------------------------------------------------------

    safeFetch(
      `${API}/news`
    ),
  ]);

  // ==========================================================
  // PROPERTY DETAIL PAGES
  // ==========================================================

  properties.forEach((property) => {
    const slug = safeSlug(
      property?.slug
    );

    // --------------------------------------------------------
    // Slug required.
    // --------------------------------------------------------

    if (!slug) {
      return;
    }

    // --------------------------------------------------------
    // ONLY PUBLISHED PROPERTIES
    // --------------------------------------------------------

    if (
      property?.status !==
      "published"
    ) {
      return;
    }

    // --------------------------------------------------------
    // EXCLUDE DELETED PROPERTIES
    // --------------------------------------------------------

    if (
      property?.isDeleted === true
    ) {
      return;
    }

    // --------------------------------------------------------
    // EXCLUDE INACTIVE PROPERTIES
    // --------------------------------------------------------

    if (
      property?.isActive === false
    ) {
      return;
    }

    // --------------------------------------------------------
    // PUBLIC PROPERTY ARCHITECTURE:
    //
    // https://propertybouquet.com/{slug}
    // --------------------------------------------------------

    addUrl(
      sitemap,
      `/${slug}`,
      {
        lastModified:
          getValidDate(
            property?.updatedAt,
            property?.createdAt
          ),

        priority: 0.95,

        changeFrequency:
          "weekly",
      }
    );
  });

  // ==========================================================
  // DEVELOPER DETAIL PAGES
  // ==========================================================

  developers.forEach(
    (developer) => {
      const slug =
        safeSlug(
          developer?.slug
        );

      // ------------------------------------------------------
      // Slug required.
      // ------------------------------------------------------

      if (!slug) {
        return;
      }

      // ------------------------------------------------------
      // Exclude deleted developers.
      // ------------------------------------------------------

      if (
        developer?.isDeleted === true
      ) {
        return;
      }

      // ------------------------------------------------------
      // Exclude inactive developers.
      // ------------------------------------------------------

      if (
        developer?.isActive === false
      ) {
        return;
      }

      // ------------------------------------------------------
      // Developer URL:
      //
      // /developers/{slug}
      // ------------------------------------------------------

      addUrl(
        sitemap,
        `/developers/${slug}`,
        {
          lastModified:
            getValidDate(
              developer?.updatedAt,
              developer?.createdAt
            ),

          priority: 0.82,

          changeFrequency:
            "monthly",
        }
      );
    }
  );

  // ==========================================================
  // KNOWLEDGE CENTRE ARTICLES
  // ==========================================================

  knowledgeArticles.forEach(
    (article) => {
      const slug =
        safeSlug(
          article?.slug
        );

      if (!slug) {
        return;
      }

      // ------------------------------------------------------
      // Only published and active content.
      // ------------------------------------------------------

      if (
        !isPublishedContent(
          article
        )
      ) {
        return;
      }

      // ------------------------------------------------------
      // Knowledge URL:
      //
      // /knowledge/{slug}
      // ------------------------------------------------------

      addUrl(
        sitemap,
        `/knowledge/${slug}`,
        {
          lastModified:
            getValidDate(
              article?.updatedAt,
              article?.createdAt
            ),

          priority: 0.78,

          changeFrequency:
            "monthly",
        }
      );
    }
  );

  // ==========================================================
  // PROPERTY INSIGHTS / NEWS
  // ==========================================================

  insights.forEach(
    (article) => {
      const slug =
        safeSlug(
          article?.slug
        );

      if (!slug) {
        return;
      }

      // ------------------------------------------------------
      // Only published and active content.
      // ------------------------------------------------------

      if (
        !isPublishedContent(
          article
        )
      ) {
        return;
      }

      // ------------------------------------------------------
      // Insights URL:
      //
      // /insights/{slug}
      // ------------------------------------------------------

      addUrl(
        sitemap,
        `/insights/${slug}`,
        {
          lastModified:
            getValidDate(
              article?.updatedAt,
              article?.createdAt
            ),

          priority: 0.78,

          changeFrequency:
            "weekly",
        }
      );
    }
  );

  // ==========================================================
  // FINAL SORT
  // ==========================================================
  //
  // Sitemap ordering does not affect Google rankings.
  //
  // We use deterministic ordering for cleaner output and
  // easier debugging.
  //
  // Homepage → priority → URL.
  //
  // ==========================================================

  const sortedUrls = [
    ...sitemap.values(),
  ].sort((a, b) => {
    // --------------------------------------------------------
    // Homepage first.
    // --------------------------------------------------------

    if (
      a.url === `${BASE_URL}/`
    ) {
      return -1;
    }

    if (
      b.url === `${BASE_URL}/`
    ) {
      return 1;
    }

    // --------------------------------------------------------
    // Higher priority first.
    // --------------------------------------------------------

    if (
      a.priority !==
      b.priority
    ) {
      return (
        b.priority -
        a.priority
      );
    }

    // --------------------------------------------------------
    // Alphabetical URL ordering.
    // --------------------------------------------------------

    return a.url.localeCompare(
      b.url
    );
  });

  // ==========================================================
  // PRODUCTION DIAGNOSTICS
  // ==========================================================

  console.log(
    `✅ Property Bouquet sitemap generated successfully: ${sortedUrls.length} URLs`
  );

  console.log(
    `📊 Sitemap breakdown → Properties: ${properties.length}, Developers: ${developers.length}, Knowledge: ${knowledgeArticles.length}, Insights: ${insights.length}`
  );

  // ==========================================================
  // RETURN NEXT.JS SITEMAP
  // ==========================================================

  return sortedUrls;
}