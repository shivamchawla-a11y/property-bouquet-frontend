import {
  notFound,
  permanentRedirect,
} from "next/navigation";

import LocationSlugClient from "./LocationSlugClient";

const SITE_URL = "https://propertybouquet.com";
const API = "https://propertybouquet.com";

/* ============================================================
   HELPERS
============================================================ */

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

/* ============================================================
   PUBLIC LOCATION SLUG
   ============================================================ */

function getLocationPreposition(location) {
  const name = String(location?.name || "")
    .trim()
    .toLowerCase();

  const slug = String(location?.slug || "")
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

  return onKeywords.some((keyword) =>
    value.includes(keyword)
  )
    ? "on"
    : "in";
}

function buildPublicLocationSlug(location) {
  if (!location) return "";

  const currentSlug = cleanSlug(location.slug);

  if (!currentSlug) return "";

  let root = location;

  const visited = new Set();

  while (root?.parent) {
    const rootId =
      root?._id?.toString?.() ||
      root?.id?.toString?.() ||
      root?.slug ||
      root?.name;

    if (rootId && visited.has(rootId)) {
      break;
    }

    if (rootId) {
      visited.add(rootId);
    }

    root = root.parent;
  }

  const rootSlug = cleanSlug(root?.slug);

  const preposition =
    getLocationPreposition(location);

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

function getClosestLocationImage(location) {
  const visited = new Set();

  let current = location;

  while (current) {
    const currentId =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (currentId && visited.has(currentId)) {
      break;
    }

    if (currentId) {
      visited.add(currentId);
    }

    const image =
      typeof current?.image === "string"
        ? current.image.trim()
        : "";

    if (image) {
      return image;
    }

    current = current.parent;
  }

  return "";
}

/* ============================================================
   LOCATION NAME
============================================================ */

function getLocationName(location) {
  return (
    location?.name ||
    location?.seoName ||
    "Prime Location"
  );
}

/* ============================================================
   LOCATION DESCRIPTION
============================================================ */

function getLocationDescription(
  location,
  properties = []
) {
  if (location?.description) {
    return location.description;
  }

  const locationName = getLocationName(location);

  const developerNames = [
    ...new Set(
      properties
        .map(
          (property) =>
            property?.coreDetails?.developerName
        )
        .filter(Boolean)
    ),
  ];

  const developerText =
    developerNames.length > 0
      ? ` featuring developments by ${developerNames
          .slice(0, 5)
          .join(", ")}`
      : "";

  return `Explore luxury properties, premium residences and investment opportunities in ${locationName}${developerText}. Discover curated real estate projects with Property Bouquet.`;
}

/* ============================================================
   FETCH OLD/BACKEND LOCATION
============================================================ */

async function getBackendLocation(backendSlug) {
  try {
    const response = await fetch(
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

    const data = await response.json();

    if (!data?.success || !data?.location) {
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
   FETCH PUBLIC LOCATION
============================================================ */

async function getPublicLocation(publicSlug) {
  try {
    const response = await fetch(
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

    const data = await response.json();

    if (!data?.success || !data?.location) {
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
   FILTER PUBLISHED PROPERTIES
============================================================ */

function filterPublishedProperties(
  properties = []
) {
  return properties.filter((property) => {
    if (!property) return false;

    if (property.status !== "published") {
      return false;
    }

    if (property.isDeleted === true) {
      return false;
    }

    if (
      property.deletedFromStatus === "trash"
    ) {
      return false;
    }

    return true;
  });
}

/* ============================================================
   BUILD BREADCRUMB CHAIN
============================================================ */

function buildLocationChain(location) {
  const chain = [];
  const visited = new Set();

  let current = location;

  while (current) {
    const id =
      current?._id?.toString?.() ||
      current?.id?.toString?.() ||
      current?.slug ||
      current?.name;

    if (id && visited.has(id)) {
      break;
    }

    if (id) {
      visited.add(id);
    }

    chain.unshift(current);

    current = current.parent;
  }

  return chain;
}

/* ============================================================
   GENERATE METADATA
============================================================ */

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const publicSlug = cleanSlug(slug);

  if (!publicSlug) {
    return {};
  }

  /*
   * First try the NEW public SEO URL.
   */
  let data =
    await getPublicLocation(publicSlug);

  /*
   * If the public URL did not match, try the OLD
   * backend slug so that old URLs can redirect.
   */
  if (!data) {
    const oldData =
      await getBackendLocation(publicSlug);

    if (oldData?.location) {
      const canonicalPublicSlug =
        buildPublicLocationSlug(
          oldData.location
        );

      if (
        canonicalPublicSlug &&
        canonicalPublicSlug !== publicSlug
      ) {
        permanentRedirect(
          `/locations/${canonicalPublicSlug}`
        );
      }

      data = oldData;
    }
  }

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

  const location = data.location;

  const properties =
    filterPublishedProperties(
      data.properties || []
    );

  const locationName =
    getLocationName(location);

  const canonicalPublicSlug =
    buildPublicLocationSlug(location);

  const canonicalUrl =
    `${SITE_URL}/locations/${canonicalPublicSlug}`;

  const description =
    getLocationDescription(
      location,
      properties
    );

  /*
   * Current image first.
   * If missing, use parent.
   * If parent missing, use grandparent.
   */
  const inheritedImage =
    getClosestLocationImage(location);

  const ogImage =
    inheritedImage ||
    properties?.[0]?.media?.heroImageUrl ||
    `${SITE_URL}/logo.png`;

  return {
    title: `Luxury Properties in ${locationName} | Projects & Real Estate`,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },

    openGraph: {
      title: `Luxury Properties in ${locationName} | Property Bouquet`,
      description,
      url: canonicalUrl,
      siteName: "Property Bouquet",
      type: "website",

      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Luxury properties in ${locationName}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `Luxury Properties in ${locationName} | Property Bouquet`,
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

  const requestedSlug = cleanSlug(slug);

  if (!requestedSlug) {
    notFound();
  }

  /* ==========================================================
     FIRST: TRY NEW PUBLIC URL
  ========================================================== */

  let data =
    await getPublicLocation(
      requestedSlug
    );

  /* ==========================================================
     OLD URL REDIRECT
  ========================================================== */

  if (!data) {
    const oldData =
      await getBackendLocation(
        requestedSlug
      );

    if (!oldData?.location) {
      notFound();
    }

    const canonicalPublicSlug =
      buildPublicLocationSlug(
        oldData.location
      );

    /*
     * Redirect old backend URL to the new SEO URL.
     *
     * Example:
     *
     * /locations/sector-56
     *
     * becomes:
     *
     * /locations/properties-in-sector-56-gurgaon
     */
    if (
      canonicalPublicSlug &&
      canonicalPublicSlug !== requestedSlug
    ) {
      permanentRedirect(
        `/locations/${canonicalPublicSlug}`
      );
    }

    data = oldData;
  }

  if (!data?.location) {
    notFound();
  }

  /* ==========================================================
     LOCATION
  ========================================================== */

  const location = data.location;

  /* ==========================================================
     PROPERTIES
  ========================================================== */

  const properties =
    filterPublishedProperties(
      data.properties || []
    );

  /* ==========================================================
     PUBLIC SLUG
  ========================================================== */

  const publicSlug =
    buildPublicLocationSlug(location);

  /* ==========================================================
     INHERITED IMAGE
  ========================================================== */

  /*
   * Current location image wins.
   *
   * Otherwise:
   *
   * Sector 56
   *     ↓
   * Golf Course Road
   *     ↓
   * Gurgaon
   */
  const locationImage =
    getClosestLocationImage(location);

  /*
   * Pass the inherited image to the client.
   *
   * This allows the hero to use the parent image even
   * when the current location itself has no image.
   */
  const locationForClient = {
    ...location,
    image:
      locationImage ||
      location?.image ||
      "",
  };

  /* ==========================================================
     BREADCRUMB
  ========================================================== */

  const locationChain =
    buildLocationChain(location);

  /* ==========================================================
     JSON-LD
  ========================================================== */

  const locationName =
    getLocationName(location);

  const canonicalUrl =
    `${SITE_URL}/locations/${publicSlug}`;

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
      item: `${SITE_URL}/locations`,
    },

    ...locationChain.map(
      (item, index) => {
        const itemPublicSlug =
          buildPublicLocationSlug(item);

        return {
          "@type": "ListItem",
          position: index + 3,
          name: getLocationName(item),
          item: `${SITE_URL}/locations/${itemPublicSlug}`,
        };
      }
    ),
  ];

  const inheritedImage =
    getClosestLocationImage(location);

  const schemaImage =
    inheritedImage ||
    properties?.[0]?.media?.heroImageUrl ||
    `${SITE_URL}/logo.png`;

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Place",
      name: locationName,
      url: canonicalUrl,
      image: schemaImage,
    },

    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Luxury Properties in ${locationName}`,
      url: canonicalUrl,
      description:
        getLocationDescription(
          location,
          properties
        ),
      isPartOf: {
        "@type": "WebSite",
        name: "Property Bouquet",
        url: SITE_URL,
      },
    },

    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Properties in ${locationName}`,
      url: canonicalUrl,

      about: {
        "@type": "Place",
        name: locationName,
      },

      numberOfItems: properties.length,
    },

    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    },
  ];

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <>
      {/* ========================================================
          STRUCTURED DATA
      ======================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      {/* ========================================================
          LOCATION CLIENT PAGE
      ======================================================== */}

      <LocationSlugClient
        location={locationForClient}
        properties={properties}
        slug={publicSlug}
      />
    </>
  );
}