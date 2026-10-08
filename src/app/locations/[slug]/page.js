import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import LocationSlugClient from "./LocationSlugClient";

// Supports different export styles from locationContent.js
import * as locationContentModule from "./locationContent";

/* ============================================================
   CONFIG
============================================================ */

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://propertybouquet.com"
).replace(/\/+$/, "");

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  SITE_URL
).replace(/\/+$/, "");

/* ============================================================
   BASIC HELPERS
============================================================ */

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

function cleanString(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function absoluteUrl(value) {
  const stringValue = cleanString(value);

  if (!stringValue) {
    return "";
  }

  if (
    stringValue.startsWith("http://") ||
    stringValue.startsWith("https://")
  ) {
    return stringValue;
  }

  if (stringValue.startsWith("/")) {
    return `${SITE_URL}${stringValue}`;
  }

  return `${SITE_URL}/${stringValue}`;
}

/* ============================================================
   DISPLAY NAME
============================================================ */

function formatDisplayName(value) {
  const text = cleanString(value);

  if (!text) {
    return "Prime Location";
  }

  /*
   * If the source already contains deliberate capitalization,
   * preserve it.
   *
   * Example:
   * Dwarka Expressway -> unchanged
   * Golf Course Road -> unchanged
   * DLF Phase 5 -> unchanged
   */
  if (text !== text.toLowerCase()) {
    return text;
  }

  /*
   * Only repair completely lowercase source values.
   *
   * Examples:
   * dwarka expressway -> Dwarka Expressway
   * sector 102 -> Sector 102
   * golf course road -> Golf Course Road
   */
  return text
    .split(/(\s+|-)/)
    .map((part) => {
      if (!part || /^\s+$/.test(part) || part === "-") {
        return part;
      }

      return (
        part.charAt(0).toUpperCase() +
        part.slice(1)
      );
    })
    .join("")
    .replace(/\bMg\b/g, "MG")
    .replace(/\bNh\b/g, "NH")
    .replace(/\bNcr\b/g, "NCR")
    .replace(/\bDlf\b/g, "DLF")
    .replace(/\bIgi\b/g, "IGI");
}

/* ============================================================
   HTML -> PLAIN TEXT
============================================================ */

function stripHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/div>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&#xA0;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/* ============================================================
   MEANINGFUL CMS VALUE
============================================================ */

function hasMeaningfulValue(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return true;
}

/* ============================================================
   CMS OVER STATIC MERGE
============================================================ */

function mergeLocationContent(
  staticContent = {},
  cmsContent = {}
) {
  if (
    !staticContent ||
    typeof staticContent !== "object" ||
    Array.isArray(staticContent)
  ) {
    return cmsContent || {};
  }

  if (
    !cmsContent ||
    typeof cmsContent !== "object" ||
    Array.isArray(cmsContent)
  ) {
    return staticContent;
  }

  const result = {
    ...staticContent,
  };

  Object.keys(cmsContent).forEach((key) => {
    const cmsValue = cmsContent[key];
    const staticValue = result[key];

    /*
     * Recursively merge nested objects.
     */
    if (
      staticValue &&
      typeof staticValue === "object" &&
      !Array.isArray(staticValue) &&
      cmsValue &&
      typeof cmsValue === "object" &&
      !Array.isArray(cmsValue)
    ) {
      result[key] = mergeLocationContent(
        staticValue,
        cmsValue
      );

      return;
    }

    /*
     * Empty CMS arrays do not destroy static arrays.
     */
    if (Array.isArray(cmsValue)) {
      if (cmsValue.length > 0) {
        result[key] = cmsValue;
      }

      return;
    }

    /*
     * Empty CMS strings preserve static content.
     */
    if (
      typeof cmsValue === "string" &&
      !cmsValue.trim()
    ) {
      return;
    }

    /*
     * null / undefined preserve static content.
     */
    if (
      cmsValue === null ||
      cmsValue === undefined
    ) {
      return;
    }

    /*
     * false / 0 / objects / non-empty strings
     * are legitimate explicit CMS values.
     */
    if (hasMeaningfulValue(cmsValue)) {
      result[key] = cmsValue;
    }
  });

  return result;
}

/* ============================================================
   LIVE COUNT REPLACEMENT
============================================================ */

function replaceLiveCountTokens(
  value,
  count
) {
  if (typeof value === "string") {
    const countString = String(count);

    return value
      .replace(
        /\[\s*live\s+count\s*\]/gi,
        countString
      )
      .replace(
        /\[\s*project\s+count\s*\]/gi,
        countString
      )
      .replace(
        /\{\{\s*live\s+count\s*\}\}/gi,
        countString
      )
      .replace(
        /\{\{\s*project\s+count\s*\}\}/gi,
        countString
      )
      .replace(
        /\{\{\s*count\s*\}\}/gi,
        countString
      );
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      replaceLiveCountTokens(item, count)
    );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const result = {};

    Object.entries(value).forEach(
      ([key, item]) => {
        result[key] =
          replaceLiveCountTokens(
            item,
            count
          );
      }
    );

    return result;
  }

  return value;
}

/* ============================================================
   NORMALIZE LEGACY CMS FIELDS
============================================================ */

function normalizePageContent(
  content = {},
  propertyCount = 0
) {
  if (
    !content ||
    typeof content !== "object"
  ) {
    return {};
  }

  const result = {
    ...content,
  };

  /*
   * Old -> current section names.
   *
   * Current fields always win if both exist.
   */

  if (
    !result.realEstateTypes &&
    result.realEstateType
  ) {
    result.realEstateTypes =
      result.realEstateType;
  }

  if (
    !result.realEstateTypes &&
    result.realEstate
  ) {
    result.realEstateTypes =
      result.realEstate;
  }

  if (
    !result.prices &&
    result.propertyPrices
  ) {
    result.prices =
      result.propertyPrices;
  }

  if (
    !result.nearby &&
    result.nearbyLocations
  ) {
    result.nearby =
      result.nearbyLocations;
  }

  if (
    !result.connectivity &&
    result.locationConnectivity
  ) {
    result.connectivity =
      result.locationConnectivity;
  }

  if (
    !result.lifestyle &&
    result.locationLifestyle
  ) {
    result.lifestyle =
      result.locationLifestyle;
  }

  if (
    !result.about &&
    result.aboutLocation
  ) {
    result.about =
      result.aboutLocation;
  }

  if (
    !result.whyBuy &&
    result.whyBuyLocation
  ) {
    result.whyBuy =
      result.whyBuyLocation;
  }

  /*
   * FAQ legacy structure.
   */

  if (Array.isArray(result.faq)) {
    result.faq = {
      items: result.faq,
    };
  }

  if (
    !result.faq &&
    Array.isArray(result.faqs)
  ) {
    result.faq = {
      items: result.faqs,
    };
  }

  if (
    result.faq &&
    !result.faq.items &&
    Array.isArray(result.faqs)
  ) {
    result.faq = {
      ...result.faq,
      items: result.faqs,
    };
  }

  /*
   * Replace live-count placeholders everywhere,
   * including FAQ rich text.
   */
  return replaceLiveCountTokens(
    result,
    propertyCount
  );
}

/* ============================================================
   LOCATION CONTENT RESOLVER
============================================================ */

function resolveLocationContent(
  location,
  properties = []
) {
  const module =
    locationContentModule || {};

  const locationSlug = cleanSlug(
    location?.slug
  );

  const locationNameSlug = cleanSlug(
    location?.name
  );

  const publicSlug = cleanSlug(
    buildPublicLocationSlug(location)
  );

  const defaultExport =
    module?.default;

  /*
   * FUNCTION EXPORTS
   */

  if (
    typeof module?.getLocationContent ===
    "function"
  ) {
    const result =
      module.getLocationContent(
        location,
        properties
      );

    if (result) {
      return result;
    }
  }

  if (
    typeof defaultExport ===
    "function"
  ) {
    const result =
      defaultExport(
        location,
        properties
      );

    if (result) {
      return result;
    }
  }

  if (
    typeof module?.locationContent ===
    "function"
  ) {
    const result =
      module.locationContent(
        location,
        properties
      );

    if (result) {
      return result;
    }
  }

  /*
   * OBJECT EXPORTS
   */

  const exportedObject =
    module?.locationContent ||
    module?.locations ||
    defaultExport;

  if (
    exportedObject &&
    typeof exportedObject === "object" &&
    !Array.isArray(exportedObject)
  ) {
    /*
     * Direct content object.
     */
    if (
      exportedObject.hero ||
      exportedObject.about ||
      exportedObject.seo ||
      exportedObject.faq ||
      exportedObject.faqs ||
      exportedObject.connectivity ||
      exportedObject.realEstateTypes ||
      exportedObject.realEstateType ||
      exportedObject.propertyPrices ||
      exportedObject.prices ||
      exportedObject.lifestyle ||
      exportedObject.whyBuy ||
      exportedObject.nearby ||
      exportedObject.nearbyLocations
    ) {
      return exportedObject;
    }

    /*
     * Location-keyed content.
     */
    const possibleKeys = [
      locationSlug,
      locationNameSlug,
      publicSlug,
    ].filter(Boolean);

    for (const key of possibleKeys) {
      if (
        exportedObject[key] &&
        typeof exportedObject[key] ===
          "object"
      ) {
        return exportedObject[key];
      }
    }

    /*
     * Normalized/case-insensitive key matching.
     */
    const normalizedPossibleKeys =
      possibleKeys.map(cleanSlug);

    for (const key of Object.keys(
      exportedObject
    )) {
      if (
        normalizedPossibleKeys.includes(
          cleanSlug(key)
        )
      ) {
        return exportedObject[key];
      }
    }
  }

  return {};
}

/* ============================================================
   PUBLIC LOCATION URL
============================================================ */

function getLocationPreposition(
  location
) {
  const name = String(
    location?.name || ""
  )
    .trim()
    .toLowerCase();

  const slug = String(
    location?.slug || ""
  )
    .trim()
    .toLowerCase();

  const value = `${name} ${slug}`;

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

function buildPublicLocationSlug(
  location
) {
  if (!location) {
    return "";
  }

  const currentSlug = cleanSlug(
    location.slug
  );

  if (!currentSlug) {
    return "";
  }

  let root = location;
  const visited = new Set();

  while (root?.parent) {
    const rootId =
      root?._id?.toString?.() ||
      root?.id?.toString?.() ||
      root?.slug ||
      root?.name;

    if (
      rootId &&
      visited.has(rootId)
    ) {
      break;
    }

    if (rootId) {
      visited.add(rootId);
    }

    root = root.parent;
  }

  const rootSlug = cleanSlug(
    root?.slug
  );

  const preposition =
    getLocationPreposition(
      location
    );

  if (
    !rootSlug ||
    rootSlug === currentSlug
  ) {
    return `properties-${preposition}-${currentSlug}`;
  }

  return `properties-${preposition}-${currentSlug}-${rootSlug}`;
}

/* ============================================================
   LOCATION IMAGE INHERITANCE
============================================================ */

function getClosestLocationImage(
  location
) {
  const visited = new Set();
  let current = location;

  while (current) {
    const currentId =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (
      currentId &&
      visited.has(currentId)
    ) {
      break;
    }

    if (currentId) {
      visited.add(currentId);
    }

    const image =
      typeof current?.image ===
      "string"
        ? current.image.trim()
        : "";

    if (image) {
      return image;
    }

    current = current?.parent;
  }

  return "";
}

/* ============================================================
   LOCATION NAME
============================================================ */

function getLocationName(
  location
) {
  return formatDisplayName(
    cleanString(location?.seoName) ||
      cleanString(location?.name) ||
      "Prime Location"
  );
}

/* ============================================================
   LOCATION DESCRIPTION
============================================================ */

function getLocationDescription(
  location,
  properties = [],
  content = {}
) {
  /*
   * Prefer explicit CMS SEO description.
   */
  const contentDescription =
    content?.seo?.description ||
    content?.metaDescription;

  if (
    typeof contentDescription ===
      "string" &&
    contentDescription.trim()
  ) {
    return stripHtml(
      contentDescription
    );
  }

  /*
   * Then CMS about description.
   */
  const aboutDescription =
    content?.about?.description;

  if (
    typeof aboutDescription ===
      "string" &&
    aboutDescription.trim()
  ) {
    return stripHtml(
      aboutDescription
    );
  }

  /*
   * Then backend description.
   */
  if (
    typeof location?.description ===
      "string" &&
    location.description.trim()
  ) {
    return stripHtml(
      location.description
    );
  }

  /*
   * Last-resort concise fallback.
   *
   * This intentionally avoids the old long,
   * generic template paragraph.
   */
  const locationName =
    getLocationName(location);

  const projectCount =
    properties.length;

  return (
    `Explore ${projectCount} published ` +
    `property ${
      projectCount === 1
        ? "project"
        : "projects"
    } in ${locationName}, including ` +
    `residential developments, property ` +
    `prices, connectivity and real estate ` +
    `opportunities curated by Property Bouquet.`
  );
}

/* ============================================================
   BACKEND LOCATION
============================================================ */

async function getBackendLocation(
  backendSlug
) {
  try {
    const response =
      await fetch(
        `${API}/api/locations/${encodeURIComponent(
          backendSlug
        )}`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (
      !data?.success ||
      !data?.location
    ) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch backend location:",
      error
    );

    return null;
  }
}

/* ============================================================
   PUBLIC LOCATION
============================================================ */

async function getPublicLocation(
  publicSlug
) {
  try {
    const response =
      await fetch(
        `${API}/api/locations/public/${encodeURIComponent(
          publicSlug
        )}`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    if (
      !data?.success ||
      !data?.location
    ) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "Failed to fetch public location:",
      error
    );

    return null;
  }
}

/* ============================================================
   PUBLISHED PROPERTY FILTER
============================================================ */

function filterPublishedProperties(
  properties = []
) {
  return properties.filter(
    (property) => {
      if (!property) {
        return false;
      }

      if (
        property.status !==
        "published"
      ) {
        return false;
      }

      if (
        property.isDeleted === true
      ) {
        return false;
      }

      if (
        property.deletedFromStatus ===
        "trash"
      ) {
        return false;
      }

      return true;
    }
  );
}

/* ============================================================
   LOCATION CHAIN
============================================================ */

function buildLocationChain(
  location
) {
  const chain = [];
  const visited = new Set();

  let current = location;

  while (current) {
    const id =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (
      id &&
      visited.has(id)
    ) {
      break;
    }

    if (id) {
      visited.add(id);
    }

    chain.unshift(current);

    current = current?.parent;
  }

  return chain;
}

/* ============================================================
   SEO TITLE
============================================================ */

function getSeoTitle(
  location,
  content
) {
  const locationName =
    getLocationName(location);

  return (
    cleanString(
      content?.seo?.title
    ) ||
    cleanString(
      content?.metaTitle
    ) ||
    `Luxury Properties in ${locationName} | Projects & Real Estate`
  );
}

/* ============================================================
   SEO KEYWORDS
============================================================ */

function getSeoKeywords(
  location,
  content
) {
  const locationName =
    getLocationName(location);

  const defaultKeywords = [
    `properties in ${locationName}`,
    `flats in ${locationName}`,
    `luxury apartments in ${locationName}`,
    `property prices in ${locationName}`,
    `real estate in ${locationName}`,
    `new projects in ${locationName}`,
  ];

  const keywords =
    content?.seo?.keywords ||
    content?.keywords;

  if (Array.isArray(keywords)) {
    return [
      ...new Set([
        ...keywords
          .map(cleanString)
          .filter(Boolean),
        ...defaultKeywords,
      ]),
    ];
  }

  if (
    typeof keywords === "string" &&
    keywords.trim()
  ) {
    return [
      ...new Set([
        ...keywords
          .split(",")
          .map(cleanString)
          .filter(Boolean),
        ...defaultKeywords,
      ]),
    ];
  }

  return defaultKeywords;
}

/* ============================================================
   FINAL PAGE CONTENT
============================================================ */

function getFinalPageContent(
  location,
  properties
) {
  const staticContent =
    resolveLocationContent(
      location,
      properties
    );

  const mergedContent =
    mergeLocationContent(
      staticContent || {},
      location?.pageContent || {}
    );

  /*
   * Normalize legacy CMS fields and replace
   * [live count] before the content reaches:
   *
   * 1. Client
   * 2. FAQ
   * 3. JSON-LD
   * 4. Metadata
   */
  return normalizePageContent(
    mergedContent,
    properties.length
  );
}

/* ============================================================
   CLIENT LOCATION OBJECT
============================================================ */

function buildLocationForClient(
  location,
  pageContent
) {
  const locationImage =
    getClosestLocationImage(
      location
    );

  return {
    ...location,

    // Always expose the properly formatted display name
    // to the client while keeping slug/hierarchy unchanged.
    name: getLocationName(location),

    image:
      locationImage ||
      location?.image ||
      "",

    pageContent,
  };
}

/* ============================================================
   LOCATION REF PROJECTION
============================================================ */

/*
 * The location filter only needs the hierarchy.
 *
 * This prevents the complete populated location tree
 * from being repeated inside every property object.
 */
function projectLocationRef(
  location,
  depth = 0
) {
  if (
    !location ||
    depth > 12
  ) {
    return undefined;
  }

  return {
    _id: location?._id,
    id: location?.id,
    name: location?.name,
    seoName: location?.seoName,
    slug: location?.slug,

    parent:
      location?.parent
        ? projectLocationRef(
            location.parent,
            depth + 1
          )
        : undefined,
  };
}

/* ============================================================
   PROPERTY CLIENT PROJECTION
============================================================ */

/*
 * IMPORTANT:
 *
 * Do NOT pass the complete MongoDB property document
 * into LocationSlugClient.
 *
 * The page needs enough information for:
 *
 * - project cards
 * - filters
 * - developer filters
 * - location filters
 * - BHK filters
 * - amenity filters
 * - price filters
 * - price section
 * - configuration section
 * - hero/gallery images
 *
 * but it does not need admin/audit/history/etc.
 */

function projectPropertyForClient(
  property
) {
  const core =
    property?.coreDetails || {};

  const media =
    property?.media || {};

  const locationData =
    property?.locationData || {};

  const overview =
    property?.overview || {};

  const gatedContent =
    property?.gatedContent || {};

  const projectedMedia = {
    heroImageUrl:
      media?.heroImageUrl ||
      media?.heroImage ||
      "",

    images:
      Array.isArray(media?.images)
        ? media.images.slice(0, 8)
        : [],

    gallery:
      Array.isArray(media?.gallery)
        ? media.gallery.slice(0, 16)
        : [],
  };

  return {
    _id: property?._id,
    id: property?.id,

    slug:
      cleanString(property?.slug) ||
      cleanString(
        property?.seoEngine?.slug
      ),

    status:
      property?.status,

    marketType:
      property?.marketType,

    tags:
      Array.isArray(property?.tags)
        ? property.tags
        : [],

    createdAt:
      property?.createdAt,

    updatedAt:
      property?.updatedAt,

    /*
     * Common card fields.
     */
    title:
      property?.title ||
      core?.title,

    name:
      property?.name,

    propertyType:
      property?.propertyType ||
      core?.propertyType,

    developerName:
      property?.developerName ||
      core?.developerName,

    developerRef:
      property?.developerRef ||
      core?.developerRef,

    developer:
      property?.developer,

    developerData:
      property?.developerData,

    /*
     * Core property data used throughout
     * the location page.
     */
    coreDetails: {
      title:
        core?.title,

      developerName:
        core?.developerName,

      developerRef:
        core?.developerRef,

      propertyType:
        core?.propertyType,

      location:
        core?.location,

      startingPrice:
        core?.startingPrice,

      maxPrice:
        core?.maxPrice,

      priceOnRequest:
        core?.priceOnRequest,

      possessionDate:
        core?.possessionDate,

      status:
        core?.status,

      marketType:
        core?.marketType,

      bhk:
        core?.bhk,

      area:
        core?.area,

      city:
        core?.city,

      locality:
        core?.locality,
    },

    /*
     * Category data is required by the
     * propertyType filter.
     */
    categoryData:
      property?.categoryData,

    /*
     * Location data required by:
     *
     * location filtering
     * property cards
     * location hierarchy
     */
    locationData: {
      locationRef:
        projectLocationRef(
          locationData?.locationRef
        ),

      locationName:
        locationData?.locationName,

      customLocation:
        locationData?.customLocation,

      name:
        locationData?.name,

      slug:
        locationData?.slug,
    },

    /*
     * Amenities used by amenity filtering.
     */
    overview: {
      amenities:
        Array.isArray(
          overview?.amenities
        )
          ? overview.amenities
          : [],
    },

    /*
     * Floor plans are required by BHK filtering.
     */
    gatedContent: {
      floorPlans:
        Array.isArray(
          gatedContent?.floorPlans
        )
          ? gatedContent.floorPlans
          : [],
    },

    /*
     * These two are intentionally preserved
     * because the price/configuration components
     * can need their actual configuration data.
     */
    pricing:
      property?.pricing,

    configuration:
      property?.configuration,

    /*
     * Keep developer/location aliases that
     * existing project-card components may read.
     */
    developerImage:
      property?.developerImage,

    developerLogo:
      property?.developerLogo,

    customLocation:
      property?.customLocation,

    location:
      property?.location,

    /*
     * Images are deliberately capped.
     */
    media: projectedMedia,

    /*
     * Preserve SEO slug if a project card needs it.
     */
    seoEngine: {
      slug:
        property?.seoEngine?.slug,
    },
  };
}

function projectPropertiesForClient(
  properties = []
) {
  return properties.map(
    projectPropertyForClient
  );
}

/* ============================================================
   PROPERTY ITEM LIST
============================================================ */

function buildPropertyItemList(
  properties = []
) {
  return properties
    .map((property) => {
      const propertySlug =
        cleanString(
          property?.slug
        ) ||
        cleanString(
          property?.seoEngine?.slug
        );

      if (!propertySlug) {
        return null;
      }

      const propertyUrl =
        `${SITE_URL}/properties/${encodeURIComponent(
          cleanSlug(propertySlug)
        )}`;

      const propertyName =
        cleanString(
          property?.coreDetails?.title
        ) ||
        cleanString(
          property?.title
        ) ||
        cleanString(
          property?.name
        ) ||
        "Property";

      return {
        propertyName,
        propertyUrl,
      };
    })
    .filter(Boolean)
    .map(
      (
        item,
        index
      ) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.propertyName,
        url: item.propertyUrl,
      })
    );
}

/* ============================================================
   FAQ ITEMS
============================================================ */

function getValidFaqItems(
  pageContent
) {
  const faqItems =
    Array.isArray(
      pageContent?.faq?.items
    )
      ? pageContent.faq.items
      : Array.isArray(
          pageContent?.faqs
        )
      ? pageContent.faqs
      : [];

  return faqItems
    .map((item) => {
      const question =
        stripHtml(
          item?.question
        );

      const answer =
        stripHtml(
          item?.answer
        );

      return {
        question,
        answer,
      };
    })
    .filter(
      (item) =>
        item.question &&
        item.answer
    );
}

/* ============================================================
   FETCH LOCATION DATA
============================================================ */

async function getLocationData(
  requestedSlug
) {
  /*
   * First try canonical public slug.
   */
  const publicData =
    await getPublicLocation(
      requestedSlug
    );

  if (publicData?.location) {
    return {
      data: publicData,
      needsRedirect: false,
    };
  }

  /*
   * Then try old/backend slug.
   */
  const oldData =
    await getBackendLocation(
      requestedSlug
    );

  if (!oldData?.location) {
    return {
      data: null,
      needsRedirect: false,
    };
  }

  const canonicalPublicSlug =
    buildPublicLocationSlug(
      oldData.location
    );

  if (
    canonicalPublicSlug &&
    canonicalPublicSlug !==
      requestedSlug
  ) {
    return {
      data: oldData,
      needsRedirect:
        canonicalPublicSlug,
    };
  }

  return {
    data: oldData,
    needsRedirect: false,
  };
}

/* ============================================================
   GENERATE METADATA
============================================================ */

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const requestedSlug =
    cleanSlug(slug);

  if (!requestedSlug) {
    return {};
  }

  const {
    data,
  } = await getLocationData(
    requestedSlug
  );

  if (!data?.location) {
    return {
      title:
        "Location Not Found | Property Bouquet",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const location =
    data.location;

  const properties =
    filterPublishedProperties(
      data.properties || []
    );

  const pageContent =
    getFinalPageContent(
      location,
      properties
    );

  const locationName =
    getLocationName(location);

  const canonicalPublicSlug =
    buildPublicLocationSlug(
      location
    );

  const canonicalUrl =
    `${SITE_URL}/locations/${canonicalPublicSlug}`;

  const description =
    getLocationDescription(
      location,
      properties,
      pageContent
    );

  const title =
    getSeoTitle(
      location,
      pageContent
    );

  const keywords =
    getSeoKeywords(
      location,
      pageContent
    );

  const inheritedImage =
    getClosestLocationImage(
      location
    );

  const ogImage =
    absoluteUrl(
      inheritedImage ||
        properties?.[0]?.media
          ?.heroImageUrl ||
        "/logo.png"
    );

  return {
    title,

    description,

    keywords,

    alternates: {
      canonical:
        canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview":
          "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName:
        "Property Bouquet",
      type: "website",
      locale: "en_IN",

      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt:
            `Luxury properties in ${locationName}`,
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* ============================================================
   LOCATION PAGE
============================================================ */

export default async function LocationPage({
  params,
}) {
  const { slug } = await params;

  const requestedSlug =
    cleanSlug(slug);

  if (!requestedSlug) {
    notFound();
  }

  /* ==========================================================
     LOAD LOCATION
  ========================================================== */

  const {
    data,
    needsRedirect,
  } = await getLocationData(
    requestedSlug
  );

  if (!data?.location) {
    notFound();
  }

  /*
   * IMPORTANT:
   *
   * Old location URLs redirect from the actual page response.
   * This produces a real permanent redirect rather than merely
   * changing metadata.
   */
  if (needsRedirect) {
    permanentRedirect(
      `/locations/${needsRedirect}`
    );
  }

  /* ==========================================================
     LOCATION
  ========================================================== */

  const location =
    data.location;

  /* ==========================================================
     PUBLISHED PROPERTIES ONLY
  ========================================================== */

  const properties =
    filterPublishedProperties(
      data.properties || []
    );

  /*
   * This is the complete published property set.
   *
   * Do NOT slice this list here.
   *
   * The visual project section can still show 9 at a time,
   * but the server knows about all published projects.
   */

  /* ==========================================================
     PUBLIC SLUG
  ========================================================== */

  const publicSlug =
    buildPublicLocationSlug(
      location
    );

  if (!publicSlug) {
    notFound();
  }

  /*
   * Safety check.
   *
   * Any technically valid but non-canonical URL gets
   * permanently redirected to the public SEO URL.
   */
  if (
    requestedSlug !==
    publicSlug
  ) {
    permanentRedirect(
      `/locations/${publicSlug}`
    );
  }

  /* ==========================================================
     FINAL PAGE CONTENT
  ========================================================== */

  const pageContent =
    getFinalPageContent(
      location,
      properties
    );

  /* ==========================================================
     CLIENT LOCATION
  ========================================================== */

  const locationForClient =
    buildLocationForClient(
      location,
      pageContent
    );

  /* ==========================================================
     CLIENT PROPERTY PAYLOAD
  ========================================================== */

  const clientProperties =
    projectPropertiesForClient(
      properties
    );

  /* ==========================================================
     LOCATION CHAIN
  ========================================================== */

  const locationChain =
    buildLocationChain(
      location
    );

  /* ==========================================================
     BASIC SEO VALUES
  ========================================================== */

  const locationName =
    getLocationName(location);

  const canonicalUrl =
    `${SITE_URL}/locations/${publicSlug}`;

  const description =
    getLocationDescription(
      location,
      properties,
      pageContent
    );

  /* ==========================================================
     BREADCRUMB JSON-LD
  ========================================================== */

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },

    {
      "@type": "ListItem",
      position: 2,
      name: "Locations",
      item:
        `${SITE_URL}/locations`,
    },

    ...locationChain
      .map((item) => {
        const itemPublicSlug =
          buildPublicLocationSlug(
            item
          );

        if (!itemPublicSlug) {
          return null;
        }

        return {
          "@type": "ListItem",

          name:
            getLocationName(item),

          item:
            `${SITE_URL}/locations/${itemPublicSlug}`,
        };
      })
      .filter(Boolean)
      .map(
        (
          item,
          index
        ) => ({
          ...item,
          position: index + 3,
        })
      ),
  ];

  /* ==========================================================
     SCHEMA IMAGE
  ========================================================== */

  const inheritedImage =
    getClosestLocationImage(
      location
    );

  const schemaImage =
    absoluteUrl(
      inheritedImage ||
        properties?.[0]?.media
          ?.heroImageUrl ||
        "/logo.png"
    );

  /* ==========================================================
     PLACE SCHEMA
  ========================================================== */

  const placeSchema = {
    "@type": "Place",

    name:
      locationName,

    url:
      canonicalUrl,

    image:
      schemaImage,
  };

  /* ==========================================================
     WEB PAGE SCHEMA
  ========================================================== */

  const webPageSchema = {
    "@type": "WebPage",

    name:
      getSeoTitle(
        location,
        pageContent
      ),

    url:
      canonicalUrl,

    description,

    inLanguage:
      "en-IN",

    isPartOf: {
      "@type": "WebSite",

      name:
        "Property Bouquet",

      url:
        SITE_URL,
    },
  };

  /* ==========================================================
     COLLECTION PAGE + COMPLETE ITEM LIST
  ========================================================== */

  const propertyItemList =
    buildPropertyItemList(
      properties
    );

  const collectionSchema = {
    "@type":
      "CollectionPage",

    name:
      `Properties in ${locationName}`,

    url:
      canonicalUrl,

    description,

    inLanguage:
      "en-IN",

    about: {
      "@type": "Place",

      name:
        locationName,
    },

    numberOfItems:
      propertyItemList.length,

    mainEntity: {
      "@type": "ItemList",

      name:
        `Properties in ${locationName}`,

      numberOfItems:
        propertyItemList.length,

      itemListOrder:
        "https://schema.org/ItemListOrderAscending",

      itemListElement:
        propertyItemList,
    },
  };

  /* ==========================================================
     BREADCRUMB SCHEMA
  ========================================================== */

  const breadcrumbSchema = {
    "@type":
      "BreadcrumbList",

    itemListElement:
      breadcrumbItems,
  };

  /* ==========================================================
     FAQ SCHEMA
  ========================================================== */

  const faqEnabled =
    pageContent?.faq?.enabled !==
    false;

  const validFaqItems =
    getValidFaqItems(
      pageContent
    );

  const faqSchema =
    faqEnabled &&
    validFaqItems.length > 0
      ? {
          "@type":
            "FAQPage",

          mainEntity:
            validFaqItems.map(
              (item) => ({
                "@type":
                  "Question",

                name:
                  item.question,

                acceptedAnswer: {
                  "@type":
                    "Answer",

                  text:
                    item.answer,
                },
              })
            ),
        }
      : null;

  /* ==========================================================
     FINAL STRUCTURED DATA
  ========================================================== */

  const schema = [
    {
      "@context":
        "https://schema.org",

      ...placeSchema,
    },

    {
      "@context":
        "https://schema.org",

      ...webPageSchema,
    },

    {
      "@context":
        "https://schema.org",

      ...collectionSchema,
    },

    {
      "@context":
        "https://schema.org",

      ...breadcrumbSchema,
    },

    ...(faqSchema
      ? [
          {
            "@context":
              "https://schema.org",

            ...faqSchema,
          },
        ]
      : []),
  ];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* ======================================================
          STRUCTURED DATA
      ====================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(schema),
        }}
      />

      {/* ======================================================
          LOCATION CLIENT PAGE
      ====================================================== */}

      <LocationSlugClient
        location={
          locationForClient
        }

        /*
         * IMPORTANT:
         *
         * Pass the reduced client payload,
         * not the complete MongoDB property documents.
         */
        properties={
          clientProperties
        }

        slug={
          publicSlug
        }

        /*
         * IMPORTANT:
         *
         * This is the exact server-resolved content.
         *
         * LocationSlugClient must NOT call
         * getLocationContent() again.
         */
        pageContent={
          pageContent
        }
      />
    </>
  );
}