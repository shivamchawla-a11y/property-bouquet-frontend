// ============================================================
// PROPERTY BOUQUET — PRODUCTION LLMs.TXT
// ============================================================
//
// File:
// src/app/llms.txt/route.js
//
// Public URL:
// https://propertybouquet.com/llms.txt
//
// Canonical domain:
// https://propertybouquet.com
//
// INCLUDED:
// - Main website
// - Properties directory
// - Developers directory
// - Knowledge Centre
// - Property Insights
// - About
// - Contact
// - Published property pages
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
//
// IMPORTANT:
// - Uses the SAME API architecture as sitemap.js.
// - Insights are fetched from /api/news.
// - /api/news results are exposed as the "insights" array.
// - Insight URLs use /insights/{slug}.
// - Developer URLs follow the canonical public developer
//   slug architecture.
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
//
// This follows the same response handling used by the
// production sitemap.
//
// Supported API response formats:
//
// {
//   data: []
// }
//
// OR:
//
// []
//
// OR:
//
// {
//   properties: []
// }
//
// OR:
//
// {
//   developers: []
// }
//
// OR:
//
// {
//   articles: []
// }
//
// OR:
//
// {
//   news: []
// }
// ============================================================

async function safeFetch(url) {
  try {
    const response = await fetch(
      url,
      FETCH_OPTIONS
    );

    if (!response.ok) {
      console.warn(
        `⚠️ LLMS.TXT API request failed: ${url} → ${response.status}`
      );

      return [];
    }

    const json = await response.json();

    // ----------------------------------------------------------
    // Standard API response
    // ----------------------------------------------------------

    if (Array.isArray(json?.data)) {
      return json.data;
    }

    // ----------------------------------------------------------
    // Direct array
    // ----------------------------------------------------------

    if (Array.isArray(json)) {
      return json;
    }

    // ----------------------------------------------------------
    // Properties
    // ----------------------------------------------------------

    if (Array.isArray(json?.properties)) {
      return json.properties;
    }

    // ----------------------------------------------------------
    // Developers
    // ----------------------------------------------------------

    if (Array.isArray(json?.developers)) {
      return json.developers;
    }

    // ----------------------------------------------------------
    // Articles
    // ----------------------------------------------------------

    if (Array.isArray(json?.articles)) {
      return json.articles;
    }

    // ----------------------------------------------------------
    // News
    // ----------------------------------------------------------

    if (Array.isArray(json?.news)) {
      return json.news;
    }

    console.warn(
      `⚠️ LLMS.TXT API returned an unexpected data format: ${url}`
    );

    return [];
  } catch (error) {
    console.error(
      `❌ LLMS.TXT fetch failed: ${url}`,
      error
    );

    return [];
  }
}

// ============================================================
// SAFE SLUG
// ============================================================

function safeSlug(slug) {
  if (!slug) {
    return null;
  }

  const value = String(slug).trim();

  if (!value) {
    return null;
  }

  return value;
}

// ============================================================
// PUBLIC DEVELOPER SLUG BUILDER
// ============================================================
//
// This MUST stay synchronized with the public developer
// page architecture.
//
// Backend slug:
// m3m
//
// Public slug:
// m3m-developer-projects
//
// Backend slug:
// signature-global
//
// Public slug:
// signature-global-developer-projects
//
// Backend slug:
// spiti-developer
//
// Public slug:
// spiti-developer-projects
//
// Backend slug:
// ats-infrastructure-ltd
//
// Public slug:
// ats-infrastructure-ltd-developer-projects
// ============================================================
// ============================================================
// PUBLIC DEVELOPER SLUG BUILDER
// ============================================================
//
// Canonical public developer URL architecture:
//
// Backend slug:
// m3m
// → /developers/m3m-developer-projects
//
// Backend slug:
// signature-global
// → /developers/signature-global-developer-projects
//
// Backend slug:
// spiti-developer
// → /developers/spiti-developer-projects
//
// Backend slug:
// parsvnath-developers
// → /developers/parsvnath-developers-projects
//
// Backend slug:
// parsvnath-developer-projects
// → unchanged
//
// Backend slug:
// parsvnath-developers-projects
// → unchanged
// ============================================================

function buildPublicDeveloperSlug(
  developerSlug
) {
  if (!developerSlug) {
    return "";
  }

  const cleanSlug = String(developerSlug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "";
  }

  // ----------------------------------------------------------
  // Already canonical:
  // example-developer-projects
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // Backend slug already ends with:
  // example-developer
  // ----------------------------------------------------------
  if (
    cleanSlug.endsWith(
      "-developer"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // ----------------------------------------------------------
  // Backend slug already ends with:
  // example-developers
  // ----------------------------------------------------------
  if (
    cleanSlug.endsWith(
      "-developers"
    )
  ) {
    return `${cleanSlug}-projects`;
  }

  // ----------------------------------------------------------
  // Normal backend slug:
  // example
  // ----------------------------------------------------------
  return `${cleanSlug}-developer-projects`;
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
    property.deletedFromStatus ===
    "trash"
  ) {
    return false;
  }

  if (
    property.deletedFromStatus ===
    "inactive"
  ) {
    return false;
  }

  return true;
}

// ============================================================
// PUBLISHED CONTENT CHECK
// ============================================================
//
// Same basic publishing logic as sitemap.js.
//
// Used for:
// - Knowledge
// - Insights / News
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
// PROPERTY TITLE
// ============================================================

function getPropertyTitle(property) {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    property?.name ||
    "Property"
  );
}

// ============================================================
// PROPERTY LOCATION
// ============================================================

function getPropertyLocation(property) {
  return (
    property?.locationData
      ?.locationName ||
    property?.locationName ||
    property?.locationData
      ?.customLocation ||
    "Gurgaon"
  );
}

// ============================================================
// PROPERTY DEVELOPER
// ============================================================

function getPropertyDeveloper(property) {
  return (
    property?.coreDetails
      ?.developerRef?.name ||
    property?.coreDetails
      ?.developerName ||
    property?.developerName ||
    property?.developer?.name ||
    ""
  );
}

// ============================================================
// DEVELOPER NAME
// ============================================================

function getDeveloperName(developer) {
  return (
    developer?.name ||
    developer?.developerName ||
    developer?.title ||
    ""
  );
}

// ============================================================
// CONTENT TITLE
// ============================================================
//
// Insights/news articles may expose their title through
// different fields depending on the CMS response.
//
// We check the most likely fields without changing the
// underlying article URL.
// ============================================================

function getContentTitle(
  article,
  fallback
) {
  return (
    article?.title ||
    article?.name ||
    article?.headline ||
    article?.seoEngine
      ?.metaTitle ||
    fallback
  );
}

// ============================================================
// CONTENT DESCRIPTION
// ============================================================

function getContentDescription(
  article,
  fallback
) {
  return (
    article?.excerpt ||
    article?.summary ||
    article?.description ||
    article?.seoEngine
      ?.metaDescription ||
    fallback
  );
}

// ============================================================
// CONTENT SLUG
// ============================================================

function getContentSlug(article) {
  return safeSlug(
    article?.slug ||
      article?.seoEngine?.slug
  );
}

// ============================================================
// MAIN LLMs.TXT ROUTE
// ============================================================

export async function GET() {
  // ==========================================================
  // FETCH DYNAMIC CONTENT
  // ==========================================================
  //
  // IMPORTANT:
  //
  // Insights are fetched from /api/news.
  //
  // This exactly matches your production sitemap.js:
  //
  // safeFetch(`${API}/news`)
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
    // KNOWLEDGE
    // --------------------------------------------------------

    safeFetch(
      `${API}/knowledge`
    ),

    // --------------------------------------------------------
    // INSIGHTS / NEWS
    // --------------------------------------------------------
    //
    // THIS IS THE IMPORTANT FIX.
    //
    // Your sitemap uses /api/news.
    // Therefore llms.txt uses /api/news too.
    //
    // --------------------------------------------------------

    safeFetch(
      `${API}/news`
    ),
  ]);

  // ==========================================================
  // PUBLISHED PROPERTIES
  // ==========================================================

  const publishedProperties =
    Array.isArray(properties)
      ? properties
          .filter(
            (property) =>
              isPublishedProperty(
                property
              ) &&
              safeSlug(
                property?.slug
              )
          )
          .sort((a, b) => {
            const titleA =
              getPropertyTitle(
                a
              ).toLowerCase();

            const titleB =
              getPropertyTitle(
                b
              ).toLowerCase();

            return titleA.localeCompare(
              titleB
            );
          })
      : [];

  // ==========================================================
  // ACTIVE DEVELOPERS
  // ==========================================================

  const activeDevelopers =
    Array.isArray(developers)
      ? developers
          .filter(
            (developer) =>
              isActive(
                developer
              ) &&
              safeSlug(
                developer?.slug ||
                  developer?.backendSlug ||
                  developer
                    ?.developerSlug
              )
          )
          .sort((a, b) => {
            const nameA =
              getDeveloperName(
                a
              ).toLowerCase();

            const nameB =
              getDeveloperName(
                b
              ).toLowerCase();

            return nameA.localeCompare(
              nameB
            );
          })
      : [];

  // ==========================================================
  // PUBLISHED KNOWLEDGE
  // ==========================================================

  const publishedKnowledge =
    Array.isArray(
      knowledgeArticles
    )
      ? knowledgeArticles
          .filter(
            (article) =>
              getContentSlug(
                article
              ) &&
              isPublishedContent(
                article
              )
          )
          .sort((a, b) => {
            const titleA =
              getContentTitle(
                a,
                "Knowledge Article"
              ).toLowerCase();

            const titleB =
              getContentTitle(
                b,
                "Knowledge Article"
              ).toLowerCase();

            return titleA.localeCompare(
              titleB
            );
          })
      : [];

  // ==========================================================
  // PUBLISHED INSIGHTS / NEWS
  // ==========================================================
  //
  // THIS NOW USES THE EXACT SAME DATA SOURCE AS sitemap.js.
  //
  // /api/news
  //      ↓
  // insights[]
  //      ↓
  // article.slug
  //      ↓
  // /insights/{slug}
  //
  // ==========================================================

  const publishedInsights =
    Array.isArray(insights)
      ? insights
          .filter(
            (article) =>
              getContentSlug(
                article
              ) &&
              isPublishedContent(
                article
              )
          )
          .sort((a, b) => {
            const titleA =
              getContentTitle(
                a,
                "Property Insight"
              ).toLowerCase();

            const titleB =
              getContentTitle(
                b,
                "Property Insight"
              ).toLowerCase();

            return titleA.localeCompare(
              titleB
            );
          })
      : [];

  // ==========================================================
  // BUILD MARKDOWN
  // ==========================================================

  const lines = [];

  // ==========================================================
  // H1
  // ==========================================================

  lines.push(
    "# Property Bouquet"
  );

  lines.push("");

  // ==========================================================
  // SHORT SUMMARY
  // ==========================================================

  lines.push(
    "> Property Bouquet is a luxury real estate platform focused on curated residential and premium property opportunities across India, with a strong focus on Gurgaon and the National Capital Region."
  );

  lines.push("");

  // ==========================================================
  // GENERAL DESCRIPTION
  // ==========================================================

  lines.push(
    "Property Bouquet helps users discover premium residential properties, trusted developers, projects, locations, real-estate knowledge, market insights, and property-related tools."
  );

  lines.push("");

  lines.push(
    "Use the published public pages linked below as primary Property Bouquet sources. Do not treat administrative pages, authentication pages, API endpoints, draft properties, deleted properties, trash properties, or inactive properties as public content."
  );

  lines.push("");

  // ==========================================================
  // MAIN WEBSITE
  // ==========================================================

  lines.push(
    "## Main Website"
  );

  lines.push("");

  lines.push(
    `- [Property Bouquet Homepage](${BASE_URL}/): Main website and overview of Property Bouquet.`
  );

  lines.push(
    `- [Properties](${BASE_URL}/properties): Browse published property projects and premium real-estate opportunities.`
  );

  lines.push(
    `- [Developers](${BASE_URL}/developers): Browse property developers and their published projects.`
  );

  lines.push(
    `- [Knowledge Centre](${BASE_URL}/knowledge): Property and real-estate knowledge resources.`
  );

  lines.push(
    `- [Property Insights](${BASE_URL}/insights): Luxury real-estate market updates, investment trends, market intelligence, infrastructure developments, expert insights, and property analysis.`
  );

  lines.push(
    `- [About Property Bouquet](${BASE_URL}/about): Information about Property Bouquet and its platform.`
  );

  lines.push(
    `- [Contact Property Bouquet](${BASE_URL}/contact): Contact and property enquiry information.`
  );

  lines.push("");

  // ==========================================================
  // PUBLISHED PROPERTIES
  // ==========================================================

  if (
    publishedProperties.length >
    0
  ) {
    lines.push(
      "## Published Properties"
    );

    lines.push("");

    for (
      const property of publishedProperties
    ) {
      const propertySlug =
        safeSlug(
          property?.slug
        );

      if (!propertySlug) {
        continue;
      }

      const title =
        getPropertyTitle(
          property
        );

      const location =
        getPropertyLocation(
          property
        );

      const developer =
        getPropertyDeveloper(
          property
        );

      const details = [
        location
          ? `Location: ${location}`
          : "",

        developer
          ? `Developer: ${developer}`
          : "",
      ]
        .filter(Boolean)
        .join(" | ");

      lines.push(
        `- [${title}](${BASE_URL}/${encodeURIComponent(
          propertySlug
        )}): ${
          details ||
          "Published property project on Property Bouquet."
        }`
      );
    }

    lines.push("");
  }

  // ==========================================================
  // DEVELOPERS
  // ==========================================================

  if (
    activeDevelopers.length >
    0
  ) {
    lines.push(
      "## Developers"
    );

    lines.push("");

    for (
      const developer of activeDevelopers
    ) {
      const backendDeveloperSlug =
        safeSlug(
          developer?.slug ||
            developer?.backendSlug ||
            developer?.developerSlug ||
            developer?.data?.slug ||
            developer?.data
              ?.backendSlug ||
            developer?.data
              ?.developerSlug ||
            developer?.developer
              ?.slug
        );

      if (!backendDeveloperSlug) {
        continue;
      }

      const publicDeveloperSlug =
        buildPublicDeveloperSlug(
          backendDeveloperSlug
        );

      if (!publicDeveloperSlug) {
        continue;
      }

      const developerName =
        getDeveloperName(
          developer
        );

      if (!developerName) {
        continue;
      }

      lines.push(
        `- [${developerName}](${BASE_URL}/developers/${encodeURIComponent(
          publicDeveloperSlug
        )}): Developer profile and published projects.`
      );
    }

    lines.push("");
  }

  // ==========================================================
  // KNOWLEDGE
  // ==========================================================

  if (
    publishedKnowledge.length >
    0
  ) {
    lines.push(
      "## Knowledge"
    );

    lines.push("");

    for (
      const article of publishedKnowledge
    ) {
      const slug =
        getContentSlug(
          article
        );

      if (!slug) {
        continue;
      }

      const title =
        getContentTitle(
          article,
          "Knowledge Article"
        );

      const description =
        getContentDescription(
          article,
          "Property Bouquet knowledge resource."
        );

      lines.push(
        `- [${title}](${BASE_URL}/knowledge/${encodeURIComponent(
          slug
        )}): ${description}`
      );
    }

    lines.push("");
  }

  // ==========================================================
  // PROPERTY INSIGHTS
  // ==========================================================
  //
  // These are individual articles such as:
  //
  // /insights/why-investing-in-luxury-real-estate-in-gurgaon-is-the-smartest-decision-in-2026
  //
  // They are sourced from:
  //
  // /api/news
  //
  // exactly like sitemap.js.
  // ==========================================================

  if (
    publishedInsights.length >
    0
  ) {
    lines.push(
      "## Property Insights"
    );

    lines.push("");

    for (
      const article of publishedInsights
    ) {
      const slug =
        getContentSlug(
          article
        );

      if (!slug) {
        continue;
      }

      const title =
        getContentTitle(
          article,
          "Property Insight"
        );

      const description =
        getContentDescription(
          article,
          "Property Bouquet luxury real-estate insight."
        );

      lines.push(
        `- [${title}](${BASE_URL}/insights/${encodeURIComponent(
          slug
        )}): ${description}`
      );
    }

    lines.push("");
  }

  // ==========================================================
  // TOOLS
  // ==========================================================

  lines.push(
    "## Tools"
  );

  lines.push("");

  lines.push(
    `- [ROI Calculator](${BASE_URL}/tools/roi-calculator): Real-estate investment return calculation tool.`
  );

  lines.push(
    `- [Area Converter](${BASE_URL}/tools/area-converter): Property area and unit conversion tool.`
  );

  lines.push("");

  // ==========================================================
  // IMPORTANT INFORMATION
  // ==========================================================

  lines.push(
    "## Important Information"
  );

  lines.push("");

  lines.push(
    "- Prefer published Property Bouquet pages over unpublished, draft, deleted, trash, or inactive content."
  );

  lines.push(
    "- Property information such as pricing, availability, specifications, amenities, and inventory can change over time."
  );

  lines.push(
    "- Property Insights and Knowledge content represent Property Bouquet's published editorial and informational resources."
  );

  lines.push(
    "- For current property availability, pricing, specifications, or inventory, refer to the relevant published property page and contact Property Bouquet."
  );

  lines.push(
    "- Administrative URLs, authentication URLs, and API endpoints are not public informational sources."
  );

  lines.push("");

  // ==========================================================
  // FINAL MARKDOWN
  // ==========================================================

  const body =
    lines.join("\n");

  // ==========================================================
  // DIAGNOSTICS
  // ==========================================================

  console.log(
    `✅ Property Bouquet llms.txt generated successfully: ${publishedProperties.length} properties, ${activeDevelopers.length} developers, ${publishedKnowledge.length} knowledge articles, ${publishedInsights.length} insights`
  );

  // ==========================================================
  // RESPONSE
  // ==========================================================

  return new Response(
    body,
    {
      status: 200,

      headers: {
        "Content-Type":
          "text/plain; charset=utf-8",

        "Cache-Control":
          "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}