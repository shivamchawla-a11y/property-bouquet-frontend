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
// - Only canonical public URLs are included.
// - www URLs are intentionally NOT included.
// - Query/filter URLs are intentionally NOT included.
// - Draft/deleted/inactive content is excluded.
// - API failures do not break sitemap generation.
// - Duplicate URLs are automatically removed.
// - Database dates are used for lastModified when valid.
//
// ============================================================

const API = "https://propertybouquet.com/api";
const BASE_URL = "https://propertybouquet.com";

const REVALIDATE_TIME = 3600;

// ============================================================
// COMMON FETCH OPTIONS
// ============================================================
//
// Sitemap data is cached for one hour.
//
// We intentionally use fetch-level revalidation instead of:
//
// export const revalidate = 3600;
//
// because this metadata route should remain compatible with
// the current Next.js 16 setup.
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
// If one endpoint fails, the sitemap continues generating
// from the remaining available data.
//
// This is important because one failed CMS/API endpoint
// should never prevent the complete sitemap from rendering.
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
    // Some endpoints may directly return an array.
    // ----------------------------------------------------------

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

// ============================================================
// VALID DATE HELPER
// ============================================================
//
// Converts MongoDB/API date values into valid Date objects.
//
// If no valid date exists, undefined is returned.
//
// We do NOT use the current date as a fake lastModified date.
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
//
// Used for developers and other CMS documents.
//

function isActive(item) {
  if (!item) {
    return false;
  }

  // Deleted document
  if (item.isDeleted === true) {
    return false;
  }

  // Explicitly inactive document
  if (item.isActive === false) {
    return false;
  }

  return true;
}

// ============================================================
// PUBLISHED CONTENT CHECK
// ============================================================
//
// Used for Knowledge Centre and Insights/News.
//
// If the API has a status field, only "published" content
// is allowed.
//
// If no status field exists, the content can still be included
// as long as it is active.
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
// NORMALIZE PATH
// ============================================================
//
// Ensures paths are converted into canonical non-www URLs.
//
// Examples:
//
// "/"                         → https://propertybouquet.com/
// "/properties"              → https://propertybouquet.com/properties
// "properties"               → https://propertybouquet.com/properties
// "https://propertybouquet..." remains unchanged
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
  // Already an absolute URL
  // ----------------------------------------------------------

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // ----------------------------------------------------------
  // Relative URL
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
// Uses a Map so duplicate URLs can never enter the sitemap.
//
// This is especially useful when:
// - API data contains duplicates
// - multiple sections reference the same URL
// - static and dynamic URLs overlap
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
  // Prevent duplicate URLs
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
  // Only include lastModified when a real valid date exists.
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
// Slugs normally contain URL-safe characters.
//
// encodeURIComponent prevents malformed URLs if a slug
// unexpectedly contains spaces or special characters.
//

function safeSlug(slug) {
  if (!slug) {
    return null;
  }

  return encodeURIComponent(
    String(slug).trim()
  );
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
  // HUMAN-FACING SITEMAP PAGE
  //
  // This is different from /sitemap.xml.
  // ----------------------------------------------------------

  addUrl(sitemap, "/sitemap", {
    priority: 0.60,
    changeFrequency: "monthly",
  });

  // ==========================================================
  // PROPERTY TOOLS
  // ==========================================================
  //
  // These are public, useful SEO landing pages and should be
  // discoverable by search engines.
  //
  // IMPORTANT:
  // Keep ONLY tools that actually exist as public routes.
  //
  // Current known tools:
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
  // DYNAMIC API DATA
  // ==========================================================
  //
  // Fetch everything in parallel.
  //
  // If one API fails, safeFetch() returns [] and the remaining
  // sitemap sections continue normally.
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
    // all=true is important so the sitemap does not receive
    // only a default/paginated subset of properties.
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
    // --------------------------------------------------------
    // Must have a slug.
    // --------------------------------------------------------

    const slug =
      safeSlug(property?.slug);

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
    // NEVER INDEX DELETED PROPERTIES
    // --------------------------------------------------------

    if (
      property?.isDeleted === true
    ) {
      return;
    }

    // --------------------------------------------------------
    // NEVER INDEX INACTIVE PROPERTIES
    // --------------------------------------------------------

    if (
      property?.isActive === false
    ) {
      return;
    }

    // --------------------------------------------------------
    // PROPERTY URL
    //
    // Your current public property architecture uses:
    //
    // https://propertybouquet.com/{slug}
    //
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
      // Developer must have a slug.
      // ------------------------------------------------------

      if (!slug) {
        return;
      }

      // ------------------------------------------------------
      // Deleted developers are excluded.
      // ------------------------------------------------------

      if (
        developer?.isDeleted === true
      ) {
        return;
      }

      // ------------------------------------------------------
      // Inactive developers are excluded.
      // ------------------------------------------------------

      if (
        developer?.isActive === false
      ) {
        return;
      }

      // ------------------------------------------------------
      // Developer detail URL
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
      // Only published, active articles.
      // ------------------------------------------------------

      if (
        !isPublishedContent(
          article
        )
      ) {
        return;
      }

      // ------------------------------------------------------
      // Knowledge article URL
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
      // Only published, active content.
      // ------------------------------------------------------

      if (
        !isPublishedContent(
          article
        )
      ) {
        return;
      }

      // ------------------------------------------------------
      // Insights article URL
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
  // FINAL SORTING
  // ==========================================================
  //
  // Sitemap order does NOT affect rankings.
  //
  // We still use deterministic ordering because it makes:
  // - debugging easier
  // - deployments easier to inspect
  // - sitemap output cleaner
  //
  // Homepage remains first.
  // Then higher-priority URLs.
  // Then alphabetical URL order.
  //
  // ==========================================================

  const sortedUrls = [
    ...sitemap.values(),
  ].sort((a, b) => {
    // --------------------------------------------------------
    // Homepage first
    // --------------------------------------------------------

    if (a.url === BASE_URL) {
      return -1;
    }

    if (b.url === BASE_URL) {
      return 1;
    }

    // --------------------------------------------------------
    // Higher priority first
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
    // Deterministic alphabetical order
    // --------------------------------------------------------

    return a.url.localeCompare(
      b.url
    );
  });

  // ==========================================================
  // PRODUCTION LOG
  // ==========================================================

  console.log(
    `✅ Property Bouquet sitemap generated successfully: ${sortedUrls.length} URLs`
  );

  // Helpful diagnostics during deployment.
  console.log(
    `📊 Sitemap breakdown → Properties: ${properties.length}, Developers: ${developers.length}, Knowledge: ${knowledgeArticles.length}, Insights: ${insights.length}`
  );

  // ==========================================================
  // RETURN NEXT.JS SITEMAP
  // ==========================================================

  return sortedUrls;
}