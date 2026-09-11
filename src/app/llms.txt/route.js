// ============================================================
// PROPERTY BOUQUET — LLMs.TXT
// ============================================================
// Public URL:
// https://propertybouquet.com/llms.txt
//
// Purpose:
// Provide AI agents / LLMs with a concise, curated overview
// of Property Bouquet and its important public content.
//
// This file intentionally excludes:
// - Admin pages
// - Authentication pages
// - API endpoints
// - Draft properties
// - Deleted properties
// - Trash properties
// - Inactive properties
// - Individual Insights articles
// ============================================================

const API = "https://propertybouquet.com/api";
const BASE_URL = "https://propertybouquet.com";

// Regenerate approximately once per hour.
export const revalidate = 3600;

// ============================================================
// SAFE API FETCH
// ============================================================

async function safeFetch(url) {
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(
        `LLMS.TXT API request failed: ${response.status} ${url}`
      );

      return null;
    }

    const json = await response.json();

    // Direct array
    if (Array.isArray(json)) {
      return json;
    }

    // Common API response formats
    if (Array.isArray(json?.data)) {
      return json.data;
    }

    if (Array.isArray(json?.properties)) {
      return json.properties;
    }

    if (Array.isArray(json?.developers)) {
      return json.developers;
    }

    if (Array.isArray(json?.articles)) {
      return json.articles;
    }

    if (Array.isArray(json?.knowledge)) {
      return json.knowledge;
    }

    return [];
  } catch (error) {
    console.error(
      `LLMS.TXT fetch error for ${url}:`,
      error
    );

    return null;
  }
}

// ============================================================
// CLEAN SLUG
// ============================================================

function cleanSlug(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

// ============================================================
// PUBLIC DEVELOPER SLUG
// ============================================================
// IMPORTANT:
//
// Backend slug:
// m3m
//
// Public URL:
// /developers/m3m-developer-projects
//
// Backend slug:
// signature-global
//
// Public URL:
// /developers/signature-global-developer-projects
//
// Backend slug:
// spiti-developer
//
// Public URL:
// /developers/spiti-developer-projects
//
// Backend slug:
// ats-infrastructure-ltd
//
// Public URL:
// /developers/ats-infrastructure-ltd-developer-projects
// ============================================================

function buildPublicDeveloperSlug(developerSlug) {
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

  // Already in final public format
  if (cleanSlug.endsWith("-developer-projects")) {
    return cleanSlug;
  }

  // Example:
  // spiti-developer
  // ->
  // spiti-developer-projects
  if (cleanSlug.endsWith("-developer")) {
    return `${cleanSlug}-projects`;
  }

  // Example:
  // m3m
  // ->
  // m3m-developer-projects
  return `${cleanSlug}-developer-projects`;
}

// ============================================================
// PUBLISHED PROPERTY CHECK
// ============================================================

function isPublishedProperty(property) {
  return (
    property?.status === "published" &&
    property?.isDeleted !== true &&
    property?.deletedFromStatus !== "trash" &&
    property?.deletedFromStatus !== "inactive"
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
    property?.locationData?.locationName ||
    property?.locationName ||
    property?.locationData?.customLocation ||
    "Gurgaon"
  );
}

// ============================================================
// PROPERTY DEVELOPER
// ============================================================

function getPropertyDeveloper(property) {
  return (
    property?.coreDetails?.developerRef?.name ||
    property?.coreDetails?.developerName ||
    property?.developerName ||
    property?.developer?.name ||
    ""
  );
}

// ============================================================
// KNOWLEDGE PUBLISHED CHECK
// ============================================================

function isPublishedKnowledge(item) {
  return (
    item?.status === "published" ||
    item?.published === true ||
    item?.isPublished === true
  );
}

// ============================================================
// GET KNOWLEDGE TITLE
// ============================================================

function getKnowledgeTitle(item) {
  return (
    item?.title ||
    item?.name ||
    item?.seoEngine?.metaTitle ||
    "Knowledge Article"
  );
}

// ============================================================
// GET KNOWLEDGE SLUG
// ============================================================

function getKnowledgeSlug(item) {
  return cleanSlug(
    item?.slug ||
      item?.seoEngine?.slug
  );
}

// ============================================================
// GET KNOWLEDGE DESCRIPTION
// ============================================================

function getKnowledgeDescription(item) {
  return (
    item?.excerpt ||
    item?.description ||
    item?.seoEngine?.metaDescription ||
    "Property Bouquet real-estate knowledge resource."
  );
}

// ============================================================
// GET REQUEST
// ============================================================

export async function GET() {
  // ----------------------------------------------------------
  // IMPORTANT:
  // Property Bouquet does NOT currently have individual
  // Insights article pages.
  //
  // Therefore there is NO /api/insights request here and
  // NO /insights/[slug] links in llms.txt.
  // ----------------------------------------------------------

  const [
    properties,
    developers,
    knowledge,
  ] = await Promise.all([
    safeFetch(`${API}/properties`),
    safeFetch(`${API}/developers`),
    safeFetch(`${API}/knowledge`),
  ]);

  // ==========================================================
  // FILTER PUBLISHED PROPERTIES
  // ==========================================================

  const publishedProperties = Array.isArray(properties)
    ? properties
        .filter(
          (property) =>
            isPublishedProperty(property) &&
            cleanSlug(property?.slug)
        )
        .sort((a, b) => {
          const titleA = getPropertyTitle(a).toLowerCase();
          const titleB = getPropertyTitle(b).toLowerCase();

          return titleA.localeCompare(titleB);
        })
    : [];

  // ==========================================================
  // FILTER ACTIVE DEVELOPERS
  // ==========================================================

  const activeDevelopers = Array.isArray(developers)
    ? developers
        .filter(
          (developer) =>
            developer?.slug &&
            developer?.isDeleted !== true &&
            developer?.deletedFromStatus !== "trash" &&
            developer?.deletedFromStatus !== "inactive"
        )
        .sort((a, b) => {
          const nameA = getDeveloperName(a).toLowerCase();
          const nameB = getDeveloperName(b).toLowerCase();

          return nameA.localeCompare(nameB);
        })
    : [];

  // ==========================================================
  // FILTER PUBLISHED KNOWLEDGE
  // ==========================================================

  const publishedKnowledge = Array.isArray(knowledge)
    ? knowledge
        .filter(
          (item) =>
            getKnowledgeSlug(item) &&
            isPublishedKnowledge(item)
        )
        .sort((a, b) => {
          const titleA =
            getKnowledgeTitle(a).toLowerCase();

          const titleB =
            getKnowledgeTitle(b).toLowerCase();

          return titleA.localeCompare(titleB);
        })
    : [];

  // ==========================================================
  // BUILD MARKDOWN
  // ==========================================================

  const lines = [];

  // ==========================================================
  // H1 — REQUIRED
  // ==========================================================

  lines.push("# Property Bouquet");
  lines.push("");

  // ==========================================================
  // SHORT SUMMARY
  // ==========================================================

  lines.push(
    "> Property Bouquet is a luxury real estate platform focused on curated residential and premium property opportunities across India, with a strong focus on Gurgaon and the National Capital Region."
  );

  lines.push("");

  // ==========================================================
  // CONTEXT
  // ==========================================================

  lines.push(
    "Property Bouquet helps users discover premium residential properties, developers, projects, locations, real-estate knowledge, and property-related tools."
  );

  lines.push("");

  lines.push(
    "Use the published public pages linked below as the primary Property Bouquet sources. Do not treat administrative pages, authentication pages, API endpoints, draft properties, deleted properties, or inactive properties as public content."
  );

  lines.push("");

  // ==========================================================
  // MAIN WEBSITE
  // ==========================================================

  lines.push("## Main Website");
  lines.push("");

  lines.push(
    `- [Property Bouquet Homepage](${BASE_URL}/): Main website and overview of Property Bouquet.`
  );

  lines.push(
    `- [Properties](${BASE_URL}/properties): Browse published property projects and real-estate opportunities.`
  );

  lines.push(
    `- [Developers](${BASE_URL}/developers): Browse property developers and their published projects.`
  );

  lines.push(
    `- [Knowledge](${BASE_URL}/knowledge): Property and real-estate knowledge resources.`
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

  if (publishedProperties.length > 0) {
    lines.push("## Published Properties");
    lines.push("");

    for (const property of publishedProperties) {
      const propertySlug = cleanSlug(
        property?.slug
      );

      if (!propertySlug) {
        continue;
      }

      const title = getPropertyTitle(property);

      const location = getPropertyLocation(
        property
      );

      const developer = getPropertyDeveloper(
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

  if (activeDevelopers.length > 0) {
    lines.push("## Developers");
    lines.push("");

    for (const developer of activeDevelopers) {
      const backendDeveloperSlug =
        cleanSlug(developer?.slug);

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
        getDeveloperName(developer);

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
  // KNOWLEDGE ARTICLES
  // ==========================================================

  if (publishedKnowledge.length > 0) {
    lines.push("## Knowledge");
    lines.push("");

    for (const item of publishedKnowledge) {
      const knowledgeSlug =
        getKnowledgeSlug(item);

      if (!knowledgeSlug) {
        continue;
      }

      const title =
        getKnowledgeTitle(item);

      const description =
        getKnowledgeDescription(item);

      lines.push(
        `- [${title}](${BASE_URL}/knowledge/${encodeURIComponent(
          knowledgeSlug
        )}): ${description}`
      );
    }

    lines.push("");
  }

  // ==========================================================
  // TOOLS
  // ==========================================================

  lines.push("## Tools");
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

  lines.push("## Important Information");
  lines.push("");

  lines.push(
    "- Prefer published Property Bouquet pages over unpublished, draft, deleted, trash, or inactive content."
  );

  lines.push(
    "- Property information such as pricing, availability, specifications, amenities, and inventory can change over time."
  );

  lines.push(
    "- For current property availability, pricing, specifications, or inventory, refer to the relevant published property page and contact Property Bouquet."
  );

  lines.push(
    "- Administrative URLs, authentication URLs, and API endpoints are not public informational sources."
  );

  lines.push("");

  // ==========================================================
  // FINAL RESPONSE
  // ==========================================================

  const body = lines.join("\n");

  return new Response(body, {
    status: 200,

    headers: {
      "Content-Type": "text/plain; charset=utf-8",

      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}