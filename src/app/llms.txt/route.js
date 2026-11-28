// ============================================================
// PROPERTY BOUQUET — DYNAMIC llms.txt ROUTE
// File: src/app/llms.txt/route.js
// Public URL: https://propertybouquet.com/llms.txt
// ============================================================

const BASE_URL = "https://propertybouquet.com";
const API_BASE_URL = `${BASE_URL}/api`;
const REVALIDATE_SECONDS = 3600;
const FETCH_TIMEOUT_MS = 12000;

// Keep the route and its source API responses refreshed hourly.
export const revalidate = 3600;
export const runtime = "nodejs";

const FETCH_OPTIONS = {
  headers: {
    Accept: "application/json",
  },
  next: {
    revalidate: REVALIDATE_SECONDS,
  },
};

const collator = new Intl.Collator("en-IN", {
  sensitivity: "base",
  numeric: true,
});

// ============================================================
// RESPONSE NORMALIZATION
// ============================================================

/**
 * Extract an array from the response shapes used by the website APIs.
 * Supports direct arrays, { data: [] }, named collections, and common
 * nested wrappers such as { data: { items: [] } }.
 */
function extractArray(payload, preferredKeys = []) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return null;

  const wrapperKeys = [
    ...preferredKeys,
    "data",
    "items",
    "results",
    "records",
    "list",
  ];

  for (const key of wrapperKeys) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
  }

  for (const key of wrapperKeys) {
    const value = payload[key];
    if (value && typeof value === "object") {
      const nested = extractArray(value, preferredKeys);
      if (nested) return nested;
    }
  }

  return null;
}

async function safeFetch(url, label, preferredKeys = []) {
  try {
    const response = await fetch(url, {
      ...FETCH_OPTIONS,
      // Create a fresh timeout signal for every request. A module-level
      // AbortSignal.timeout() would expire once and poison later requests.
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn(
        `[llms.txt] ${label} request failed with HTTP ${response.status}.`
      );
      return {
        items: [],
        ok: false,
        reason: `HTTP ${response.status}`,
      };
    }

    const payload = await response.json();
    const items = extractArray(payload, preferredKeys);

    if (!items) {
      console.warn(`[llms.txt] ${label} returned an unexpected response format.`);
      return {
        items: [],
        ok: false,
        reason: "Unexpected API response format",
      };
    }

    return { items, ok: true, reason: "" };
  } catch (error) {
    console.error(
      `[llms.txt] Could not fetch ${label}:`,
      error?.message || error
    );

    return {
      items: [],
      ok: false,
      reason: error?.name === "TimeoutError" ? "Request timed out" : "Request failed",
    };
  }
}

// ============================================================
// SAFE TEXT AND URL HELPERS
// ============================================================

/**
 * Converts API text into a single safe Markdown inline-text value.
 * Prevents newlines or Markdown link syntax in CMS text from breaking
 * the generated llms.txt structure.
 */
function markdownText(value, fallback = "", maxLength = 320) {
  const raw =
    typeof value === "string" || typeof value === "number"
      ? String(value)
      : "";

  const cleaned = raw
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .replace(/\\/g, "\\\\")
    .replace(/([\[\]()`*_<>])/g, "\\$1");

  return cleaned || fallback;
}

function safeSlug(value) {
  if (value === undefined || value === null) return null;

  const slug = String(value)
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!slug || slug === "." || slug === "..") return null;
  if (/^(https?:)?\/\//i.test(slug)) return null;

  return slug;
}

function pathSegment(value) {
  return encodeURIComponent(String(value));
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  const result = [];

  for (const item of items) {
    const key = getKey(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}

// ============================================================
// PUBLIC DEVELOPER SLUG BUILDER
// ============================================================

/**
 * Preserve the site's canonical developer URL convention:
 *   m3m                         -> m3m-developer-projects
 *   signature-global            -> signature-global-developer-projects
 *   spiti-developer             -> spiti-developer-projects
 *   parsvnath-developers        -> parsvnath-developers-projects
 *   parsvnath-developer-projects -> unchanged
 */
function buildPublicDeveloperSlug(value) {
  const slug = safeSlug(value)?.toLowerCase();
  if (!slug) return "";

  if (
    slug.endsWith("-developer-projects") ||
    slug.endsWith("-developers-projects")
  ) {
    return slug;
  }

  if (slug.endsWith("-developer") || slug.endsWith("-developers")) {
    return `${slug}-projects`;
  }

  return `${slug}-developer-projects`;
}

// ============================================================
// PUBLISHING AND ACTIVE-RECORD FILTERS
// ============================================================

const INACTIVE_STATES = new Set([
  "inactive",
  "deleted",
  "trash",
  "draft",
  "archived",
]);

function isActive(item) {
  if (!item || typeof item !== "object") return false;
  if (item.isDeleted === true || item.isActive === false) return false;

  const deletedFromStatus = String(item.deletedFromStatus || "").toLowerCase();
  if (INACTIVE_STATES.has(deletedFromStatus)) return false;

  const status = String(item.status || "").toLowerCase();
  if (INACTIVE_STATES.has(status)) return false;

  return true;
}

function isPublishedProperty(property) {
  if (!isActive(property)) return false;
  return String(property.status || "").toLowerCase() === "published";
}

function isPublishedContent(item) {
  if (!isActive(item)) return false;

  // Some content endpoints return only public records and omit `status`.
  // When a status is supplied, only explicitly published content is listed.
  if (item.status !== undefined && item.status !== null && item.status !== "") {
    return String(item.status).toLowerCase() === "published";
  }

  // Explicit publication flags, when present, must not indicate a draft.
  if (item.isPublished === false || item.published === false) return false;

  return true;
}

// ============================================================
// FIELD MAPPERS
// ============================================================

function getPropertyTitle(property) {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    property?.name ||
    "Property"
  );
}

function getPropertyLocation(property) {
  return (
    property?.locationData?.locationName ||
    property?.locationName ||
    property?.locationData?.customLocation ||
    ""
  );
}

function getPropertyDeveloper(property) {
  return (
    property?.coreDetails?.developerRef?.name ||
    property?.coreDetails?.developerName ||
    property?.developerName ||
    property?.developer?.name ||
    ""
  );
}

function getDeveloperSlug(developer) {
  return (
    developer?.slug ||
    developer?.backendSlug ||
    developer?.developerSlug ||
    developer?.data?.slug ||
    developer?.data?.backendSlug ||
    developer?.data?.developerSlug ||
    developer?.developer?.slug ||
    ""
  );
}

function getDeveloperName(developer) {
  return (
    developer?.name ||
    developer?.developerName ||
    developer?.title ||
    ""
  );
}

function getContentTitle(article, fallback) {
  return (
    article?.title ||
    article?.name ||
    article?.headline ||
    article?.seoEngine?.metaTitle ||
    fallback
  );
}

function getContentDescription(article, fallback) {
  return (
    article?.excerpt ||
    article?.summary ||
    article?.description ||
    article?.seoEngine?.metaDescription ||
    fallback
  );
}

function getContentSlug(article) {
  return safeSlug(article?.slug || article?.seoEngine?.slug);
}

// ============================================================
// LOCATION URL + HIERARCHY HELPERS
// Keep this logic aligned with the public-location URL builder
// used by the website sitemap and location navigation.
// ============================================================

function slugifyLocation(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getLocationId(location) {
  return String(location?._id || location?.id || "");
}

function getLocationParent(location, locationsById) {
  const parent = location?.parent;
  if (!parent) return null;
  if (typeof parent === "object") return parent;
  return locationsById.get(String(parent)) || null;
}

function getLocationChain(location, locationsById) {
  const chain = [];
  const visited = new Set();
  let current = location;

  while (current && typeof current === "object") {
    const id = getLocationId(current) || `${current.name || ""}:${current.slug || ""}`;
    if (visited.has(id)) break;
    visited.add(id);
    chain.push(current);
    current = getLocationParent(current, locationsById);
  }

  return chain; // Current location first, root last.
}

function getLocationPreposition(location) {
  const value = `${location?.name || ""} ${location?.slug || ""}`.toLowerCase();
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

  return onKeywords.some((keyword) => value.includes(keyword)) ? "on" : "in";
}

function buildPublicLocationSlug(location, locationsById) {
  if (!location) return "";

  const currentPart = slugifyLocation(location.slug || location.name);
  if (!currentPart) return "";

  const chain = getLocationChain(location, locationsById);
  const root = chain[chain.length - 1] || location;
  const rootPart = slugifyLocation(root.slug || root.name);
  const preposition = getLocationPreposition(location);

  if (rootPart && rootPart !== currentPart) {
    return `properties-${preposition}-${currentPart}-${rootPart}`;
  }

  return `properties-${preposition}-${currentPart}`;
}

function stripHtmlToText(value) {
  return String(value || "")
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<\/(p|div|section|article|li|h[1-6])>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function getLocationSummary(location) {
  const page = location?.pageContent || {};
  const candidates = [
    page.hero?.title,
    page.hero?.description,
    page.about?.content,
    page.about?.marketDescription,
    page.connectivity?.description,
    page.nearby?.description,
    page.realEstateTypes?.description,
    page.propertyPrices?.description,
    page.lifestyle?.description,
    page.whyBuy?.description,
  ];

  const summary = candidates
    .map(stripHtmlToText)
    .filter((value) => value.length > 35);

  const faqQuestions = Array.isArray(page.faq?.items)
    ? page.faq.items.map((item) => stripHtmlToText(item?.question)).filter(Boolean)
    : [];

  const propertyTypes = Array.isArray(page.realEstateTypes?.cards)
    ? page.realEstateTypes.cards.map((item) => stripHtmlToText(item?.title)).filter(Boolean)
    : [];

  return [...new Set([...summary, ...propertyTypes, ...faqQuestions])]
    .join(" ")
    .slice(0, 620);
}

function buildLocationEntries(locations) {
  const locationsById = new Map(
    locations
      .filter(Boolean)
      .map((location) => [getLocationId(location), location])
      .filter(([id]) => Boolean(id))
  );

  const uniqueLocations = new Map();

  for (const location of locations) {
    if (!location || !String(location.name || "").trim()) continue;
    if (location.isDeleted === true || location.isActive === false) continue;

    const status = String(location.status || "").toLowerCase();
    if (["inactive", "deleted", "trash", "draft", "archived"].includes(status)) continue;

    const publicSlug = buildPublicLocationSlug(location, locationsById);
    if (!publicSlug) continue;

    // The canonical public URL is the deduplication key.
    if (!uniqueLocations.has(publicSlug)) {
      const chain = getLocationChain(location, locationsById);
      const hierarchy = chain
        .slice()
        .reverse()
        .map((item) => String(item?.name || "").trim())
        .filter(Boolean)
        .join(" > ");

      uniqueLocations.set(publicSlug, {
        location,
        publicSlug,
        hierarchy,
      });
    }
  }

  return [...uniqueLocations.values()]
    .sort((a, b) => collator.compare(a.hierarchy, b.hierarchy))
    .map(({ location, publicSlug, hierarchy }) => {
      const name = markdownText(location.name, "Location", 160);
      const hierarchyText = markdownText(hierarchy, name, 200);
      const summary = markdownText(getLocationSummary(location), "", 620);
      const description = [
        `Location hierarchy: ${hierarchyText}`,
        summary,
      ].filter(Boolean).join(" | ");

      return `- [${name}](${BASE_URL}/locations/${pathSegment(publicSlug)}): ${description || "Public location guide with local property information and published projects."}`;
    });
}

function sortByTitle(items, getTitle) {
  return [...items].sort((a, b) =>
    collator.compare(String(getTitle(a) || ""), String(getTitle(b) || ""))
  );
}

// ============================================================
// MARKDOWN BUILDERS
// ============================================================

function addSection(lines, heading, entries, unavailableMessage) {
  lines.push(`## ${heading}`, "");

  if (entries.length) {
    lines.push(...entries, "");
    return;
  }

  if (unavailableMessage) {
    lines.push(unavailableMessage, "");
  } else {
    lines.push("No currently published entries are listed in this section.", "");
  }
}

function buildPropertyEntries(properties) {
  return properties.map((property) => {
    const slug = safeSlug(property?.slug);
    const title = markdownText(getPropertyTitle(property), "Property", 180);
    const location = markdownText(getPropertyLocation(property), "", 120);
    const developer = markdownText(getPropertyDeveloper(property), "", 120);

    const details = [
      location ? `Location: ${location}` : "",
      developer ? `Developer: ${developer}` : "",
    ].filter(Boolean);

    const description = details.length
      ? details.join(" | ")
      : "Published property page on Property Bouquet.";

    return `- [${title}](${BASE_URL}/${pathSegment(slug)}): ${description}`;
  });
}

function buildDeveloperEntries(developers) {
  return developers
    .map((developer) => {
      const backendSlug = safeSlug(getDeveloperSlug(developer));
      const publicSlug = buildPublicDeveloperSlug(backendSlug);
      const name = markdownText(getDeveloperName(developer), "", 180);

      if (!publicSlug || !name) return null;

      return `- [${name}](${BASE_URL}/developers/${pathSegment(publicSlug)}): Developer profile and published projects.`;
    })
    .filter(Boolean);
}

function buildContentEntries(articles, fallbackTitle, fallbackDescription, basePath) {
  return articles.map((article) => {
    const slug = getContentSlug(article);
    const title = markdownText(getContentTitle(article, fallbackTitle), fallbackTitle, 180);
    const description = markdownText(
      getContentDescription(article, fallbackDescription),
      fallbackDescription,
      360
    );

    return `- [${title}](${BASE_URL}/${basePath}/${pathSegment(slug)}): ${description}`;
  });
}

// ============================================================
// MAIN ROUTE
// ============================================================

export async function GET() {
  const [propertyResult, developerResult, locationResult, knowledgeResult, insightResult] =
    await Promise.all([
      safeFetch(`${API_BASE_URL}/properties/seo-list`, "properties", ["properties"]),
      safeFetch(`${API_BASE_URL}/developers`, "developers", ["developers"]),
      safeFetch(`${API_BASE_URL}/locations`, "locations", ["locations"]),
      safeFetch(`${API_BASE_URL}/knowledge`, "Knowledge Centre", ["articles", "knowledge"]),
      safeFetch(`${API_BASE_URL}/news`, "Property Insights", ["news", "articles", "insights"]),
    ]);

  const properties = uniqueBy(
    propertyResult.items.filter(
      (property) => isPublishedProperty(property) && safeSlug(property?.slug)
    ),
    (property) => safeSlug(property?.slug)
  );

  const developers = uniqueBy(
    developerResult.items.filter(
      (developer) => isActive(developer) && safeSlug(getDeveloperSlug(developer))
    ),
    (developer) => buildPublicDeveloperSlug(getDeveloperSlug(developer))
  );

  const locations = locationResult.items.filter(
    (location) => location && String(location.name || "").trim() && safeSlug(location.slug || location.name)
  );

  const knowledgeArticles = uniqueBy(
    knowledgeResult.items.filter(
      (article) => isPublishedContent(article) && getContentSlug(article)
    ),
    getContentSlug
  );

  const insights = uniqueBy(
    insightResult.items.filter(
      (article) => isPublishedContent(article) && getContentSlug(article)
    ),
    getContentSlug
  );

  const sortedProperties = sortByTitle(properties, getPropertyTitle);
  const sortedDevelopers = sortByTitle(developers, getDeveloperName);
  const locationEntries = buildLocationEntries(locations);
  const sortedKnowledge = sortByTitle(knowledgeArticles, (item) =>
    getContentTitle(item, "Knowledge Article")
  );
  const sortedInsights = sortByTitle(insights, (item) =>
    getContentTitle(item, "Property Insight")
  );

  const lines = [
    "# Property Bouquet",
    "",
    "> Property Bouquet is a luxury real-estate platform featuring curated residential and premium property opportunities, developer information, location resources, real-estate education, and market insights, with a strong focus on Gurgaon and the National Capital Region (NCR).",
    "",
    "## About",
    "",
    "Property Bouquet helps visitors explore premium property opportunities, compare published property information, discover developers, understand real-estate topics, and access property-related tools and enquiry resources.",
    "",
    "Use the public pages listed below as the primary sources for Property Bouquet information. Only content identified as published and active is included in the dynamic catalogues.",
    "",
    "## Main Website",
    "",
    `- [Property Bouquet Homepage](${BASE_URL}/): Main website and overview of Property Bouquet.`,
    `- [Properties](${BASE_URL}/properties): Browse published property projects and premium real-estate opportunities.`,
    `- [Developers](${BASE_URL}/developers): Explore developer profiles and their published projects.`,
    `- [Locations](${BASE_URL}/locations): Explore location guides, sectors, roads, and local property markets.`,
    `- [Knowledge Centre](${BASE_URL}/knowledge): Guides and educational resources about property and real estate.`,
    `- [Property Insights](${BASE_URL}/insights): Real-estate market updates, investment trends, infrastructure developments, and property analysis.`,
    `- [About Property Bouquet](${BASE_URL}/about): Information about Property Bouquet and its platform.`,
    `- [Contact Property Bouquet](${BASE_URL}/contact): Contact details and property enquiry options.`,
    "",
    "## Catalogue Snapshot",
    "",
    `- Published property pages: ${sortedProperties.length}`,
    `- Active developer profiles: ${sortedDevelopers.length}`,
    `- Public location guides: ${locationEntries.length}`,
    `- Knowledge Centre articles: ${sortedKnowledge.length}`,
    `- Property Insights articles: ${sortedInsights.length}`,
    "",
  ];

  addSection(
    lines,
    "Published Properties",
    buildPropertyEntries(sortedProperties),
    propertyResult.ok
      ? "No currently published properties are listed. Browse the Properties directory for the latest catalogue."
      : "The property catalogue could not be refreshed when this file was generated. Use the Properties directory for the current catalogue."
  );

  addSection(
    lines,
    "Developers",
    buildDeveloperEntries(sortedDevelopers),
    developerResult.ok
      ? "No active public developer profiles are currently listed. Browse the Developers directory."
      : "The developer catalogue could not be refreshed when this file was generated. Use the Developers directory for current profiles."
  );

  addSection(
    lines,
    "Locations",
    locationEntries,
    locationResult.ok
      ? "No public location pages are currently listed. Browse the Locations directory."
      : "The location catalogue could not be refreshed when this file was generated. Use the Locations directory for current location guides."
  );

  addSection(
    lines,
    "Knowledge Centre",
    buildContentEntries(
      sortedKnowledge,
      "Knowledge Article",
      "Property Bouquet real-estate knowledge resource.",
      "knowledge"
    ),
    knowledgeResult.ok
      ? "No currently published Knowledge Centre articles are listed. Browse the Knowledge Centre."
      : "The Knowledge Centre catalogue could not be refreshed when this file was generated. Use the Knowledge Centre for current articles."
  );

  addSection(
    lines,
    "Property Insights",
    buildContentEntries(
      sortedInsights,
      "Property Insight",
      "Property Bouquet real-estate market insight.",
      "insights"
    ),
    insightResult.ok
      ? "No currently published Property Insights are listed. Browse Property Insights."
      : "The Property Insights catalogue could not be refreshed when this file was generated. Use the Property Insights section for current articles."
  );

  lines.push(
    "## Tools",
    "",
    `- [ROI Calculator](${BASE_URL}/tools/roi-calculator): Estimate property investment returns using the available calculator inputs.`,
    `- [Area Converter](${BASE_URL}/tools/area-converter): Convert common property area measurements and units.`,
    "",
    "## Source and Content Guidance",
    "",
    "- Use the individual published property page as the source for that property's specifications, amenities, pricing, unit configurations, possession, RERA information, and published availability.",
    "- Use individual location pages as the primary source for sector, locality, corridor, connectivity, lifestyle, and area-guide information.",
    "- A property may appear within a location hierarchy; do not assume that two similarly named sectors or localities belong to the same city or parent region.",
    "- Pricing, inventory, possession details, specifications, and availability may change. Confirm time-sensitive details with Property Bouquet before relying on them.",
    "- Knowledge Centre pages are educational resources. Property Insights pages provide editorial coverage and market commentary.",
    "- Do not interpret the absence of a property or article from this index as proof that it does not exist; this file lists records returned by the public catalogue APIs at generation time.",
    "- Administrative pages, authentication pages, private dashboards, and API endpoints are not public informational sources.",
    "- Do not infer unpublished prices, returns, availability, developer relationships, or project specifications when those details are not stated on the relevant public page.",
    ""
  );

  const body = `${lines.join("\n").trim()}\n`;

  const fetchFailures = [
    !propertyResult.ok && "properties",
    !developerResult.ok && "developers",
    !locationResult.ok && "locations",
    !knowledgeResult.ok && "knowledge",
    !insightResult.ok && "insights",
  ].filter(Boolean);

  console.info(
    `[llms.txt] Generated: ${properties.length} unique published property URLs, ${developers.length} developers, ${locationEntries.length} location pages, ${knowledgeArticles.length} knowledge articles, ${insights.length} insights.`
  );

  if (fetchFailures.length) {
    console.warn(`[llms.txt] Partial catalogue data: ${fetchFailures.join(", ")}.`);
  }

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
