const SITE_URL = "https://propertybouquet.com";

/**
 * ============================================================
 * PROPERTY SCHEMA
 * ============================================================
 *
 * Generates structured data for individual Property Bouquet
 * property pages.
 *
 * Schema graph includes:
 *
 * - WebPage
 * - WebSite
 * - BreadcrumbList
 * - RealEstateListing
 * - Residence
 * - Place
 * - Organization / Developer
 * - Offer
 * - OfferCatalog / Floor Plans
 * - OfferCatalog / Plot Configurations
 * - ImageObject
 * - FAQPage
 *
 * The graph is intentionally connected using @id values.
 *
 * IMPORTANT:
 * Only information that actually exists in the property
 * object should be emitted.
 * ============================================================
 */

// ============================================================
// HELPERS
// ============================================================

function cleanString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\s+/g, " ").trim();
}

function cleanUrl(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidUrl(value) {
  if (!value) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function toAbsoluteUrl(value) {
  const cleaned = cleanUrl(value);

  if (!cleaned) {
    return "";
  }

  if (isValidUrl(cleaned)) {
    return cleaned;
  }

  if (cleaned.startsWith("/")) {
    return `${SITE_URL}${cleaned}`;
  }

  return `${SITE_URL}/${cleaned}`;
}

function cleanArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) =>
      typeof item === "string"
        ? cleanString(item)
        : item
    )
    .filter(Boolean);
}

function addIfValue(object, key, value) {
  if (
    value !== undefined &&
    value !== null &&
    value !== ""
  ) {
    object[key] = value;
  }

  return object;
}

// ============================================================
// MAIN FUNCTION
// ============================================================

export function buildPropertySchema(property, slug) {
  if (!property || !slug) {
    return {
      "@context": "https://schema.org",
      "@graph": [],
    };
  }

  // ==========================================================
  // DATA SOURCES
  // ==========================================================

  const core =
    property?.coreDetails || {};

  const overview =
    property?.overview || {};

  const location =
    property?.locationData || {};

  const media =
    property?.media || {};

  const metrics =
    property?.keyMetrics || {};

  const category =
    property?.categoryData || {};

  const seo =
    property?.seoEngine || {};

  const configuration =
    property?.configurationSection || {};

  const gatedContent =
    property?.gatedContent || {};

  const unitConfigurations =
    Array.isArray(property?.unitConfigurations)
      ? property.unitConfigurations
      : [];

  const floorPlans =
    Array.isArray(gatedContent?.floorPlans)
      ? gatedContent.floorPlans
      : [];

  const plotConfigurations =
    Array.isArray(
      gatedContent?.plotConfigurations
    )
      ? gatedContent.plotConfigurations
      : [];

  const faqs =
    Array.isArray(property?.faqSection?.faqs)
      ? property.faqSection.faqs
      : Array.isArray(property?.faqs)
      ? property.faqs
      : [];

  // ==========================================================
  // BASIC VALUES
  // ==========================================================

  const propertyName =
    cleanString(core.title) ||
    "Luxury Property";

  const developerName =
    cleanString(
      core.developerName ||
        property?.developerName
    );

  const developerLogo =
    toAbsoluteUrl(
      core.developerLogo ||
        property?.developerLogo
    );

  const locationName =
    cleanString(
      location.locationName ||
        location.customLocation ||
        location.locationRef?.name
    ) || "Gurgaon";

  const categoryName =
    cleanString(
      category.categoryName
    );

  const description =
    cleanString(
      seo.metaDescription ||
        overview.description
    ) ||
    `Explore ${propertyName}${
      developerName
        ? ` by ${developerName}`
        : ""
    } in ${locationName}. View prices, floor plans, amenities, location details and project information on Property Bouquet.`;

  // ==========================================================
  // CANONICAL URL
  // ==========================================================

  const cleanSlug = String(slug)
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");

  const pageUrl =
    `${SITE_URL}/${cleanSlug}`;

  // ==========================================================
  // PROPERTY IDS
  // ==========================================================

  const webPageId =
    `${pageUrl}#webpage`;

  const listingId =
    `${pageUrl}#listing`;

  const residenceId =
    `${pageUrl}#residence`;

  const placeId =
    `${pageUrl}#place`;

  const developerId =
    `${pageUrl}#developer`;

  const offerId =
    `${pageUrl}#offer`;

  const imagesId =
    `${pageUrl}#images`;

  const floorPlansId =
    `${pageUrl}#floorplans`;

  const faqId =
    `${pageUrl}#faq`;

  // ==========================================================
  // IMAGES
  // ==========================================================

  const rawImages = [
    media.heroImageUrl,
    ...(Array.isArray(media.gallery)
      ? media.gallery
      : []),
  ];

  const images = [
    ...new Set(
      rawImages
        .map(toAbsoluteUrl)
        .filter(Boolean)
    ),
  ];

  // ==========================================================
  // AMENITIES
  // ==========================================================

  const amenities = cleanArray(
    Array.isArray(overview.amenities)
      ? overview.amenities.map(
          (item) =>
            item?.heading ||
            item?.name ||
            item?.title
        )
      : []
  );

  // ==========================================================
  // PROPERTY TYPE
  // ==========================================================

  const propertyType =
    cleanString(
      categoryName ||
        configuration?.propertyType
    );

  // ==========================================================
  // LOCATION HIERARCHY
  // ==========================================================

  const locationHierarchy = [];

  let currentLocation =
    location?.locationRef;

  while (currentLocation) {
    const name =
      cleanString(
        currentLocation?.name
      );

    if (
      name &&
      !locationHierarchy.includes(name)
    ) {
      locationHierarchy.push(name);
    }

    currentLocation =
      currentLocation?.parent;
  }

  // ==========================================================
  // ADDRESS
  // ==========================================================

  const address = {
    "@type": "PostalAddress",

    addressLocality:
      locationName,

    addressRegion:
      "Haryana",

    addressCountry:
      "IN",
  };

  // ==========================================================
  // PLACE
  // ==========================================================

  const place = {
    "@type": "Place",

    "@id":
      placeId,

    name:
      locationName,

    address,

    ...(locationHierarchy.length > 1
      ? {
          containedInPlace: {
            "@type": "Place",

            name:
              locationHierarchy[
                locationHierarchy.length - 1
              ],
          },
        }
      : {}),
  };

  // ==========================================================
  // PROPERTY ADDITIONAL PROPERTIES
  // ==========================================================

  const additionalProperty = [];

  const addPropertyValue = (
    name,
    value
  ) => {
    const cleaned =
      cleanString(value);

    if (!cleaned) {
      return;
    }

    additionalProperty.push({
      "@type": "PropertyValue",
      name,
      value: cleaned,
    });
  };

  addPropertyValue(
    "Land Area",
    metrics.landArea
  );

  addPropertyValue(
    "Possession",
    metrics.possession
  );

  addPropertyValue(
    "Project Status",
    metrics.status
  );

  addPropertyValue(
    "RERA Number",
    metrics.reraNumber
  );

  addPropertyValue(
    "Property Type",
    propertyType
  );

  addPropertyValue(
    "Market Type",
    property?.marketType
  );

  // ==========================================================
  // BEDROOM INFORMATION
  // ==========================================================

  const bedroomValues = [];

  unitConfigurations.forEach(
    (unit) => {
      const bedrooms =
        cleanString(
          unit?.bedrooms
        );

      if (
        bedrooms &&
        !bedroomValues.includes(
          bedrooms
        )
      ) {
        bedroomValues.push(
          bedrooms
        );
      }
    }
  );

  floorPlans.forEach(
    (plan) => {
      const bedrooms =
        cleanString(
          plan?.bedrooms
        );

      if (
        bedrooms &&
        !bedroomValues.includes(
          bedrooms
        )
      ) {
        bedroomValues.push(
          bedrooms
        );
      }
    }
  );

  if (bedroomValues.length) {
    addPropertyValue(
      "Bedrooms",
      bedroomValues.join(", ")
    );
  }

  // ==========================================================
  // BATHROOM INFORMATION
  // ==========================================================

  const bathroomValues = [];

  unitConfigurations.forEach(
    (unit) => {
      const bathrooms =
        cleanString(
          unit?.bathrooms
        );

      if (
        bathrooms &&
        !bathroomValues.includes(
          bathrooms
        )
      ) {
        bathroomValues.push(
          bathrooms
        );
      }
    }
  );

  if (bathroomValues.length) {
    addPropertyValue(
      "Bathrooms",
      bathroomValues.join(", ")
    );
  }

  // ==========================================================
  // PRICE
  // ==========================================================

  const startingPrice =
    Number(
      core.startingPrice
    );

  const maxPrice =
    Number(
      core.maxPrice
    );

  const hasStartingPrice =
    Number.isFinite(
      startingPrice
    ) &&
    startingPrice > 0;

  const hasMaxPrice =
    Number.isFinite(
      maxPrice
    ) &&
    maxPrice > 0;

  const priceOnRequest =
    core.priceOnRequest === true;

  // ==========================================================
  // DEVELOPER
  // ==========================================================

  let developerEntity;

  if (developerName) {
    developerEntity = {
      "@type": "Organization",

      "@id":
        developerId,

      name:
        developerName,

      ...(developerLogo
        ? {
            logo: {
              "@type":
                "ImageObject",

              url:
                developerLogo,
            },
          }
        : {}),
    };
  }

  // ==========================================================
  // RESIDENCE
  // ==========================================================

  const residence = {
    "@type": "Residence",

    "@id":
      residenceId,

    url:
      pageUrl,

    name:
      propertyName,

    description:
      description,

    ...(images.length
      ? {
          image:
            images,
        }
      : {}),

    ...(developerName
      ? {
          brand: {
            "@id":
              developerId,
          },
        }
      : {}),

    address: {
      "@id":
        placeId,
    },

    ...(amenities.length
      ? {
          amenityFeature:
            amenities.map(
              (amenity) => ({
                "@type":
                  "LocationFeatureSpecification",

                name:
                  amenity,

                value: true,
              })
            ),
        }
      : {}),

    ...(additionalProperty.length
      ? {
          additionalProperty,
        }
      : {}),

    ...(propertyType
      ? {
          additionalType:
            propertyType,
        }
      : {}),

    mainEntityOfPage: {
      "@id":
        webPageId,
    },

    ...(hasStartingPrice
      ? {
          offers: {
            "@id":
              offerId,
          },
        }
      : {}),
  };

  // ==========================================================
  // OFFER
  // ==========================================================

  let offer;

  if (
    !priceOnRequest &&
    hasStartingPrice
  ) {
    offer = {
      "@type": "Offer",

      "@id":
        offerId,

      url:
        pageUrl,

      price:
        startingPrice,

      priceCurrency:
        "INR",

      itemOffered: {
        "@id":
          residenceId,
      },

      seller: {
        "@type":
          "Organization",

        name:
          "Property Bouquet",

        url:
          SITE_URL,
      },

      businessFunction:
        "https://schema.org/Sell",

      ...(hasMaxPrice &&
      maxPrice > startingPrice
        ? {
            priceSpecification: {
              "@type":
                "PriceSpecification",

              minPrice:
                startingPrice,

              maxPrice:
                maxPrice,

              priceCurrency:
                "INR",
            },
          }
        : {}),
    };
  }

  // ==========================================================
  // REAL ESTATE LISTING
  // ==========================================================

  const realEstateListing = {
    "@type":
      "RealEstateListing",

    "@id":
      listingId,

    url:
      pageUrl,

    name:
      `${propertyName}${
        locationName
          ? ` in ${locationName}`
          : ""
      }`.trim(),

    description:
      description,

    mainEntity: {
      "@id":
        residenceId,
    },

    about: {
      "@id":
        residenceId,
    },

    ...(developerName
      ? {
          seller: {
            "@id":
              developerId,
          },
        }
      : {}),

    ...(hasStartingPrice &&
    offer
      ? {
          offers: {
            "@id":
              offerId,
          },
        }
      : {}),
  };

  // ==========================================================
  // WEBPAGE
  // ==========================================================

  const webPage = {
    "@type":
      "WebPage",

    "@id":
      webPageId,

    url:
      pageUrl,

    name:
      propertyName,

    description:
      description,

    inLanguage:
      "en-IN",

    isPartOf: {
      "@id":
        `${SITE_URL}/#website`,
    },

    ...(images[0]
      ? {
          primaryImageOfPage: {
            "@type":
              "ImageObject",

            "@id":
              `${pageUrl}#primaryimage`,

            url:
              images[0],

            contentUrl:
              images[0],

            caption:
              propertyName,
          },
        }
      : {}),

    mainEntity: {
      "@id":
        residenceId,
    },

    about: {
      "@id":
        residenceId,
    },

    breadcrumb: {
      "@id":
        `${pageUrl}#breadcrumb`,
    },

    ...(faqs.length
      ? {
          subjectOf: {
            "@id":
              faqId,
          },
        }
      : {}),
  };

  // ==========================================================
  // WEBSITE REFERENCE
  // ==========================================================

  const website = {
    "@type":
      "WebSite",

    "@id":
      `${SITE_URL}/#website`,

    url:
      SITE_URL,

    name:
      "Property Bouquet",

    inLanguage:
      "en-IN",

    publisher: {
      "@id":
        `${SITE_URL}/#organization`,
    },
  };

  // ==========================================================
  // BREADCRUMB
  // ==========================================================

  const breadcrumb = {
    "@type":
      "BreadcrumbList",

    "@id":
      `${pageUrl}#breadcrumb`,

    itemListElement: [
      {
        "@type":
          "ListItem",

        position: 1,

        name:
          "Home",

        item:
          SITE_URL,
      },

      {
        "@type":
          "ListItem",

        position: 2,

        name:
          "Properties",

        item:
          `${SITE_URL}/properties`,
      },

      {
        "@type":
          "ListItem",

        position: 3,

        name:
          propertyName,

        item:
          pageUrl,
      },
    ],
  };

  // ==========================================================
  // IMAGE LIST
  // ==========================================================

  let imageList;

  if (images.length) {
    imageList = {
      "@type":
        "ItemList",

      "@id":
        imagesId,

      name:
        `${propertyName} Images`,

      numberOfItems:
        images.length,

      itemListElement:
        images.map(
          (imageUrl, index) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            item: {
              "@type":
                "ImageObject",

              "@id":
                `${pageUrl}#image-${index + 1}`,

              url:
                imageUrl,

              contentUrl:
                imageUrl,

              caption:
                `${propertyName} - Image ${
                  index + 1
                }`,
            },
          })
        ),
    };
  }

  // ==========================================================
  // FLOOR PLANS
  // ==========================================================

  const floorPlanOffers = [];

  floorPlans.forEach(
    (plan) => {
      const unitType =
        cleanString(
          plan?.unitType ||
            plan?.name
        );

      const planImage =
        toAbsoluteUrl(
          plan?.image ||
            plan?.imageUrl
        );

      const area =
        Number(plan?.area);

      const planPrice =
        Number(plan?.price);

      const itemOffered = {
        "@type":
          "Apartment",

        ...(unitType
          ? {
              name:
                unitType,
            }
          : {}),

        ...(planImage
          ? {
              image:
                planImage,
            }
          : {}),

        ...(plan?.bedrooms !==
          undefined &&
        plan?.bedrooms !== null
          ? {
              numberOfRooms:
                Number(
                  plan.bedrooms
                ) ||
                plan.bedrooms,
            }
          : {}),

        ...(Number.isFinite(area) &&
        area > 0
          ? {
              floorSize: {
                "@type":
                  "QuantitativeValue",

                value:
                  area,

                unitText:
                  "sq ft",
              },
            }
          : {}),
      };

      const planOffer = {
        "@type":
          "Offer",

        ...(planPrice > 0
          ? {
              price:
                planPrice,

              priceCurrency:
                "INR",
            }
          : {}),

        itemOffered,
      };

      floorPlanOffers.push(
        planOffer
      );
    }
  );

  let floorPlanCatalog;

  if (floorPlanOffers.length) {
    floorPlanCatalog = {
      "@type":
        "OfferCatalog",

      "@id":
        floorPlansId,

      name:
        `${propertyName} Floor Plans`,

      numberOfItems:
        floorPlanOffers.length,

      itemListElement:
        floorPlanOffers.map(
          (offerItem, index) => ({
            "@type":
              "ListItem",

            position:
              index + 1,

            item:
              offerItem,
          })
        ),
    };
  }

  // ==========================================================
  // PLOT CONFIGURATIONS
  // ==========================================================

  let plotCatalog;

  if (
    gatedContent?.configurationType ===
      "Plots" &&
    plotConfigurations.length
  ) {
    const plotItems =
      plotConfigurations.map(
        (plot, index) => {
          const name =
            cleanString(
              plot?.name ||
                plot?.title ||
                plot?.range ||
                plot?.plotSize
            );

          const sqYd =
            Number(
              plot?.sqYd ||
                plot?.squareYards ||
                plot?.sizeSqYd
            );

          const sqFt =
            Number(
              plot?.sqFt ||
                plot?.squareFeet ||
                plot?.sizeSqFt
            );

          const price =
            Number(
              plot?.price
            );

          const image =
            toAbsoluteUrl(
              plot?.image ||
                plot?.imageUrl
            );

          const additional = [];

          if (
            Number.isFinite(sqYd) &&
            sqYd > 0
          ) {
            additional.push({
              "@type":
                "PropertyValue",

              name:
                "Plot Size",

              value:
                sqYd,

              unitCode:
                "YRD",
            });
          }

          if (
            Number.isFinite(sqFt) &&
            sqFt > 0
          ) {
            additional.push({
              "@type":
                "PropertyValue",

              name:
                "Plot Area",

              value:
                sqFt,

              unitCode:
                "FTK",
            });
          }

          const plotResidence = {
            "@type":
              "Residence",

            name:
              name ||
              `Plot Configuration ${
                index + 1
              }`,

            ...(image
              ? {
                  image:
                    image,
                }
              : {}),

            ...(additional.length
              ? {
                  additionalProperty:
                    additional,
                }
              : {}),
          };

          return {
            "@type":
              "ListItem",

            position:
              index + 1,

            item: {
              "@type":
                "Offer",

              ...(price > 0
                ? {
                    price:
                      price,

                    priceCurrency:
                      "INR",
                  }
                : {}),

              itemOffered:
                plotResidence,
            },
          };
        }
      );

    plotCatalog = {
      "@type":
        "OfferCatalog",

      "@id":
        `${pageUrl}#plot-configurations`,

      name:
        `${propertyName} Plot Configurations`,

      numberOfItems:
        plotItems.length,

      itemListElement:
        plotItems,
    };
  }

  // ==========================================================
  // FAQ SCHEMA
  // ==========================================================
  //
  // Uses only FAQ questions and answers that actually exist.
  //
  // FAQPage is included in the structured-data graph.
  //
  // IMPORTANT:
  // Google currently restricts FAQ rich results primarily to
  // authoritative government and health websites. Therefore,
  // this markup should not be added with the expectation that
  // Google will necessarily show FAQ rich-result snippets.
  //
  // The FAQ content should also be visibly present on the page.
  // ==========================================================

  let faqPage;

  const validFaqs = faqs
    .map((faq) => {
      const question =
        cleanString(
          faq?.question ||
            faq?.title ||
            faq?.heading
        );

      const answer =
        cleanString(
          faq?.answer ||
            faq?.content ||
            faq?.description
        );

      if (!question || !answer) {
        return null;
      }

      return {
        question,
        answer,
      };
    })
    .filter(Boolean);

  if (validFaqs.length) {
    faqPage = {
      "@type":
        "FAQPage",

      "@id":
        faqId,

      url:
        `${pageUrl}#faqs`,

      name:
        `${propertyName} Frequently Asked Questions`,

      inLanguage:
        "en-IN",

      isPartOf: {
        "@id":
          webPageId,
      },

      mainEntity:
        validFaqs.map(
          (faq) => ({
            "@type":
              "Question",

            name:
              faq.question,

            acceptedAnswer: {
              "@type":
                "Answer",

              text:
                faq.answer,
            },
          })
        ),
    };
  }

  // ==========================================================
  // GRAPH
  // ==========================================================

  const graph = [
    webPage,
    website,
    breadcrumb,
    place,
    residence,
    realEstateListing,
  ];

  // ==========================================================
  // DEVELOPER
  // ==========================================================

  if (developerEntity) {
    graph.push(
      developerEntity
    );
  }

  // ==========================================================
  // OFFER
  // ==========================================================

  if (offer) {
    graph.push(
      offer
    );
  }

  // ==========================================================
  // IMAGES
  // ==========================================================

  if (imageList) {
    graph.push(
      imageList
    );
  }

  // ==========================================================
  // FLOOR PLANS
  // ==========================================================

  if (floorPlanCatalog) {
    graph.push(
      floorPlanCatalog
    );
  }

  // ==========================================================
  // PLOT CONFIGURATIONS
  // ==========================================================

  if (plotCatalog) {
    graph.push(
      plotCatalog
    );
  }

  // ==========================================================
  // FAQ
  // ==========================================================

  if (faqPage) {
    graph.push(
      faqPage
    );
  }

  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    "@context":
      "https://schema.org",

    "@graph":
      graph.filter(Boolean),
  };
}