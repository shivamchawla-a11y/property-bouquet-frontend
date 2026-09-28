const DEFAULT_FAQS = (locationName, preposition = "in") => [
  {
    question: `What types of properties are available ${preposition} ${locationName}?`,
    answer: `Property Bouquet features apartments, luxury residences, builder floors, independent floors and other residential opportunities available ${preposition} ${locationName}, subject to current listings.`,
  },

  {
    question: `What is the property price range ${preposition} ${locationName}?`,
    answer: `Property prices vary by project, developer, property type, size, location and specifications. Current Property Bouquet listings provide the latest available pricing information where disclosed.`,
  },

  {
    question: `Which areas are well connected to ${locationName}?`,
    answer: `${locationName} can be evaluated through its connectivity to major roads, expressways, business districts, schools, healthcare facilities, retail destinations and other important parts of the surrounding region.`,
  },

  {
    question: `Is ${locationName} suitable for homebuyers?`,
    answer: `${locationName} can be evaluated by homebuyers based on factors such as connectivity, residential infrastructure, available amenities, property types, developer offerings and proximity to everyday conveniences.`,
  },

  {
    question: `Is ${locationName} suitable for property investment?`,
    answer: `Investment suitability depends on factors including acquisition price, project quality, location, infrastructure, demand, developer track record, possession timelines and the buyer's investment objectives.`,
  },
];

const CONTENT = {
  "dwarka-expressway": {
    preposition: "on",

    seo: {
      title:
        "Properties on Dwarka Expressway, Gurugram | Property Bouquet",

      description:
        "Explore luxury flats, apartments, builder floors and new launch projects on Dwarka Expressway, Gurugram. Compare properties, prices, developers and locations with Property Bouquet.",

      focusKeyword:
        "properties on Dwarka Expressway",

      relatedKeywords: [
        "flats on Dwarka Expressway",
        "luxury apartments on Dwarka Expressway",
        "builder floors on Dwarka Expressway",
        "Dwarka Expressway property prices",
        "new launch projects on Dwarka Expressway",
        "properties near Dwarka Expressway",
        "residential projects on Dwarka Expressway",
      ],
    },

    hero: {
      eyebrow: "A PREMIUM GROWTH CORRIDOR",

      title:
        "Luxury Properties on Dwarka Expressway",

      description:
        "Explore luxury flats, builder floors and new launch projects on Dwarka Expressway, Gurugram's evolving real estate corridor. Discover available projects, compare property options and connect with Property Bouquet advisors for guidance.",

      badges: [
        "Luxury Projects",
        "2 to 4 BHK",
      ],

      primaryButton:
        "Explore Properties",

      secondaryButton:
        "Contact Advisor",
    },

    about: {
      enabled: true,

      eyebrow:
        "INTRODUCING THE CORRIDOR",

      title:
        "Dwarka Expressway (NH-248BB), Gurugram",

      description:
        "Dwarka Expressway (NH-248BB) is an important road corridor connecting Delhi and Gurugram. Its residential landscape includes premium apartments, builder floors, independent floors and new developments across multiple sectors. The corridor has attracted attention from homebuyers and developers as connectivity and surrounding infrastructure continue to evolve.",

      highlights: [
        "Connectivity towards Delhi and IGI Airport",
        "Luxury residential projects across multiple sectors",
        "Apartments, builder floors and independent floors",
        "Access to established and emerging neighbourhoods",
      ],
    },

    realEstateTypes: {
      enabled: true,

      title:
        "Properties on Dwarka Expressway for Every Lifestyle",

      description:
        "Property options along Dwarka Expressway span multiple formats, allowing buyers to evaluate homes according to their lifestyle, space requirements and budget.",

      types: [
        {
          title:
            "Independent Floors",

          description:
            "Independent-floor residences can appeal to buyers looking for greater privacy, independent access and a more residential living format.",
        },

        {
          title:
            "Luxury Apartments",

          description:
            "Premium apartments offer amenities-led community living with a range of configurations and lifestyle facilities.",
        },

        {
          title:
            "Builder Floors",

          description:
            "Builder-floor residences provide another option for buyers seeking relatively independent residential living in established or developing neighbourhoods.",
        },

        {
          title:
            "New Launch Projects",

          description:
            "New developments provide access to contemporary layouts, modern amenities and newly planned residential communities.",
        },
      ],
    },

    prices: {
      enabled: true,

      title:
        "Property Prices on Dwarka Expressway",

      description:
        "Property prices on Dwarka Expressway vary according to sector, project, developer, property type, configuration, size, amenities and construction stage. Use the live Property Bouquet listings above to compare currently available opportunities.",

      factorsTitle:
        "What Influences Property Prices?",

      factors: [
        "Project location and sector",
        "Developer and project positioning",
        "Apartment or floor configuration",
        "Unit size and layout",
        "Amenities and specifications",
        "Construction and possession stage",
        "Connectivity and surrounding infrastructure",
      ],
    },

    connectivity: {
      enabled: true,

      eyebrow:
        "CONNECTIVITY",

      title:
        "Seamless Connectivity from Dwarka Expressway",

      description:
        "Dwarka Expressway provides an important connection between Delhi and Gurugram while improving access to major employment, airport and residential destinations. Its wider connectivity network is an important consideration when evaluating property in the corridor.",

      points: [
        {
          title:
            "Delhi & IGI Airport",

          description:
            "The corridor provides access towards Delhi and Indira Gandhi International Airport.",
        },

        {
          title:
            "Gurugram Business Districts",

          description:
            "Connectivity towards major employment and commercial areas makes the corridor relevant for working professionals.",
        },

        {
          title:
            "Major Road Networks",

          description:
            "Connections to surrounding arterial roads and expressways improve access across Gurugram and neighbouring areas.",
        },

        {
          title:
            "New Gurugram",

          description:
            "Dwarka Expressway sits within a developing residential ecosystem with multiple new projects and supporting infrastructure.",
        },
      ],
    },

    lifestyle: {
      enabled: true,

      title:
        "Everyday Convenience Around Dwarka Expressway",

      description:
        "The surrounding residential ecosystem is developing alongside retail, education, healthcare and everyday services, creating a more complete neighbourhood experience for residents.",

      sections: [
        {
          title:
            "Everything You Need, Closer to Home",

          description:
            "Residents can evaluate nearby schools, healthcare facilities, retail destinations, dining, entertainment and daily conveniences while choosing a project.",
        },

        {
          title:
            "Schools & Education",

          description:
            "The wider Gurugram and Delhi-NCR ecosystem provides access to established educational institutions.",
        },

        {
          title:
            "Healthcare Facilities",

          description:
            "Major hospitals and healthcare facilities across Gurugram and Delhi remain accessible through the surrounding road network.",
        },

        {
          title:
            "Shopping & Entertainment",

          description:
            "Retail destinations, malls, dining and entertainment options across Gurugram provide additional lifestyle convenience.",
        },
      ],
    },

    whyBuy: {
      enabled: true,

      title:
        "Why Consider Properties on Dwarka Expressway?",

      description:
        "Buyers evaluating Dwarka Expressway typically consider the corridor through a combination of location, connectivity, infrastructure, residential development and lifestyle factors.",

      reasons: [
        {
          title:
            "Strategic Location",

          description:
            "The corridor connects important parts of Delhi and Gurugram and provides access towards the airport and major employment areas.",
        },

        {
          title:
            "Infrastructure Development",

          description:
            "Infrastructure development around the corridor has contributed to continued residential and commercial activity.",
        },

        {
          title:
            "Residential Development",

          description:
            "The area includes established communities as well as new residential developments catering to different buyer profiles.",
        },

        {
          title:
            "Multiple Developers",

          description:
            "Multiple established developers have launched residential projects across the wider Dwarka Expressway corridor.",
        },

        {
          title:
            "Lifestyle Ecosystem",

          description:
            "Growing access to education, healthcare, retail and entertainment contributes to the area's residential ecosystem.",
        },

        {
          title:
            "Long-Term Evaluation",

          description:
            "Buyers can assess future suitability by considering infrastructure, development plans, project quality and surrounding residential demand.",
        },
      ],
    },

    nearby: {
      enabled: true,

      title:
        "Explore Locations Near Dwarka Expressway",

      description:
        "Explore nearby Gurugram locations and compare residential opportunities across connected neighbourhoods.",
    },

    faq: {
      enabled: true,

      title:
        "FAQs About Properties on Dwarka Expressway",

      items:
        DEFAULT_FAQS(
          "Dwarka Expressway",
          "on"
        ),
    },

    advisor: {
      enabled: true,

      title:
        "Looking for the Right Property on Dwarka Expressway?",

      description:
        "Speak with a Property Bouquet advisor to discuss available projects, configurations, pricing and site-visit options.",
    },

    images: {
      hero: "",
      heroAlt:
        "Luxury properties on Dwarka Expressway, Gurugram",

      introAlt:
        "Elevated Dwarka Expressway with residential developments in Gurugram",

      aboutAlt:
        "Residential sectors along Dwarka Expressway, Gurugram",

      connectivityAlt:
        "Dwarka Expressway connectivity towards IGI Airport",

      lifestyleAlt:
        "Residential community and lifestyle destinations near Dwarka Expressway",

      advisorAlt:
        "Property Bouquet advisor discussing residential projects on Dwarka Expressway",
    },
  },
};

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

function getLocationName(location) {
  return (
    location?.name ||
    location?.locationName ||
    location?.seoName ||
    location?.title ||
    "Prime Location"
  );
}

function getPreposition(locationName, slug) {
  const value =
    `${locationName || ""} ${slug || ""}`.toLowerCase();

  return /expressway|road|highway|street|avenue|boulevard|drive|marg/i.test(
    value
  )
    ? "on"
    : "in";
}

function getProjectCount(properties = []) {
  return Array.isArray(properties)
    ? properties.length
    : 0;
}

function buildDefaultContent(
  location,
  properties = []
) {
  const slug = cleanSlug(
    location?.slug
  );

  const locationName =
    getLocationName(location);

  const preposition =
    getPreposition(
      locationName,
      slug
    );

  const projectCount =
    getProjectCount(properties);

  const liveProjectText =
    projectCount === 1
      ? "1 Live Project"
      : `${projectCount} Live Projects`;

  return {
    preposition,

    seo: {
      title:
        `Properties ${preposition} ${locationName}, Gurugram | Property Bouquet`,

      description:
        `Explore properties ${preposition} ${locationName}, including apartments, luxury residences, builder floors and residential projects with Property Bouquet.`,

      focusKeyword:
        `properties ${preposition} ${locationName}`,

      relatedKeywords: [
        `flats ${preposition} ${locationName}`,
        `apartments ${preposition} ${locationName}`,
        `luxury properties ${preposition} ${locationName}`,
        `property prices ${preposition} ${locationName}`,
        `residential projects ${preposition} ${locationName}`,
      ],
    },

    hero: {
      eyebrow:
        "PRIME RESIDENTIAL LOCATION",

      title:
        `Luxury Properties ${preposition} ${locationName}`,

      description:
        `Explore residential properties ${preposition} ${locationName}, compare available projects and discover property opportunities with Property Bouquet.`,

      badges: [
        liveProjectText,
        "Residential Projects",
      ],

      primaryButton:
        "Explore Properties",

      secondaryButton:
        "Contact Advisor",
    },

    about: {
      enabled: true,

      eyebrow:
        "ABOUT THE LOCATION",

      title:
        `${locationName}`,

      description:
        location?.description ||
        `Explore residential opportunities ${preposition} ${locationName}, including premium homes, new developments and projects across different segments.`,

      highlights: [
        "Residential property options",
        "Multiple project configurations",
        "Access to surrounding infrastructure",
        "Lifestyle and everyday conveniences",
      ],
    },

    realEstateTypes: {
      enabled: true,

      title:
        `Properties ${preposition} ${locationName} for Every Lifestyle`,

      description:
        `Explore different residential formats available ${preposition} ${locationName}.`,

      types: [
        {
          title:
            "Luxury Apartments",

          description:
            `Premium apartments available ${preposition} ${locationName}, subject to current listings.`,
        },

        {
          title:
            "Builder Floors",

          description:
            `Builder-floor residences offering an alternative residential format ${preposition} ${locationName}.`,
        },

        {
          title:
            "Independent Floors",

          description:
            `Independent-floor options for buyers looking for a more private residential format.`,
        },

        {
          title:
            "New Residential Projects",

          description:
            `New developments and residential projects available ${preposition} ${locationName}.`,
        },
      ],
    },

    prices: {
      enabled: true,

      title:
        `Property Prices ${preposition} ${locationName}`,

      description:
        `Property prices ${preposition} ${locationName} vary by project, developer, configuration, size, location, amenities and specifications. Review the current Property Bouquet listings for available pricing where disclosed.`,

      factorsTitle:
        "What Influences Property Prices?",

      factors: [
        "Location and neighbourhood",
        "Project and developer",
        "Property type",
        "Configuration",
        "Unit size",
        "Amenities",
        "Construction and possession stage",
      ],
    },

    connectivity: {
      enabled: true,

      eyebrow:
        "CONNECTIVITY",

      title:
        `Connectivity ${preposition} ${locationName}`,

      description:
        `Evaluate the connectivity of ${locationName} with major roads, employment hubs, schools, healthcare facilities, retail destinations and other important areas.`,

      points: [
        {
          title:
            "Major Roads",

          description:
            `Evaluate access to major roads and surrounding transportation networks ${preposition} ${locationName}.`,
        },

        {
          title:
            "Employment Hubs",

          description:
            "Consider travel access to nearby commercial and employment destinations.",
        },

        {
          title:
            "Education",

          description:
            "Review accessibility to schools, colleges and educational institutions in the surrounding area.",
        },

        {
          title:
            "Healthcare & Retail",

          description:
            "Consider access to hospitals, healthcare facilities, shopping and everyday conveniences.",
        },
      ],
    },

    lifestyle: {
      enabled: true,

      title:
        `Everyday Convenience Around ${locationName}`,

      description:
        `Explore schools, healthcare, shopping, dining and everyday services around ${locationName}.`,

      sections: [
        {
          title:
            "Schools & Education",

          description:
            `Evaluate nearby schools and educational institutions around ${locationName}.`,
        },

        {
          title:
            "Healthcare",

          description:
            `Consider accessibility to hospitals, clinics and healthcare facilities around ${locationName}.`,
        },

        {
          title:
            "Shopping & Dining",

          description:
            `Explore retail, dining and everyday lifestyle destinations available around ${locationName}.`,
        },

        {
          title:
            "Everyday Convenience",

          description:
            `Consider the availability of essential services and neighbourhood conveniences while selecting a property.`,
        },
      ],
    },

    whyBuy: {
      enabled: true,

      title:
        `Why Consider Properties ${preposition} ${locationName}?`,

      description:
        `Consider location, connectivity, infrastructure, residential development and lifestyle factors when evaluating properties ${preposition} ${locationName}.`,

      reasons: [
        {
          title:
            "Strategic Location",

          description:
            "Evaluate the location's relationship with major residential, commercial and lifestyle destinations.",
        },

        {
          title:
            "Infrastructure",

          description:
            "Consider existing infrastructure and relevant development around the location.",
        },

        {
          title:
            "Residential Demand",

          description:
            "Review the surrounding residential ecosystem and current project availability.",
        },

        {
          title:
            "Developer Options",

          description:
            "Compare projects, developers, configurations and specifications available in the area.",
        },

        {
          title:
            "Lifestyle",

          description:
            "Consider nearby schools, healthcare, retail, dining and entertainment.",
        },

        {
          title:
            "Long-Term Suitability",

          description:
            "Evaluate the location against your own requirements, budget and long-term objectives.",
        },
      ],
    },

    nearby: {
      enabled: true,

      title:
        `Explore Locations Near ${locationName}`,

      description:
        `Compare nearby locations and residential opportunities around ${locationName}.`,
    },

    faq: {
      enabled: true,

      title:
        `FAQs About Properties ${preposition} ${locationName}`,

      items:
        DEFAULT_FAQS(
          locationName,
          preposition
        ),
    },

    advisor: {
      enabled: true,

      title:
        `Looking for the Right Property ${preposition} ${locationName}?`,

      description:
        `Speak with a Property Bouquet advisor about available properties, projects, configurations and site visits ${preposition} ${locationName}.`,
    },

    images: {
      hero: "",

      heroAlt:
        `Luxury properties ${preposition} ${locationName}`,

      introAlt:
        `Residential developments ${preposition} ${locationName}`,

      aboutAlt:
        `Residential properties ${preposition} ${locationName}`,

      connectivityAlt:
        `Connectivity around ${locationName}`,

      lifestyleAlt:
        `Lifestyle and residential community around ${locationName}`,

      advisorAlt:
        `Property Bouquet advisor discussing properties ${preposition} ${locationName}`,
    },
  };
}

export function getLocationContent(
  location,
  properties = []
) {
  const slug = cleanSlug(
    location?.slug
  );

  const base =
    CONTENT[slug];

  if (base) {
    return base;
  }

  return buildDefaultContent(
    location,
    properties
  );
}