const SITE_URL = "https://propertybouquet.com";

/**
 * ============================================================
 * PROPERTY SCHEMA
 * ============================================================
 *
 * Generates structured data for individual Property Bouquet
 * property pages.
 *
 * Property-page schema includes:
 *
 * - WebPage
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
 * IMPORTANT:
 *
 * The global WebSite / Organization / Brand schema is NOT
 * generated here.
 *
 * Those site-level entities are generated on the homepage
 * through siteSchema.js.
 *
 * This prevents duplicate WebSite entities across property
 * pages.
 *
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

/**
 * Converts trusted HTML content into plain text for schema.
 *
 * FAQ Answer.text should contain text rather than raw HTML.
 */
function stripHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return cleanString(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>/gi, " ")
      .replace(/<\/div>/gi, " ")
      .replace(/<\/li>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
  );
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

  const core = property?.coreDetails || {};
  const overview = property?.overview || {};
  const location = property?.locationData || {};
  const media = property?.media || {};
  const metrics = property?.keyMetrics || {};
  const category = property?.categoryData || {};
  const seo = property?.seoEngine || {};
  const configuration = property?.configurationSection || {};
  const gatedContent = property?.gatedContent || {};

  const unitConfigurations = Array.isArray(
    property?.unitConfigurations
  )
    ? property.unitConfigurations
    : [];

  const floorPlans = Array.isArray(
    gatedContent?.floorPlans
  )
    ? gatedContent.floorPlans
    : [];

  const plotConfigurations = Array.isArray(
    gatedContent?.plotConfigurations
  )
    ? gatedContent.plotConfigurations
    : [];

  const faqs = Array.isArray(
    property?.faqSection?.faqs
  )
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

  const developerName = cleanString(
    core.developerName ||
      property?.developerName
  );

  const developerLogo = toAbsoluteUrl(
    core.developerLogo ||
      property?.developerLogo
  );

  const locationName =
    cleanString(
      location.locationName ||
        location.customLocation ||
        location.locationRef?.name
    ) || "Gurgaon";

  const categoryName = cleanString(
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
    .trim()
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

  const propertyType = cleanString(
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
    const name = cleanString(
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
  //
  // PostalAddress is kept separate from Place.
  //
  // This is important because Residence.address expects
  // an address, not a Place entity.
  //
  // ==========================================================

  const locationParts = String(
    locationName || ""
  )
    .split(">")
    .map((item) => cleanString(item))
    .filter(Boolean);

  const schemaLocality =
    locationParts.length
      ? locationParts[
          locationParts.length - 1
        ]
      : "Gurgaon";

  const address = {
    "@type": "PostalAddress",

    addressLocality:
      schemaLocality,

    addressRegion:
      "Haryana",

    addressCountry:
      "IN",
  };

  // ==========================================================
  // PLACE
  // ==========================================================

  const parentLocation =
    locationHierarchy.length > 1
      ? locationHierarchy[
          locationHierarchy.length - 2
        ]
      : "";

  const place = {
    "@type": "Place",

    "@id": placeId,

    name: locationName,

    address,

    ...(parentLocation
      ? {
          containedInPlace: {
            "@type": "Place",
            name: parentLocation,
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
    Number(core.startingPrice);

  const maxPrice =
    Number(core.maxPrice);

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

      "@id": developerId,

      name: developerName,

      ...(developerLogo
        ? {
            logo: {
              "@type": "ImageObject",
              url: developerLogo,
            },
          }
        : {}),
    };
  }

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

      "@id": offerId,

      url: pageUrl,

      price: startingPrice,

      priceCurrency: "INR",

      itemOffered: {
        "@id": residenceId,
      },

      seller: {
        "@type": "Organization",

        name: "Property Bouquet",

        url: SITE_URL,
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
  // RESIDENCE
  // ==========================================================

  const residence = {
    "@type": "Residence",

    "@id": residenceId,

    url: pageUrl,

    name: propertyName,

    description: description,

    ...(images.length
      ? {
          image: images,
        }
      : {}),

    // IMPORTANT:
    // address is a PostalAddress.
    // It must not point to the Place entity.
    address,

    ...(amenities.length
      ? {
          amenityFeature:
            amenities.map(
              (amenity) => ({
                "@type":
                  "LocationFeatureSpecification",

                name: amenity,

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

    mainEntityOfPage: {
      "@id": webPageId,
    },

    ...(offer
      ? {
          offers: {
            "@id": offerId,
          },
        }
      : {}),
  };

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

    ...(offer
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

    // Reference the single site-level WebSite that exists
    // on the homepage.
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
              ...(Number.isFinite(
                Number(
                  plan.bedrooms
                )
              )
                ? {
                    numberOfRooms:
                      Number(
                        plan.bedrooms
                      ),
                  }
                : {}),
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

        ...(Number.isFinite(
          planPrice
        ) &&
        planPrice > 0
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
          (
            offerItem,
            index
          ) => ({
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
            Number.isFinite(
              sqYd
            ) &&
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
            Number.isFinite(
              sqFt
            ) &&
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

              ...(Number.isFinite(
                price
              ) &&
              price > 0
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

  let faqPage;

  const validFaqs = faqs
    .map((faq) => {
      const question =
        cleanString(
          faq?.question ||
            faq?.title ||
            faq?.heading
        );

      const rawAnswer =
        faq?.answer ||
        faq?.content ||
        faq?.description;

      const answer =
        stripHtml(rawAnswer);

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