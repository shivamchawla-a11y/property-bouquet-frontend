import PropertyPreview from "../admin/add-property/PropertyPreview";
import PropertiesClient from "@/app/properties/PropertiesClient";

import { notFound } from "next/navigation";
import { cache } from "react";

import { buildPropertySEO } from "@/lib/propertySeo";
import { buildPropertySchema } from "@/lib/propertySchema";

import { buildLandingPageSEO } from "@/lib/landingPageSeo";
import { buildLandingPageSchema } from "@/lib/landingPageSchema";

const API = "https://propertybouquet.com";

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

  // ------------------------------------------------------
  // Already canonical
  // ------------------------------------------------------

  if (
    cleanSlug.endsWith("-developer-projects") ||
    cleanSlug.endsWith("-developers-projects")
  ) {
    return cleanSlug;
  }

  // ------------------------------------------------------
  // Backend slug already ends with -developer
  // ------------------------------------------------------

  if (cleanSlug.endsWith("-developer")) {
    return `${cleanSlug}-projects`;
  }

  // ------------------------------------------------------
  // Backend slug already ends with -developers
  // ------------------------------------------------------

  if (cleanSlug.endsWith("-developers")) {
    return `${cleanSlug}-projects`;
  }

  // ------------------------------------------------------
  // Normal backend slug
  // ------------------------------------------------------

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

  // ------------------------------------------------------
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
  // ------------------------------------------------------

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

  return [
    ...new Set(
      candidates.filter(Boolean)
    ),
  ];
}

// ======================================================
// PROPERTY
// ======================================================
//
// IMPORTANT PERFORMANCE:
//
// React cache() allows generateMetadata() and Page()
// to reuse the same property request during the
// same server render.
//
// Previously:
//
// generateMetadata()
//      ↓
// fetch property
//
// Page()
//      ↓
// fetch property AGAIN
//
// Now the request can be shared.
// ======================================================

const getProperty = cache(async function getProperty(slug) {
  try {
    if (!slug) {
      return null;
    }

    const res = await fetch(
      `${API}/api/properties/slug/${encodeURIComponent(
        slug
      )}`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.data || null;
  } catch (err) {
    console.error(
      "Property fetch error:",
      err
    );

    return null;
  }
});

// ======================================================
// LANDING PAGE
// ======================================================
//
// Same caching optimization as property.
// ======================================================

const getLandingPage = cache(
  async function getLandingPage(slug) {
    try {
      if (!slug) {
        return null;
      }

      const res = await fetch(
        `${API}/api/landing-pages/slug/${encodeURIComponent(
          slug
        )}`,
        {
          next: {
            revalidate: 300,
          },
        }
      );

      if (!res.ok) {
        return null;
      }

      const data = await res.json();

      return data?.data || null;
    } catch (err) {
      console.error(
        "Landing page fetch error:",
        err
      );

      return null;
    }
  }
);

// ======================================================
// DEVELOPER DATA
// ======================================================
//
// PERFORMANCE:
//
// Developer candidates are requested IN PARALLEL
// instead of one-by-one.
//
// Old:
//
// candidate 1 → wait
// candidate 2 → wait
// candidate 3 → wait
// candidate 4 → wait
//
// New:
//
// candidate 1 ┐
// candidate 2 ├── all at the same time
// candidate 3 │
// candidate 4 ┘
//              ↓
//          first valid
// ======================================================

const getDeveloperData = cache(
  async function getDeveloperData(
    developerName,
    developerRef
  ) {
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
          possibleSlugs.push(
            developerRef.slug
          );
        }

        if (developerRef.name) {
          possibleSlugs.push(
            developerRef.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(
                /^-+|-+$/g,
                ""
              )
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
            .replace(
              /^-+|-+$/g,
              ""
            )
        );
      }

      const uniqueSlugs = [
        ...new Set(
          possibleSlugs.filter(Boolean)
        ),
      ];

      if (!uniqueSlugs.length) {
        return null;
      }

      // --------------------------------------------------
      // 2. BUILD ALL BACKEND CANDIDATES
      // --------------------------------------------------

      const allCandidates = [
        ...new Set(
          uniqueSlugs.flatMap(
            (possibleSlug) =>
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
        allCandidates.map(
          async (candidate) => {
            try {
              const res = await fetch(
                `${API}/api/developers/${encodeURIComponent(
                  candidate
                )}`,
                {
                  next: {
                    revalidate: 300,
                  },
                }
              );

              if (!res.ok) {
                return null;
              }

              const data =
                await res.json();

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
          }
        )
      );

      // --------------------------------------------------
      // 4. FIND FIRST VALID DEVELOPER
      // --------------------------------------------------

      const successfulResponse =
        responses.find(
          (item) =>
            item?.data?.developer
        );

      if (!successfulResponse) {
        console.error(
          "Developer could not be resolved:",
          uniqueSlugs
        );

        return null;
      }

      const developer =
        successfulResponse.data
          .developer;

      const properties =
        Array.isArray(
          successfulResponse.data
            ?.properties
        )
          ? successfulResponse.data
              .properties
          : [];

      const backendDeveloperSlug =
        developer?.slug ||
        successfulResponse.candidate ||
        "";

      // --------------------------------------------------
      // 5. BUILD CANONICAL PUBLIC SLUG
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
      // 6. RETURN DATA
      // --------------------------------------------------

      return {
        developer,
        properties,
        backendSlug:
          actualBackendSlug,
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
// METADATA
// ======================================================

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  // ------------------------------------------------------
  // PROPERTY + LANDING PAGE
  // ------------------------------------------------------
  //
  // Run both lookups concurrently.
  //
  // This is particularly useful when the requested slug
  // is a landing page rather than a property.
  // ------------------------------------------------------

  const [
    property,
    landingPage,
  ] = await Promise.all([
    getProperty(slug),
    getLandingPage(slug),
  ]);

  // ------------------------------------------------------
  // PROPERTY
  // ------------------------------------------------------

  if (property) {
    return buildPropertySEO(
      property,
      slug
    );
  }

  // ------------------------------------------------------
  // LANDING PAGE
  // ------------------------------------------------------

  if (landingPage) {
    return buildLandingPageSEO(
      landingPage,
      slug
    );
  }

  // ------------------------------------------------------
  // NOT FOUND
  // ------------------------------------------------------

  return {
    title:
      "Page Not Found | Property Bouquet",

    description:
      "The requested page could not be found.",
  };
}

// ======================================================
// PAGE
// ======================================================

export default async function Page({
  params,
}) {
  const { slug } = await params;

  // ------------------------------------------------------
  // PROPERTY + LANDING PAGE
  // ------------------------------------------------------
  //
  // Both requests run concurrently.
  //
  // Because getProperty() and getLandingPage() are
  // wrapped with React cache(), the request made by
  // generateMetadata() can be reused when applicable.
  // ------------------------------------------------------

  const [
    property,
    landingPage,
  ] = await Promise.all([
    getProperty(slug),
    getLandingPage(slug),
  ]);

  // ======================================================
  // PROPERTY PAGE
  // ======================================================

  if (property) {
    // --------------------------------------------------
    // FETCH DEVELOPER DATA SERVER-SIDE
    // --------------------------------------------------

    const developerData =
      await getDeveloperData(
        property?.coreDetails
          ?.developerName,

        property?.coreDetails
          ?.developerRef
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
            __html:
              JSON.stringify(
                schema
              ),
          }}
        />

        {/* ==================================================
            PROPERTY PAGE
        ================================================== */}

        <div className="bg-white">
          <PropertyPreview
            form={property}
            developerData={
              developerData
            }
          />
        </div>
      </>
    );
  }

  // ======================================================
  // LANDING PAGE
  // ======================================================

  if (landingPage) {
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
            __html:
              JSON.stringify(
                schema
              ),
          }}
        />

        {/* ==================================================
            LANDING PAGE
        ================================================== */}

        <div className="bg-white">
          <PropertiesClient
            landingPage={
              landingPage
            }
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