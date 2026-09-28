const DEFAULT_FAQS = (
  locationName,
  preposition = "in"
) => [
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


/* ============================================================
   DWARKA EXPRESSWAY — FINAL EDITORIAL CONTENT
   Source:
   Dwarka Expressway Location Page Final Version
   ============================================================ */

const CONTENT = {
  "dwarka-expressway": {
    preposition: "on",

    /* ========================================================
       SEO
       ======================================================== */

    seo: {
      title:
        "Properties on Dwarka Expressway, Gurugram | Property Bouquet",

      description:
        "Explore luxury flats and builder floors on Dwarka Expressway, Gurugram from ₹1.43 Cr. Compare sector-wise prices and projects by Adani, Emaar, BPTP & M3M.",

      focusKeyword:
        "properties on Dwarka Expressway",

      relatedKeywords: [
        "flats on Dwarka Expressway",
        "luxury apartments on Dwarka Expressway",
        "builder floors on Dwarka Expressway",
        "Dwarka Expressway property prices",
        "new launch projects on Dwarka Expressway",
        "ready to move flats Dwarka Expressway",
        "Dwarka Expressway sectors",
        "Dwarka Expressway metro",
        "properties in Dwarka Expressway",
      ],
    },

    /* ========================================================
       HERO
       ======================================================== */

    hero: {
      enabled: true,

      eyebrow:
        "A PREMIUM GROWTH CORRIDOR",

      badge:
        "Prime Location",

      title:
        "Luxury Properties on Dwarka Expressway",

      description:
        "Explore luxury flats, builder floors and new launch projects on Dwarka Expressway, Gurugram's airport corridor. Every project is reviewed by advisors who know each sector first-hand.",

      badges: [
        "2 to 4 BHK",
      ],

      primaryButton:
        "Explore Properties",

      secondaryButton:
        "Contact Advisor",
    },

    /* ========================================================
       INTRO / ABOUT
       ======================================================== */

    about: {
      enabled: true,

      eyebrow:
        "WHY DWARKA EXPRESSWAY",

      title:
        "Dwarka Expressway (NH-248BB), Gurugram",

      description:
        "Dwarka Expressway (NH-248BB) is an eight-lane, signal-free expressway that connects Shiv Murti in Delhi to Kherki Daula on NH-48 in Gurugram. Fully open since August 2025, it has turned the new sectors of Gurgaon into one of the NCR's most in-demand residential corridors.",

      secondaryDescription:
        "It took a long time to get here. The road was first planned in the mid-2000s as the Northern Peripheral Road and was taken over by NHAI in 2016. Many buyers in Sectors 102, 106 and 113 waited years for a highway that kept getting delayed.",

      tertiaryDescription:
        "That wait is now over. The Haryana stretch, about 18.9 km, opened in March 2024. The Delhi stretch, with its tunnel link towards IGI Airport, followed in August 2025. An elevated carriageway carries through traffic, while service roads below handle local movement.",

      marketDescription:
        "The market has changed with the road. Early projects were mostly mid-segment. Today, properties in Dwarka Expressway include branded luxury apartments, spacious builder floors and gated townships from Adani Realty, Emaar, BPTP, M3M and Central Park.",

      highlights: [
        "Signal-free drive to IGI Airport and Delhi",
        "Luxury projects by Adani, Emaar, BPTP and M3M",
        "Flats, builder floors and township homes",
        "Sector-level advice from the Property Bouquet advisory team",
      ],

      snapshot: {
        location:
          "Dwarka Expressway (NH-248BB), Gurugram",

        propertyTypes:
          "Apartments, Builder Floors, Independent Floors",

        segment:
          "Premium & Luxury",

        priceRange:
          "₹1.43 Cr – ₹10.40 Cr",
      },

      snapshotLabel:
        "Location Snapshot",
    },

    /* ========================================================
       REAL ESTATE MARKET
       ======================================================== */

    realEstateMarket: {
      enabled: true,

      eyebrow:
        "REAL ESTATE MARKET",

      title:
        "Dwarka Expressway: A Thriving Real Estate Destination",

      description:
        "Dwarka Expressway isn't one market. It's four stretches, each with its own prices, property types and commutes. Choosing the right sector matters as much as choosing the right project.",

      stretches: [
        {
          title:
            "Sectors 108 to 113 — Delhi End",

          description:
            "Closest to Dwarka, the Delhi border and the airport. This stretch can be relevant for buyers who fly often or work in Delhi.",

          projects: [
            "M3M Capital — Sector 113",
          ],
        },

        {
          title:
            "Sectors 99 to 106 — Heart of the Corridor",

          description:
            "This stretch includes several recent luxury launches and established residential developments across the central part of the corridor.",

          projects: [
            "Adani The Marq — Sector 102",
            "BPTP Gaia Residences — Sector 102",
            "Emaar Imperial Gardens — Sector 102",
            "Central Park Delphine — Sector 104",
            "Spiti Floors — Sector 99A",
          ],
        },

        {
          title:
            "Sectors 36A to 37D — NH-48 End",

          description:
            "Larger townships in this stretch provide access towards Manesar and the Delhi–Jaipur highway.",

          projects: [
            "Signature Global City 37D",
            "BPTP Terra",
          ],
        },

        {
          title:
            "Sectors 81 to 95 — New Gurgaon",

          description:
            "These sectors sit just inside the wider corridor and are often marketed alongside Dwarka Expressway, generally with lower entry prices than some of the premium central stretches.",

          projects: [],
        },
      ],

      highlights: [
        {
          title:
            "Growing Demand",

          description:
            "End-users are moving in, not just investors holding homes.",
        },

        {
          title:
            "Premium Developments",

          description:
            "A new wave of branded towers and low-rise builder floors is expanding the residential mix.",
        },

        {
          title:
            "Connectivity Advantage",

          description:
            "An eight-lane elevated road provides a major connection towards Delhi and the airport.",
        },
      ],

      perspective:
        "With the expressway finally complete, this corridor has moved from a promise to a place people actually live.",
    },

    /* ========================================================
       REAL ESTATE TYPES
       ======================================================== */

    realEstateTypes: {
      enabled: true,

      title:
        "Properties on Dwarka Expressway for Every Lifestyle",

      description:
        "Dwarka Expressway offers more property formats than many Gurugram corridors. You can choose between full-amenity high-rises, quieter low-rise floors and homes inside planned townships.",

      types: [
        {
          title:
            "Independent Floor",

          description:
            "Independent floors inside planned townships, mainly around Sector 37D, give you a home of your own within a gated community. They are a middle path between a flat and a standalone house, and they often offer lower entry prices on the corridor.",
        },

        {
          title:
            "Builder Floors",

          description:
            "Builder floors on Dwarka Expressway offer fewer neighbours, more privacy and a more independent feel. This format is harder to find on Golf Course Road at similar budgets. Spiti Floors in Sector 99A is one example of low-rise luxury floors in the corridor.",
        },

        {
          title:
            "Apartments",

          description:
            "Most flats on Dwarka Expressway are in high-rise gated communities with clubhouses, 24x7 security and full amenities. Luxury apartments range from 3 BHK homes to large 4 BHK residences, with ultra-luxury options such as Central Park Delphine at the top end.",
        },

        {
          title:
            "Plots",

          description:
            "Residential plots along the corridor are limited and usually part of larger licensed townships. Buyers should ask an advisor about current plot availability and verify the relevant township's DTCP licence status before committing.",
        },
      ],
    },

    /* ========================================================
       PRICES
       ======================================================== */

    prices: {
      enabled: true,

      title:
        "Property Prices on Dwarka Expressway",

      description:
        "Property prices on Dwarka Expressway start from about ₹1.43 Cr for independent floors and go above ₹10 Cr for ultra-luxury apartments, based on projects listed on Property Bouquet. Prices depend on where a project sits on the corridor, its format and its construction stage.",

      lastUpdated:
        "auto",

      priceRange: {
        minimum:
          14300000,

        maximum:
          104000000,
      },

      projects: [
        {
          project:
            "Signature Global City 37D",

          sector:
            "37D",

          type:
            "Independent Floors",

          configuration:
            "2 & 3 BHK",

          startingPrice:
            "₹1.43 Cr",

          status:
            "",
        },

        {
          project:
            "DLF New Town Heights 1",

          sector:
            "",

          type:
            "Apartments",

          configuration:
            "2, 3 & 4 BHK",

          startingPrice:
            "₹1.63 Cr",

          status:
            "",
        },

        {
          project:
            "Spiti Floors",

          sector:
            "99A",

          type:
            "Builder Floors",

          configuration:
            "3 BHK",

          startingPrice:
            "₹1.95 Cr",

          status:
            "",
        },

        {
          project:
            "Emaar Imperial Gardens",

          sector:
            "102",

          type:
            "Apartments",

          configuration:
            "3 BHK, 3 BHK + Utility",

          startingPrice:
            "₹2.39 Cr",

          status:
            "",
        },

        {
          project:
            "BPTP Terra",

          sector:
            "37D",

          type:
            "Apartments",

          configuration:
            "",

          startingPrice:
            "₹2.75 Cr",

          status:
            "",
        },

        {
          project:
            "M3M Capital",

          sector:
            "113",

          type:
            "Apartments",

          configuration:
            "",

          startingPrice:
            "₹2.83 Cr",

          status:
            "",
        },

        {
          project:
            "BPTP Gaia Residences",

          sector:
            "102",

          type:
            "Apartments",

          configuration:
            "3, 3.5 & 4 BHK",

          startingPrice:
            "₹3.85 Cr",

          status:
            "",
        },

        {
          project:
            "Adani The Marq",

          sector:
            "102",

          type:
            "Apartments",

          configuration:
            "3 & 4 BHK",

          startingPrice:
            "₹4.14 Cr",

          status:
            "",
        },

        {
          project:
            "Central Park Delphine",

          sector:
            "104",

          type:
            "Apartments",

          configuration:
            "",

          startingPrice:
            "₹10.40 Cr",

          status:
            "",
        },
      ],

      factorsTitle:
        "What Influences Property Prices?",

      factors: [
        "Position on the corridor — homes near the Delhi end usually cost more",
        "Expressway frontage versus quieter interior sectors",
        "Developer reputation and delivery track record",
        "Configuration and carpet area",
        "Floor, view and facing",
        "Construction stage — new launch versus ready to move",
        "Payment plan and applicable charges",
        "Readiness of sector roads, water and sewerage",
      ],

      priceNote:
        "Need current pricing? Rates change with inventory, construction stage and applicable charges. Our advisors can share the latest price for any project, including new launch offers.",
    },

    /* ========================================================
       CONNECTIVITY
       ======================================================== */

    connectivity: {
      enabled: true,

      eyebrow:
        "CONNECTIVITY & KEY DESTINATIONS",

      title:
        "Seamless Connectivity from Dwarka Expressway",

      description:
        "Dwarka Expressway gives you a signal-free drive to IGI Airport and Delhi. It meets NH-48 at both ends and links to central Gurugram through the Southern and Central Peripheral Roads.",

      points: [
        {
          title:
            "Major Airport",

          description:
            "Direct, signal-free route to IGI Airport through the Delhi stretch's tunnel link.",
        },

        {
          title:
            "Metro & Rail",

          description:
            "There is no metro on the expressway yet. The nearest stations are Dwarka Sector 21 and Yashobhoomi (Dwarka Sector 25). A Palam Vihar–Dwarka Sector 21 metro spur via Sectors 110A and 111 has state approval.",
        },

        {
          title:
            "Key Road Network",

          description:
            "NH-48 at both ends, SPR and CPR to central Gurugram, and UER-II to north and west Delhi provide wider road connectivity.",
        },

        {
          title:
            "Business Districts",

          description:
            "Aerocity and Dwarka in Delhi, along with Cyber City, Udyog Vihar and IMT Manesar in Gurugram, are important employment and commercial destinations.",
        },

        {
          title:
            "Golf & Leisure",

          description:
            "Golf clubs on Golf Course Road are reachable via SPR, while Aerocity's dining and events are close to the Delhi end.",
        },

        {
          title:
            "Retail & Hospitality",

          description:
            "Yashobhoomi, India's international convention centre, is at the Delhi end, with Aerocity's hotels and hospitality destinations nearby.",
        },
      ],

      slogan:
        "A well-connected address for a brighter tomorrow.",
    },

    /* ========================================================
       LIFESTYLE
       ======================================================== */

    lifestyle: {
      enabled: true,

      title:
        "Everyday Convenience Around Dwarka Expressway",

      description:
        "Social infrastructure around properties on Dwarka Expressway is still catching up with housing, but it is growing fast. Many sectors now have schools, clinics and daily-needs shops nearby. Larger hospitals and malls are a short drive away in Dwarka or central Gurugram.",

      tip:
        "When you visit a project, spend 20 minutes driving around the sector. It tells you more about daily life than any brochure.",

      sections: [
        {
          title:
            "Top Schools & Universities",

          description:
            "Schools are opening steadily across the corridor, with established options in nearby Dwarka.",

          items: [
            "Delhi Public School, Dwarka",
            "Venkateshwar International School, Dwarka",
          ],
        },

        {
          title:
            "Leading Healthcare",

          description:
            "Clinics and mid-sized hospitals serve the sectors, with multi-speciality hospitals a short drive away.",

          items: [
            "Manipal Hospital, Dwarka",
            "Venkateshwar Hospital, Dwarka",
            "Medanta – The Medicity, Sector 38, Gurugram",
          ],
        },

        {
          title:
            "Shopping & Entertainment",

          description:
            "Daily-needs retail is growing inside the sectors, with larger malls a short drive away.",

          items: [
            "Vegas Mall, Dwarka",
            "Ambience Mall, NH-48, Gurugram",
            "Aerocity dining and hospitality district",
          ],
        },
      ],

      slogan:
        "Everything you need, closer home.",
    },

    /* ========================================================
       WHY BUY
       ======================================================== */

    whyBuy: {
      enabled: true,

      title:
        "Why Buy Properties on Dwarka Expressway?",

      description:
        "Buying property on Dwarka Expressway makes the most sense if you fly often, work in Delhi, or want a newer and larger home than older Gurugram offers at the same budget.",

      reasons: [
        {
          title:
            "Strategic Location",

          description:
            "Between Delhi, IGI Airport and Gurugram, with one signal-free road connecting all three.",
        },

        {
          title:
            "Infrastructure Growth",

          description:
            "The expressway is complete. Metro links, sector roads and social infrastructure are the next layer being built.",
        },

        {
          title:
            "Residential Demand",

          description:
            "End-users are moving in, not just investors holding homes. This reflects the corridor's development as a residential neighbourhood.",
        },

        {
          title:
            "Reputed Developers",

          description:
            "Adani Realty, Emaar, BPTP, M3M, Central Park, DLF and Signature Global all have projects in the wider corridor.",
        },

        {
          title:
            "Lifestyle Ecosystem",

          description:
            "Newer homes, larger layouts and full-amenity gated communities are developing alongside schools and retail.",
        },

        {
          title:
            "Long-Term Potential",

          description:
            "Much of the connectivity story is already in place. Future development depends on social infrastructure, metro approvals and new supply. Property Bouquet does not project returns and instead helps buyers evaluate individual projects.",
        },
      ],
    },

    /* ========================================================
       NEARBY LOCATIONS
       ======================================================== */

    nearby: {
      enabled: true,

      title:
        "Explore Locations Near Dwarka Expressway",

      description:
        "Compare Dwarka Expressway with Gurugram's other luxury corridors to see how prices, property types and commutes differ.",

      locations: [
        {
          name:
            "New Gurgaon",

          slug:
            "properties-in-new-gurgaon",
        },

        {
          name:
            "Golf Course Extension Road",

          slug:
            "properties-on-golf-course-extension-road",
        },

        {
          name:
            "Sohna Road",

          slug:
            "properties-on-sohna-road",
        },

        {
          name:
            "Golf Course Road",

          slug:
            "properties-on-golf-course-road",
        },
      ],
    },

    /* ========================================================
       FAQ
       ======================================================== */

    faq: {
      enabled: true,

      title:
        "FAQs About Properties on Dwarka Expressway",

      intro:
        "Straight answers to what buyers ask us most. For project-specific pricing and availability, speak with a Property Bouquet advisor.",

      items: [
        {
          question:
            "What types of properties are available on Dwarka Expressway?",

          answer:
            "Properties on Dwarka Expressway include luxury flats in high-rise gated communities, low-rise builder floors and independent floors inside planned townships. Configurations range from 2 BHK to 4 BHK, with a few ultra-luxury residences at the top end. Residential plots are limited and usually part of licensed townships.",
        },

        {
          question:
            "What is the property price range on Dwarka Expressway?",

          answer:
            "Starting prices on Property Bouquet range from about ₹1.43 Cr to ₹10.40 Cr, depending on the project, sector and format. Independent floors and builder floors start under ₹2 Cr, while branded luxury apartments in Sectors 102 to 104 start higher. Confirm live rates with an advisor.",
        },

        {
          question:
            "What should I consider before buying a property on Dwarka Expressway?",

          answer:
            "Check the project's HRERA registration, committed possession date and the developer's DTCP licence. Then confirm that sector roads, water and sewerage are complete, how far the tower is from the elevated road, and your real peak-hour commute. Visiting the sector once before deciding helps.",
        },

        {
          question:
            "Is Dwarka Expressway suitable for end-use homebuyers?",

          answer:
            "Yes, especially if you want quick access to Delhi and IGI Airport, a newer home and a larger layout. Schools and daily-needs shops are more developed in some sectors than others, so check the specific sector before you choose a project.",
        },

        {
          question:
            "Is Dwarka Expressway suitable for property investment?",

          answer:
            "The expressway is complete, so much of the connectivity benefit is already reflected in prices. Future growth depends on social infrastructure, metro approvals and new supply. We don't project returns. Speak to an advisor about specific projects and your holding timeline.",
        },

        {
          question:
            "How can I find the right property on Dwarka Expressway?",

          answer:
            "Start with three things: your budget, preferred sector and possession timeline. Share them with a Property Bouquet advisor, and we'll shortlist projects that fit and arrange site visits so you can compare them in person before deciding.",
        },

        {
          question:
            "How many properties are currently listed on Dwarka Expressway?",

          answer:
            "Property Bouquet lists projects on Dwarka Expressway from leading developers, covering independent floors, builder floors and apartments. New projects are added only after our advisory team reviews them.",
        },

        {
          question:
            "Can Property Bouquet help me compare properties on Dwarka Expressway?",

          answer:
            "Yes. We compare projects on price, layout, developer track record, sector infrastructure and possession timeline, then help you narrow down to a focused shortlist. You can also schedule a site visit for any project.",
        },
      ],
    },

    /* ========================================================
       ADVISOR CTA
       ======================================================== */

    advisor: {
      enabled: true,

      title:
        "Looking for the Right Property on Dwarka Expressway?",

      description:
        "Tell us your budget, preferred sector, size and move-in timeline. A Property Bouquet advisor who works with properties on Dwarka Expressway every day will send you a shortlist that fits, not a list of everything available.",

      primaryButton:
        "Talk to an Expert",

      secondaryButton:
        "Schedule a Site Visit",
    },

    /* ========================================================
       IMAGES / ALT TEXT
       ======================================================== */

    images: {
      hero: "",

      heroAlt:
        "Luxury properties on Dwarka Expressway, Gurugram",

      introAlt:
        "Elevated Dwarka Expressway with residential towers in New Gurgaon",

      aboutAlt:
        "Residential sectors along Dwarka Expressway, Gurugram",

      connectivityAlt:
        "Dwarka Expressway elevated carriageway towards IGI Airport",

      lifestyleAlt:
        "Gated residential community on Dwarka Expressway",

      advisorAlt:
        "Property Bouquet advisor discussing projects on Dwarka Expressway",
    },

    /* ========================================================
       INTERNAL LINKS
       ======================================================== */

    internalLinks: {
      developers: [
        {
          label:
            "Adani Realty",
          href:
            "/developers/adani-realty",
        },
        {
          label:
            "Emaar",
          href:
            "/developers/emaar",
        },
        {
          label:
            "BPTP",
          href:
            "/developers/bptp",
        },
        {
          label:
            "M3M",
          href:
            "/developers/m3m",
        },
        {
          label:
            "Central Park",
          href:
            "/developers/central-park",
        },
      ],

      projects: [
        {
          label:
            "M3M Capital",
          href:
            "/projects/m3m-capital",
        },
        {
          label:
            "Adani The Marq",
          href:
            "/projects/adani-the-marq",
        },
        {
          label:
            "BPTP Gaia Residences",
          href:
            "/projects/bptp-gaia-residences",
        },
        {
          label:
            "Emaar Imperial Gardens",
          href:
            "/projects/emaar-imperial-gardens",
        },
        {
          label:
            "Central Park Delphine",
          href:
            "/projects/central-park-delphine",
        },
        {
          label:
            "Spiti Floors",
          href:
            "/projects/spiti-floors",
        },
        {
          label:
            "Signature Global City 37D",
          href:
            "/projects/signature-global-city-37d",
        },
        {
          label:
            "BPTP Terra",
          href:
            "/projects/bptp-terra",
        },
      ],

      contact: "/contact",
    },
  },
};


/* ============================================================
   HELPERS
   ============================================================ */

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

function getPreposition(
  locationName,
  slug
) {
  const value =
    `${locationName || ""} ${slug || ""}`.toLowerCase();

  return /expressway|road|highway|street|avenue|boulevard|drive|marg/i.test(
    value
  )
    ? "on"
    : "in";
}

function getProjectCount(
  properties = []
) {
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
    getProjectCount(
      properties
    );

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
      enabled: true,

      eyebrow:
        "PRIME RESIDENTIAL LOCATION",

      badge:
        "Prime Location",

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
        locationName,

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

    realEstateMarket: {
      enabled: false,

      eyebrow:
        "REAL ESTATE MARKET",

      title:
        `Real Estate Market ${preposition} ${locationName}`,

      description:
        `Explore the residential market ${preposition} ${locationName} by sector, project type, connectivity and current property availability.`,

      stretches: [],

      highlights: [],
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

      projects: [],

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

      priceNote:
        "Rates can change with inventory, construction stage and applicable charges. Confirm current pricing with the Property Bouquet advisory team.",
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

      locations: [],
    },

    faq: {
      enabled: true,

      title:
        `FAQs About Properties ${preposition} ${locationName}`,

      intro:
        "Straight answers to common property questions. For project-specific pricing and availability, speak with a Property Bouquet advisor.",

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

      primaryButton:
        "Talk to an Expert",

      secondaryButton:
        "Schedule a Site Visit",
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

    internalLinks: {
      developers: [],

      projects: [],

      contact:
        "/contact",
    },
  };
}


/* ============================================================
   PUBLIC API
   ============================================================ */

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