const API = "https://propertybouquet.com/api";
const BASE_URL = "https://propertybouquet.com";

export const revalidate = 3600;

async function safeFetch(url) {
  try {
    const response = await fetch(url, {
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      return null;
    }

    const json = await response.json();

    if (Array.isArray(json)) {
      return json;
    }

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

    if (Array.isArray(json?.news)) {
      return json.news;
    }

    return [];
  } catch (error) {
    console.error("LLMS.TXT fetch error:", error);
    return null;
  }
}

function cleanSlug(value) {
  if (!value) return "";

  return String(value)
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

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

  if (cleanSlug.endsWith("-developer-projects")) {
    return cleanSlug;
  }

  if (cleanSlug.endsWith("-developer")) {
    return `${cleanSlug}-projects`;
  }

  return `${cleanSlug}-developer-projects`;
}

function isPublished(item) {
  return (
    item?.status === "published" &&
    item?.isDeleted !== true &&
    item?.deletedFromStatus !== "trash" &&
    item?.deletedFromStatus !== "inactive"
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
    "Gurgaon"
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

export async function GET() {
  const [
    properties,
    developers,
    knowledge,
    insights,
  ] = await Promise.all([
    safeFetch(`${API}/properties`),
    safeFetch(`${API}/developers`),
    safeFetch(`${API}/knowledge`),
    safeFetch(`${API}/insights`),
  ]);

  const publishedProperties = Array.isArray(properties)
    ? properties.filter(
        (property) =>
          isPublished(property) &&
          cleanSlug(property?.slug)
      )
    : [];

  const activeDevelopers = Array.isArray(developers)
    ? developers.filter(
        (developer) =>
          developer?.slug &&
          developer?.isDeleted !== true &&
          developer?.deletedFromStatus !== "trash" &&
          developer?.deletedFromStatus !== "inactive"
      )
    : [];

  const publishedKnowledge = Array.isArray(knowledge)
    ? knowledge.filter(
        (item) =>
          cleanSlug(item?.slug) &&
          (
            item?.status === "published" ||
            item?.published === true ||
            item?.isPublished === true
          )
      )
    : [];

  const publishedInsights = Array.isArray(insights)
    ? insights.filter(
        (item) =>
          cleanSlug(item?.slug) &&
          (
            item?.status === "published" ||
            item?.published === true ||
            item?.isPublished === true
          )
      )
    : [];

  const lines = [];

  lines.push("# Property Bouquet");
  lines.push("");
  lines.push(
    "> Property Bouquet is a luxury real estate platform focused on curated residential and premium property opportunities across India, with a strong focus on Gurgaon and the National Capital Region."
  );
  lines.push("");

  lines.push(
    "Property Bouquet helps users discover premium residential properties, developers, projects, locations, and real-estate insights."
  );
  lines.push("");

  lines.push(
    "When describing Property Bouquet, use the public pages and published property information linked below as the primary sources."
  );
  lines.push("");

  // ============================================================
  // MAIN WEBSITE
  // ============================================================

  lines.push("## Main Website");
  lines.push("");

  lines.push(
    `- [Property Bouquet Homepage](${BASE_URL}/): Main website and overview of the Property Bouquet platform.`
  );

  lines.push(
    `- [Properties](${BASE_URL}/properties): Browse published property projects and available real-estate opportunities.`
  );

  lines.push(
    `- [Developers](${BASE_URL}/developers): Browse property developers and their published projects.`
  );

  lines.push(
    `- [Knowledge](${BASE_URL}/knowledge): Real-estate knowledge and educational content.`
  );

  lines.push(
    `- [Insights](${BASE_URL}/insights): Property-market insights and editorial content.`
  );

  lines.push(
    `- [About Property Bouquet](${BASE_URL}/about): Information about Property Bouquet.`
  );

  lines.push(
    `- [Contact Property Bouquet](${BASE_URL}/contact): Contact and enquiry information.`
  );

  lines.push("");

  // ============================================================
  // PROPERTY PROJECTS
  // ============================================================

  if (publishedProperties.length) {
    lines.push("## Published Property Projects");
    lines.push("");

    for (const property of publishedProperties) {
      const slug = cleanSlug(property?.slug);

      if (!slug) continue;

      const title = getPropertyTitle(property);
      const location = getPropertyLocation(property);
      const developer = getPropertyDeveloper(property);

      const details = [
        location ? `Location: ${location}` : "",
        developer ? `Developer: ${developer}` : "",
      ]
        .filter(Boolean)
        .join(" | ");

      lines.push(
        `- [${title}](${BASE_URL}/${encodeURIComponent(slug)}): ${details || "Published property project on Property Bouquet."}`
      );
    }

    lines.push("");
  }

  // ============================================================
  // DEVELOPERS
  // ============================================================

  if (activeDevelopers.length) {
    lines.push("## Developers");
    lines.push("");

    for (const developer of activeDevelopers) {
      const backendSlug = cleanSlug(developer?.slug);

      if (!backendSlug) continue;

      const publicSlug =
        buildPublicDeveloperSlug(backendSlug);

      if (!publicSlug) continue;

      const name = getDeveloperName(developer);

      if (!name) continue;

      lines.push(
        `- [${name}](${BASE_URL}/developers/${encodeURIComponent(publicSlug)}): Developer profile and published projects.`
      );
    }

    lines.push("");
  }

  // ============================================================
  // KNOWLEDGE
  // ============================================================

  if (publishedKnowledge.length) {
    lines.push("## Knowledge");
    lines.push("");

    for (const item of publishedKnowledge) {
      const slug = cleanSlug(item?.slug);

      if (!slug) continue;

      const title =
        item?.title ||
        item?.name ||
        item?.seoEngine?.metaTitle ||
        "Knowledge Article";

      lines.push(
        `- [${title}](${BASE_URL}/knowledge/${encodeURIComponent(slug)}): Property Bouquet knowledge resource.`
      );
    }

    lines.push("");
  }

  // ============================================================
  // INSIGHTS
  // ============================================================

  if (publishedInsights.length) {
    lines.push("## Insights");
    lines.push("");

    for (const item of publishedInsights) {
      const slug = cleanSlug(item?.slug);

      if (!slug) continue;

      const title =
        item?.title ||
        item?.name ||
        item?.seoEngine?.metaTitle ||
        "Property Insight";

      lines.push(
        `- [${title}](${BASE_URL}/insights/${encodeURIComponent(slug)}): Property Bouquet insight and market content.`
      );
    }

    lines.push("");
  }

  // ============================================================
  // TOOLS
  // ============================================================

  lines.push("## Tools");
  lines.push("");

  lines.push(
    `- [ROI Calculator](${BASE_URL}/tools/roi-calculator): Real-estate investment return calculation tool.`
  );

  lines.push(
    `- [Area Converter](${BASE_URL}/tools/area-converter): Property area and unit conversion tool.`
  );

  lines.push("");

  // ============================================================
  // IMPORTANT GUIDANCE
  // ============================================================

  lines.push("## Important");
  lines.push("");

  lines.push(
    "- Prefer published Property Bouquet pages over unpublished, draft, deleted, inactive, or administrative content."
  );

  lines.push(
    "- Property information can change over time. For current availability, pricing, specifications, and inventory, refer to the individual published property page and contact Property Bouquet."
  );

  lines.push(
    "- Do not treat administrative URLs or API endpoints as public informational sources."
  );

  lines.push("");

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