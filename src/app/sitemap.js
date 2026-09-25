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
// LOCATION URL ARCHITECTURE:
//
// Sector 56
// → /locations/properties-in-sector-56-gurgaon
//
// Golf Course Road
// → /locations/properties-on-golf-course-road-gurgaon
//
// Dwarka Expressway
// → /locations/properties-on-dwarka-expressway-gurgaon
//
// Gurgaon
// → /locations/properties-in-gurgaon
//
// Greater Kailash
// → /locations/properties-in-greater-kailash-delhi
//
// Farukhnagar
// → /locations/properties-in-farukhnagar-gurgaon
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
//
// parsvnath-developers
// → /developers/parsvnath-developers-projects
//
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

    // --------------------------------------------------------
    // Standard API response
    // --------------------------------------------------------

    if (Array.isArray(json?.data)) {
      return json.data;
    }

    // --------------------------------------------------------
    // Direct array
    // --------------------------------------------------------

    if (Array.isArray(json)) {
      return json;
    }

    // --------------------------------------------------------
    // Properties
    // --------------------------------------------------------

    if (Array.isArray(json?.properties)) {
      return json.properties;
    }

    // --------------------------------------------------------
    // Developers
    // --------------------------------------------------------

    if (Array.isArray(json?.developers)) {
      return json.developers;
    }

    // --------------------------------------------------------
    // Locations
    // --------------------------------------------------------

    if (Array.isArray(json?.locations)) {
      return json.locations;
    }

    // --------------------------------------------------------
    // Articles
    // --------------------------------------------------------

    if (Array.isArray(json?.articles)) {
      return json.articles;
    }

    // --------------------------------------------------------
    // News
    // --------------------------------------------------------

    if (Array.isArray(json?.news)) {
      return json.news;
    }

    // --------------------------------------------------------
    // Unexpected response
    // --------------------------------------------------------

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
// Guarantees sitemap URLs:
//
// - HTTPS
// - non-www
// - no query strings
// - no hash fragments
// - no unnecessary trailing slash
// - propertybouquet.com only
//
// ============================================================

function normalizeUrl(path) {
  if (!path) {
    return null;
  }

  let value = String(path).trim();

  if (!value) {
    return null;
  }

  // ==========================================================
  // ABSOLUTE URL
  // ==========================================================

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);

      // ------------------------------------------------------
      // Only allow our own domain
      // ------------------------------------------------------

      if (
        parsed.hostname !==
          "propertybouquet.com" &&
        parsed.hostname !==
          "www.propertybouquet.com"
      ) {
        return null;
      }

      // ------------------------------------------------------
      // Force HTTPS
      // ------------------------------------------------------

      parsed.protocol = "https:";

      // ------------------------------------------------------
      // Force non-www
      // ------------------------------------------------------

      parsed.hostname =
        "propertybouquet.com";

      // ------------------------------------------------------
      // Remove query parameters
      // ------------------------------------------------------

      parsed.search = "";

      // ------------------------------------------------------
      // Remove hash
      // ------------------------------------------------------

      parsed.hash = "";

      // ------------------------------------------------------
      // Normalize pathname
      // ------------------------------------------------------

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

  // ==========================================================
  // RELATIVE URL
  // ==========================================================

  if (!value.startsWith("/")) {
    value = `/${value}`;
  }

  // ----------------------------------------------------------
  // Remove query string
  // ----------------------------------------------------------

  value = value.split("?")[0];

  // ----------------------------------------------------------
  // Remove hash
  // ----------------------------------------------------------

  value = value.split("#")[0];

  // ----------------------------------------------------------
  // Remove trailing slash except homepage
  // ----------------------------------------------------------

  if (
    value !== "/" &&
    value.endsWith("/")
  ) {
    value =
      value.slice(0, -1);
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

  // ----------------------------------------------------------
  // Prevent duplicates
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
  // Valid last modified date
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
// SLUGIFY
// ============================================================

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ============================================================
// LOCATION PREPOSITION
// ============================================================
//
// Roads / expressways / highways / streets / avenues etc.
// use "on".
//
// Sectors / cities / localities etc.
// use "in".
//
// Examples:
//
// Golf Course Road
// → on
//
// Dwarka Expressway
// → on
//
// Sector 56
// → in
//
// Gurgaon
// → in
//
// ============================================================

function getLocationPreposition(location) {
  const name =
    String(location?.name || "")
      .trim()
      .toLowerCase();

  const slug =
    String(location?.slug || "")
      .trim()
      .toLowerCase();

  const value =
    `${name} ${slug}`;

  const onKeywords = [
    "expressway",
    "express way",
    "highway",
    "road",
    "street",
    "avenue",
    "boulevard",
    "drive",
    "marg",
  ];

  return onKeywords.some(
    (keyword) =>
      value.includes(keyword)
  )
    ? "on"
    : "in";
}

// ============================================================
// GET LOCATION ID
// ============================================================

function getLocationId(location) {
  if (!location) {
    return "";
  }

  return (
    location?._id?.toString?.() ||
    location?.id?.toString?.() ||
    location?.toString?.() ||
    ""
  );
}

// ============================================================
// GET PARENT ID
// ============================================================

function getParentId(location) {
  if (!location?.parent) {
    return "";
  }

  return (
    location.parent?._id?.toString?.() ||
    location.parent?.id?.toString?.() ||
    location.parent?.toString?.() ||
    ""
  );
}

// ============================================================
// FIND LOCATION BY ID
// ============================================================

function findLocationById(
  locations,
  id
) {
  if (!id) {
    return null;
  }

  const targetId =
    String(id);

  for (const location of locations) {
    if (!location) {
      continue;
    }

    const currentId =
      getLocationId(location);

    if (
      currentId &&
      currentId === targetId
    ) {
      return location;
    }
  }

  return null;
}

// ============================================================
// GET ROOT LOCATION
// ============================================================
//
// Example:
//
// Sector 56
// → Gurgaon
//
// Golf Course Road
// → Gurgaon
//
// Greater Kailash
// → Delhi
//
// ============================================================

function getRootLocation(
  location,
  locations
) {
  if (!location) {
    return null;
  }

  let root =
    location;

  const visited =
    new Set();

  while (root?.parent) {
    const parentId =
      getParentId(root);

    if (!parentId) {
      break;
    }

    // Prevent circular parent relationships
    if (
      visited.has(parentId)
    ) {
      break;
    }

    visited.add(parentId);

    const parent =
      findLocationById(
        locations,
        parentId
      );

    if (!parent) {
      break;
    }

    root =
      parent;
  }

  return root;
}

// ============================================================
// BUILD PUBLIC LOCATION SLUG
// ============================================================
//
// Current location + root location.
//
// Examples:
//
// Sector 56
// parent Gurgaon
//
// → properties-in-sector-56-gurgaon
//
// Golf Course Road
// parent Gurgaon
//
// → properties-on-golf-course-road-gurgaon
//
// Gurgaon
//
// → properties-in-gurgaon
//
// Greater Kailash
// parent Delhi
//
// → properties-in-greater-kailash-delhi
//
// ============================================================

function buildPublicLocationSlug(
  location,
  locations
) {
  if (!location) {
    return "";
  }

  const currentPart =
    slugify(
      location.slug ||
        location.name ||
        ""
    );

  if (!currentPart) {
    return "";
  }

  const root =
    getRootLocation(
      location,
      locations
    );

  const rootPart =
    slugify(
      root?.slug ||
        root?.name ||
        ""
    );

  const preposition =
    getLocationPreposition(
      location
    );

  if (
    rootPart &&
    rootPart !== currentPart
  ) {
    return `properties-${preposition}-${currentPart}-${rootPart}`;
  }

  return `properties-${preposition}-${currentPart}`;
}

// ============================================================
// PUBLIC DEVELOPER SLUG BUILDER
// ============================================================
//
// Correct architecture:
//
// m3m
// → m3m-developer-projects
//
// signature-global
// → signature-global-developer-projects
//
// spiti-developer
// → spiti-developer-projects
//
// spiti-developers
// → spiti-developers-projects
//
// spiti-developer-projects
// → unchanged
//
// spiti-developers-projects
// → unchanged
//
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
      .replace(
        /^\/+|\/+$/g,
        ""
      );

  if (!cleanSlug) {
    return "";
  }

  // ==========================================================
  // ALREADY CANONICAL
  // ==========================================================

  if (
    cleanSlug.endsWith(
      "-developer-projects"
    ) ||
    cleanSlug.endsWith(
      "-developers-projects"
    )
  ) {
    return cleanSlug;
  }

  // ==========================================================
  // BACKEND SLUG ENDS WITH "-developer"
  // ==========================================================

  if (
    cleanSlug.endsWith(
      "-developer"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // ==========================================================
  // BACKEND SLUG ENDS WITH "-developers"
  // ==========================================================

  if (
    cleanSlug.endsWith(
      "-developers"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // ==========================================================
  // NORMAL BACKEND SLUG
  // ==========================================================

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

  addUrl(
    sitemap,
    "/",
    {
      priority: 1.0,
      changeFrequency: "daily",
    }
  );

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
    "/locations",
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

  // ==========================================================
  // HUMAN-FACING SITEMAP
  // ==========================================================

  addUrl(
    sitemap,
    "/sitemap",
    {
      priority: 0.60,
      changeFrequency: "monthly",
    }
  );

  // ==========================================================
  // LEGAL PAGES
  // ==========================================================

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
    locations,
    knowledgeArticles,
    insights,
  ] = await Promise.all([
    // ========================================================
    // IMPORTANT SEO OPTIMIZATION
    // ========================================================
    //
    // DO NOT use:
    // /properties?all=true
    //
    // That endpoint returns the full property documents and
    // creates a very large Next.js data-cache payload.
    //
    // The dedicated SEO endpoint returns only the fields
    // required by the sitemap.
    //
    safeFetch(
      `${API}/properties/seo-list`
    ),

    safeFetch(
      `${API}/developers`
    ),

    safeFetch(
      `${API}/locations`
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

      // ------------------------------------------------------
      // Published only
      // ------------------------------------------------------

      if (
        property.status !==
        "published"
      ) {
        return;
      }

      // ------------------------------------------------------
      // Deleted excluded
      // ------------------------------------------------------

      if (
        property.isDeleted === true
      ) {
        return;
      }

      // ------------------------------------------------------
      // Inactive excluded
      // ------------------------------------------------------

      if (
        property.isActive === false
      ) {
        return;
      }

      // ------------------------------------------------------
      // Trash excluded
      // ------------------------------------------------------

      if (
        property.deletedFromStatus ===
        "trash"
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

          changeFrequency:
            "weekly",
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

      // ------------------------------------------------------
      // Extract backend developer slug
      // ------------------------------------------------------

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

      // ------------------------------------------------------
      // Deleted excluded
      // ------------------------------------------------------

      if (
        developer.isDeleted === true
      ) {
        return;
      }

      // ------------------------------------------------------
      // Inactive excluded
      // ------------------------------------------------------

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

          changeFrequency:
            "monthly",
        }
      );
    }
  );

  // ==========================================================
  // LOCATION PAGES
  // ==========================================================
  //
  // ONLY canonical public location URLs are added.
  //
  // Legacy URLs such as:
  //
  // /locations/sector-56
  // /locations/gurgaon
  // /locations/golf-course-road
  //
  // are intentionally NOT added.
  //
  // ==========================================================

  locations.forEach(
    (location) => {
      if (!location) {
        return;
      }

      // ------------------------------------------------------
      // Deleted excluded
      // ------------------------------------------------------

      if (
        location.isDeleted === true
      ) {
        return;
      }

      // ------------------------------------------------------
      // Inactive excluded
      // ------------------------------------------------------

      if (
        location.isActive === false
      ) {
        return;
      }

      const publicLocationSlug =
        buildPublicLocationSlug(
          location,
          locations
        );

      if (!publicLocationSlug) {
        return;
      }

      addUrl(
        sitemap,
        `/locations/${encodeURIComponent(
          publicLocationSlug
        )}`,
        {
          lastModified:
            getValidDate(
              location.updatedAt,
              location.createdAt
            ),

          priority: 0.88,

          changeFrequency:
            "weekly",
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

          changeFrequency:
            "weekly",
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
        // ----------------------------------------------------
        // Homepage first
        // ----------------------------------------------------

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

        // ----------------------------------------------------
        // Higher priority first
        // ----------------------------------------------------

        if (
          a.priority !==
          b.priority
        ) {
          return (
            b.priority -
            a.priority
          );
        }

        // ----------------------------------------------------
        // Alphabetical
        // ----------------------------------------------------

        return a.url.localeCompare(
          b.url
        );
      });

  // ==========================================================
  // DIAGNOSTICS
  // ==========================================================

  console.log(
    `✅ Property Bouquet sitemap generated successfully: ${sortedUrls.length} URLs`
``  );

  console.log(
    `📊 Sitemap breakdown → Properties: ${properties.length}, Developers: ${developers.length}, Locations: ${locations.length}, Knowledge: ${knowledgeArticles.length}, Insights: ${insights.length}`
  );

  // ==========================================================
  // RETURN
  // ==========================================================

  return sortedUrls;
}