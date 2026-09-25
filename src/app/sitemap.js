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

    // Standard API response:
    // { data: [] }

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

    // Locations

    if (Array.isArray(json?.locations)) {
      return json.locations;
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
// PUBLISHED PROPERTY CHECK
// ============================================================

function isPublishedProperty(property) {
  if (!property) {
    return false;
  }

  if (property.status !== "published") {
    return false;
  }

  if (property.isDeleted === true) {
    return false;
  }

  if (property.isActive === false) {
    return false;
  }

  if (
    property.deletedFromStatus === "trash"
  ) {
    return false;
  }

  if (
    property.deletedFromStatus === "inactive"
  ) {
    return false;
  }

  return true;
}

// ============================================================
// CANONICAL URL NORMALIZER
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
  // ABSOLUTE URL
  // ----------------------------------------------------------

  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);

      const hostname =
        parsed.hostname.toLowerCase();

      if (
        hostname !== "propertybouquet.com" &&
        hostname !== "www.propertybouquet.com"
      ) {
        return null;
      }

      parsed.protocol = "https:";
      parsed.hostname = "propertybouquet.com";

      parsed.search = "";
      parsed.hash = "";

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
  // RELATIVE URL
  // ----------------------------------------------------------

  if (!value.startsWith("/")) {
    value = `/${value}`;
  }

  value = value.split("?")[0];
  value = value.split("#")[0];

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

  return encodeURIComponent(value);
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
// LOCATION ID
// ============================================================

function getLocationId(location) {
  if (!location) {
    return "";
  }

  return (
    location?._id?.toString?.() ||
    location?.id?.toString?.() ||
    ""
  );
}

// ============================================================
// PARENT ID
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
// Sector 56
// → properties-in-sector-56-gurgaon
//
// Golf Course Road
// → properties-on-golf-course-road-gurgaon
//
// Dwarka Expressway
// → properties-on-dwarka-expressway-gurgaon
//
// Gurgaon
// → properties-in-gurgaon
//
// Greater Kailash
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
// m3m
// → m3m-developer-projects
//
// signature-global
// → signature-global-developer-projects
//
// spiti-developer
// → spiti-developer-projects
//
// parsvnath-developers
// → parsvnath-developers-projects
//
// Already canonical slugs remain unchanged.
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

  if (
    cleanSlug.endsWith(
      "-developer"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  if (
    cleanSlug.endsWith(
      "-developers"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  return `${cleanSlug}-developer-projects`;
}

// ============================================================
// ADD SITEMAP ENTRY
// ============================================================
//
// IMPORTANT:
//
// Next.js sitemap metadata expects an array of plain objects.
//
// We deliberately create a fresh object here with only:
//
// - url
// - lastModified
// - changeFrequency
// - priority
//
// No Map objects, Sets, nested custom objects, or invalid values
// are returned to Next.js.
// ============================================================

function addSitemapEntry(
  entries,
  seen,
  path,
  {
    lastModified,
    changeFrequency = "weekly",
    priority = 0.7,
  } = {}
) {
  const url =
    normalizeUrl(path);

  if (!url) {
    return;
  }

  if (seen.has(url)) {
    return;
  }

  seen.add(url);

  const entry = {
    url,
    changeFrequency,
    priority,
  };

  const validLastModified =
    getValidDate(
      lastModified
    );

  if (validLastModified) {
    entry.lastModified =
      validLastModified;
  }

  entries.push(entry);
}

// ============================================================
// MAIN SITEMAP
// ============================================================

export default async function sitemap() {
  // ==========================================================
  // FINAL SITEMAP ENTRIES
  // ==========================================================

  const entries = [];
  const seen = new Set();

  // ==========================================================
  // STATIC PUBLIC PAGES
  // ==========================================================

  addSitemapEntry(
    entries,
    seen,
    "/",
    {
      priority: 1.0,
      changeFrequency: "daily",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/properties",
    {
      priority: 0.95,
      changeFrequency: "daily",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/developers",
    {
      priority: 0.90,
      changeFrequency: "weekly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/locations",
    {
      priority: 0.90,
      changeFrequency: "weekly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/knowledge",
    {
      priority: 0.82,
      changeFrequency: "weekly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/insights",
    {
      priority: 0.82,
      changeFrequency: "weekly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/about",
    {
      priority: 0.70,
      changeFrequency: "monthly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/contact",
    {
      priority: 0.70,
      changeFrequency: "monthly",
    }
  );

  // ==========================================================
  // HUMAN-FACING SITEMAP
  // ==========================================================

  addSitemapEntry(
    entries,
    seen,
    "/sitemap",
    {
      priority: 0.60,
      changeFrequency: "monthly",
    }
  );

  // ==========================================================
  // LEGAL PAGES
  // ==========================================================

  addSitemapEntry(
    entries,
    seen,
    "/privacy-policy",
    {
      priority: 0.50,
      changeFrequency: "yearly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/disclaimer",
    {
      priority: 0.50,
      changeFrequency: "yearly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
    "/terms-of-use",
    {
      priority: 0.50,
      changeFrequency: "yearly",
    }
  );

  // ==========================================================
  // PUBLIC SEO TOOLS
  // ==========================================================

  addSitemapEntry(
    entries,
    seen,
    "/tools/roi-calculator",
    {
      priority: 0.85,
      changeFrequency: "monthly",
    }
  );

  addSitemapEntry(
    entries,
    seen,
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
  // IMPORTANT:
  //
  // Properties use the lightweight SEO endpoint.
  //
  // /api/properties/seo-list
  //
  // This replaces:
  //
  // /api/properties?all=true
  //
  // and prevents the large property response from entering
  // the Next.js data cache.
  //
  // ==========================================================

  const [
    properties,
    developers,
    locations,
    knowledgeArticles,
    insights,
  ] = await Promise.all([
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

  if (Array.isArray(properties)) {
    properties.forEach(
      (property) => {
        if (
          !isPublishedProperty(
            property
          )
        ) {
          return;
        }

        const slug =
          safeSlug(
            property?.slug
          );

        if (!slug) {
          return;
        }

        addSitemapEntry(
          entries,
          seen,
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
      }
    );
  }

  // ==========================================================
  // DEVELOPER PAGES
  // ==========================================================

  if (Array.isArray(developers)) {
    developers.forEach(
      (developer) => {
        if (!developer) {
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

        const backendDeveloperSlug =
          developer?.slug ||
          developer?.backendSlug ||
          developer?.developerSlug ||
          developer?.data?.slug ||
          developer?.data?.backendSlug ||
          developer?.data?.developerSlug ||
          developer?.developer?.slug ||
          "";

        const publicDeveloperSlug =
          buildPublicDeveloperSlug(
            backendDeveloperSlug
          );

        if (!publicDeveloperSlug) {
          return;
        }

        addSitemapEntry(
          entries,
          seen,
          `/developers/${encodeURIComponent(
            publicDeveloperSlug
          )}`,
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
  }

  // ==========================================================
  // LOCATION PAGES
  // ==========================================================
  //
  // ONLY canonical public location URLs are added.
  //
  // ==========================================================

  if (Array.isArray(locations)) {
    locations.forEach(
      (location) => {
        if (!location) {
          return;
        }

        if (
          location.isDeleted === true
        ) {
          return;
        }

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

        addSitemapEntry(
          entries,
          seen,
          `/locations/${encodeURIComponent(
            publicLocationSlug
          )}`,
          {
            lastModified:
              getValidDate(
                location?.updatedAt,
                location?.createdAt
              ),

            priority: 0.88,

            changeFrequency:
              "weekly",
          }
        );
      }
    );
  }

  // ==========================================================
  // KNOWLEDGE ARTICLES
  // ==========================================================

  if (
    Array.isArray(
      knowledgeArticles
    )
  ) {
    knowledgeArticles.forEach(
      (article) => {
        if (
          !isPublishedContent(
            article
          )
        ) {
          return;
        }

        const slug =
          safeSlug(
            article?.slug
          );

        if (!slug) {
          return;
        }

        addSitemapEntry(
          entries,
          seen,
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
  }

  // ==========================================================
  // PROPERTY INSIGHTS / NEWS
  // ==========================================================

  if (
    Array.isArray(insights)
  ) {
    insights.forEach(
      (article) => {
        if (
          !isPublishedContent(
            article
          )
        ) {
          return;
        }

        const slug =
          safeSlug(
            article?.slug
          );

        if (!slug) {
          return;
        }

        addSitemapEntry(
          entries,
          seen,
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
  }

  // ==========================================================
  // FINAL SORT
  // ==========================================================

  entries.sort(
    (a, b) => {
      // Homepage first

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

      // Higher priority first

      if (
        a.priority !==
        b.priority
      ) {
        return (
          b.priority -
          a.priority
        );
      }

      // Alphabetical

      return a.url.localeCompare(
        b.url
      );
    }
  );

  // ==========================================================
  // FINAL SAFETY CHECK
  // ==========================================================
  //
  // Make absolutely sure Next.js receives only valid sitemap
  // objects.
  //
  // ==========================================================

  const finalEntries =
    entries.filter(
      (entry) => {
        if (!entry) {
          return false;
        }

        if (
          typeof entry.url !==
          "string"
        ) {
          return false;
        }

        if (
          entry.lastModified !==
            undefined &&
          !(entry.lastModified instanceof Date)
        ) {
          return false;
        }

        if (
          entry.priority !==
            undefined &&
          typeof entry.priority !==
            "number"
        ) {
          return false;
        }

        if (
          entry.changeFrequency !==
            undefined &&
          typeof entry.changeFrequency !==
            "string"
        ) {
          return false;
        }

        return true;
      }
    );

  // ==========================================================
  // DIAGNOSTICS
  // ==========================================================

  console.log(
    `✅ Property Bouquet sitemap generated successfully: ${finalEntries.length} URLs`
  );

  console.log(
    `📊 Sitemap breakdown → Properties: ${
      Array.isArray(properties)
        ? properties.length
        : 0
    }, Developers: ${
      Array.isArray(developers)
        ? developers.length
        : 0
    }, Locations: ${
      Array.isArray(locations)
        ? locations.length
        : 0
    }, Knowledge: ${
      Array.isArray(
        knowledgeArticles
      )
        ? knowledgeArticles.length
        : 0
    }, Insights: ${
      Array.isArray(insights)
        ? insights.length
        : 0
    }`
  );

  // ==========================================================
  // RETURN
  // ==========================================================

  return finalEntries;
}