const SITE_URL = "https://propertybouquet.com";

export function buildLandingPageSchema(landingPage) {
  const title =
    landingPage?.seo?.metaTitle ||
    landingPage?.title ||
    "Property Listings";

  const description =
    landingPage?.seo?.metaDescription ||
    landingPage?.description ||
    "";

  const slug = landingPage?.slug || "";

  const pageUrl = `${SITE_URL}/${slug}`;

  const graph = [];

  // -----------------------------------
  // Breadcrumb
  // -----------------------------------

  graph.push({
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: pageUrl,
      },
    ],
  });

  // -----------------------------------
  // Collection Page
  // -----------------------------------

  graph.push({
    "@type": "CollectionPage",

    "@id": pageUrl,

    url: pageUrl,

    name: title,

    description,

    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },

    inLanguage: "en-IN",
  });

  // -----------------------------------
  // Website
  // -----------------------------------

  graph.push({
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    url: SITE_URL,

    name: "Property Bouquet",

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    inLanguage: "en-IN",
  });

  // -----------------------------------
  // Organization
  // -----------------------------------

  graph.push({
    "@type": "Organization",

    "@id": `${SITE_URL}/#organization`,

    name: "Property Bouquet",

    url: SITE_URL,

    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
    },

    sameAs: [
      "https://www.instagram.com/.....",
      "https://www.facebook.com/.....",
      "https://www.linkedin.com/company/.....",
    ],
  });

  // -----------------------------------
  // ItemList (Properties Listing)
  // -----------------------------------

  if (
    Array.isArray(landingPage?.properties) &&
    landingPage.properties.length
  ) {
    graph.push({
      "@type": "ItemList",

      "@id": `${pageUrl}#properties`,

      name: `${title} Property Listings`,

      itemListOrder:
        "https://schema.org/ItemListOrderAscending",

      numberOfItems: landingPage.properties.length,

      itemListElement:
        landingPage.properties.map(
          (property, index) => ({
            "@type": "ListItem",

            position: index + 1,

            url: `${SITE_URL}/${property.slug}`,

            name:
              property?.coreDetails?.title ||
              property?.title,
          })
        ),
    });
  }

  return {
    "@context": "https://schema.org",

    "@graph": graph,
  };
}