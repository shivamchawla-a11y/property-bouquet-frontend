import PropertyPreview from "../admin/add-property/PropertyPreview";

import PropertiesClient from "@/app/properties/PropertiesClient";

import { notFound } from "next/navigation";

import { cache } from "react";

import { buildPropertySEO } from "@/lib/propertySeo";

import { buildPropertySchema } from "@/lib/propertySchema";

import { buildLandingPageSEO } from "@/lib/landingPageSeo";

import { buildLandingPageSchema } from "@/lib/landingPageSchema";

// ======================================================
// API
// ======================================================

const API = "https://propertybouquet.com";

// ======================================================
// CACHE / ISR SETTINGS
// ======================================================

const REVALIDATE_SECONDS = 3600;

// ======================================================
// DEVELOPER PUBLIC SLUG
// ======================================================
//
// Examples:
//
// m3m
// → m3m-developer-projects
//
// signature-global
// → signature-global-developer-projects
//
// spiti-developer
// → spiti-developer-projects
//
// spiti-developers
// → spiti-developers-projects
//
// parsvnath-developers
// → parsvnath-developers-projects
//
// parsvnath-developers-projects
// → unchanged
// ======================================================

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

  // Already canonical
  if (
    cleanSlug.endsWith("-developer-projects") ||
    cleanSlug.endsWith("-developers-projects")
  ) {
    return cleanSlug;
  }

  // Backend slug already ends with -developer
  if (cleanSlug.endsWith("-developer")) {
    return `${cleanSlug}-projects`;
  }

  // Backend slug already ends with -developers
  if (cleanSlug.endsWith("-developers")) {
    return `${cleanSlug}-projects`;
  }

  // Normal backend slug
  return `${cleanSlug}-developer-projects`;
}

// ======================================================
// BACKEND DEVELOPER SLUG CANDIDATES
// ======================================================

function getBackendDeveloperSlugCandidates(developerSlug) {
  if (!developerSlug) {
    return [];
  }

  const cleanSlug = String(developerSlug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return [];
  }

  // Normalize canonical public developer URLs back
  // to their possible backend forms.
  //
  // Example:
  //
  // parsvnath-developers-projects
  //
  // can resolve to:
  //
  // parsvnath
  // parsvnath-developer
  // parsvnath-developers

  const baseSlug = cleanSlug.replace(
    /-(?:developer|developers)-projects$/,
    ""
  );

  const candidates = [
    cleanSlug,
    baseSlug,
    `${baseSlug}-developer`,
    `${baseSlug}-developers`,
  ];

  return [...new Set(candidates.filter(Boolean))];
}

// ======================================================
// PROPERTY
// ======================================================

const getProperty = cache(async function getProperty(slug) {
  try {
    if (!slug) {
      return null;
    }

    const res = await fetch(
      `${API}/api/properties/slug/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.data || null;
  } catch (err) {
    console.error("Property fetch error:", err);
    return null;
  }
});

// ======================================================
// LANDING PAGE
// ======================================================
//
// IMPORTANT:
//
// This function is now only called when the property
// lookup fails.
//
// Therefore property URLs no longer make an unnecessary
// /api/landing-pages request.
// ======================================================

const getLandingPage = cache(async function getLandingPage(slug) {
  try {
    if (!slug) {
      return null;
    }

    const res = await fetch(
      `${API}/api/landing-pages/slug/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.data || null;
  } catch (err) {
    console.error("Landing page fetch error:", err);
    return null;
  }
});

// ======================================================
// DEVELOPER DATA
// ======================================================

const getDeveloperData = cache(
  async function getDeveloperData(developerName, developerRef) {
    try {
      // --------------------------------------------------
      // 1. COLLECT POSSIBLE DEVELOPER SLUGS
      // --------------------------------------------------

      const possibleSlugs = [];

      // --------------------------------------------------
      // POPULATED DEVELOPER REF
      // --------------------------------------------------

      if (
        developerRef &&
        typeof developerRef === "object"
      ) {
        if (developerRef.slug) {
          possibleSlugs.push(developerRef.slug);
        }

        if (developerRef.name) {
          possibleSlugs.push(
            developerRef.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
          );
        }
      }

      // --------------------------------------------------
      // DEVELOPER NAME FALLBACK
      // --------------------------------------------------

      if (developerName) {
        possibleSlugs.push(
          String(developerName)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
        );
      }

      const uniqueSlugs = [
        ...new Set(possibleSlugs.filter(Boolean)),
      ];

      if (!uniqueSlugs.length) {
        return null;
      }

      // --------------------------------------------------
      // 2. BUILD ALL BACKEND CANDIDATES
      // --------------------------------------------------

      const allCandidates = [
        ...new Set(
          uniqueSlugs.flatMap((possibleSlug) =>
            getBackendDeveloperSlugCandidates(
              possibleSlug
            )
          )
        ),
      ];

      if (!allCandidates.length) {
        return null;
      }

      // --------------------------------------------------
      // 3. FETCH ALL CANDIDATES IN PARALLEL
      // --------------------------------------------------

      const responses = await Promise.all(
        allCandidates.map(async (candidate) => {
          try {
            const res = await fetch(
              `${API}/api/developers/${encodeURIComponent(
                candidate
              )}`,
              {
                next: {
                  revalidate: REVALIDATE_SECONDS,
                },
              }
            );

            if (!res.ok) {
              return null;
            }

            const data = await res.json();

            if (!data?.developer) {
              return null;
            }

            return {
              candidate,
              data,
            };
          } catch (error) {
            console.error(
              "Developer candidate fetch error:",
              candidate,
              error
            );

            return null;
          }
        })
      );

      // --------------------------------------------------
      // 4. FIND FIRST VALID DEVELOPER
      // --------------------------------------------------

      const successfulResponse = responses.find(
        (item) => item?.data?.developer
      );

      if (!successfulResponse) {
        console.error(
          "Developer could not be resolved:",
          uniqueSlugs
        );

        return null;
      }

      const developer =
        successfulResponse.data.developer;

      const properties = Array.isArray(
        successfulResponse.data?.properties
      )
        ? successfulResponse.data.properties
        : [];

      // --------------------------------------------------
      // 5. BUILD BACKEND DEVELOPER SLUG
      // --------------------------------------------------

      const backendDeveloperSlug =
        developer?.slug ||
        successfulResponse.candidate ||
        "";

      // --------------------------------------------------
      // 6. BUILD PUBLIC DEVELOPER SLUG
      // --------------------------------------------------

      const actualBackendSlug =
        developer?.slug ||
        developer?.backendSlug ||
        backendDeveloperSlug ||
        "";

      const publicSlug =
        buildPublicDeveloperSlug(
          actualBackendSlug
        );

      // --------------------------------------------------
      // 7. RETURN
      // --------------------------------------------------

      return {
        developer,
        properties,
        backendSlug: actualBackendSlug,
        publicSlug,
      };
    } catch (err) {
      console.error(
        "Developer data fetch error:",
        err
      );

      return null;
    }
  }
);

// ======================================================
// RESOLVE PAGE DATA
// ======================================================
//
// IMPORTANT PERFORMANCE CHANGE:
//
// We DO NOT fetch property + landing page in parallel.
//
// The slug belongs to one page type.
//
// We first check property.
//
// Only when no property exists do we check landing page.
//
// This removes the unnecessary landing-page request from
// normal property pages and addresses the PageSpeed 401
// request reported for /api/landing-pages.
// ======================================================

const getPageData = cache(async function getPageData(slug) {
  const property = await getProperty(slug);

  if (property) {
    return {
      type: "property",
      property,
      landingPage: null,
    };
  }

  const landingPage = await getLandingPage(slug);

  if (landingPage) {
    return {
      type: "landing",
      property: null,
      landingPage,
    };
  }

  return {
    type: "not-found",
    property: null,
    landingPage: null,
  };
});

// ======================================================
// METADATA
// ======================================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const pageData = await getPageData(slug);

  // ------------------------------------------------------
  // PROPERTY
  // ------------------------------------------------------

  if (pageData.type === "property") {
    return buildPropertySEO(
      pageData.property,
      slug
    );
  }

  // ------------------------------------------------------
  // LANDING PAGE
  // ------------------------------------------------------

  if (pageData.type === "landing") {
    return buildLandingPageSEO(
      pageData.landingPage,
      slug
    );
  }

  // ------------------------------------------------------
  // NOT FOUND
  // ------------------------------------------------------

  return {
    title: "Page Not Found | Property Bouquet",
    description:
      "The requested page could not be found.",
  };
}

// ======================================================
// PAGE
// ======================================================

export default async function Page({ params }) {
  const { slug } = await params;

  const pageData = await getPageData(slug);

  // ======================================================
  // PROPERTY PAGE
  // ======================================================

  if (pageData.type === "property") {
    const property = pageData.property;

    // --------------------------------------------------
    // FETCH DEVELOPER DATA SERVER-SIDE
    // --------------------------------------------------

    const developerData =
      await getDeveloperData(
        property?.coreDetails?.developerName,
        property?.coreDetails?.developerRef
      );

    // --------------------------------------------------
    // BUILD PROPERTY SCHEMA
    // --------------------------------------------------

    const schema =
      buildPropertySchema(
        property,
        slug
      );

    return (
      <>
        {/* ==================================================
            PROPERTY JSON-LD
        ================================================== */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        {/* ==================================================
            PROPERTY PAGE
        ================================================== */}

        <div className="bg-white">
          <PropertyPreview
            form={property}
            developerData={developerData}
          />
        </div>
      </>
    );
  }

  // ======================================================
  // LANDING PAGE
  // ======================================================

  if (pageData.type === "landing") {
    const landingPage = pageData.landingPage;

    // --------------------------------------------------
    // BUILD LANDING PAGE SCHEMA
    // --------------------------------------------------

    const schema =
      buildLandingPageSchema(
        landingPage
      );

    return (
      <>
        {/* ==================================================
            LANDING PAGE JSON-LD
        ================================================== */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />

        {/* ==================================================
            LANDING PAGE
        ================================================== */}

        <div className="bg-white">
          <PropertiesClient
            landingPage={landingPage}
          />
        </div>
      </>
    );
  }

  // ======================================================
  // NOT FOUND
  // ======================================================

  notFound();
}