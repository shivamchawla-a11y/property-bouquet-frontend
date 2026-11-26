
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

import "@/app/knowledge/article.css";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import ArticleHero from "./components/ArticleHero";
import ArticleContent, {
  ArticleNavigation,
} from "./components/ArticleContent";

import ArticleSidebar from "./components/ArticleSidebar";
import RelatedArticles from "./components/RelatedArticles";

// ============================================================
// CONFIGURATION
// ============================================================

const API = "https://propertybouquet.com/api";
const SITE_URL = "https://propertybouquet.com";

const REVALIDATE_SECONDS = 300;

// ============================================================
// CLEAN SLUG
// ============================================================

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

// ============================================================
// SAFE TEXT
// ============================================================

function safeText(value) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

// ============================================================
// SAFE DATE
// ============================================================

function getSafeIsoDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

// ============================================================
// STRIP HTML FOR METADATA
// ============================================================

function stripHtml(value) {
  if (!value) return "";

  return sanitizeHtml(String(value), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// TRUNCATE DESCRIPTION
// ============================================================

function truncateDescription(value, limit = 160) {
  const text = stripHtml(value);

  if (text.length <= limit) {
    return text;
  }

  const shortened = text.slice(0, limit - 3);
  const lastSpace = shortened.lastIndexOf(" ");

  return (
    shortened.slice(0, lastSpace > 0 ? lastSpace : undefined)
      .trim() + "..."
  );
}

// ============================================================
// ARTICLE DESCRIPTION
// ============================================================

function getArticleDescription(article) {
  const candidates = [
    article?.seoEngine?.metaDescription,
    article?.metaDescription,
    article?.description,
    article?.shortDescription,
    article?.excerpt,
    article?.summary,
  ];

  for (const candidate of candidates) {
    const cleaned = truncateDescription(candidate);

    if (cleaned.length >= 50) {
      return cleaned;
    }
  }

  // Use body content only as a last resort.

  const bodyDescription = truncateDescription(
    article?.content || article?.body
  );

  if (bodyDescription.length >= 50) {
    return bodyDescription;
  }

  return (
    "Read expert real estate buying guides, " +
    "investment insights and property knowledge " +
    "from Property Bouquet."
  );
}

// ============================================================
// ARTICLE TITLE
// ============================================================

function getArticleTitle(article) {
  const candidates = [
    article?.seoEngine?.metaTitle,
    article?.metaTitle,
    article?.seoTitle,
    article?.title,
    article?.name,
  ];

  for (const candidate of candidates) {
    const cleaned = stripHtml(candidate);

    if (cleaned) {
      return cleaned;
    }
  }

  return "Property Knowledge & Real Estate Guides | Property Bouquet";
}

// ============================================================
// SAFE IMAGE OBJECT
// Supports string and object image formats.
// ============================================================

function normalizeImage(image, fallbackAlt = "") {
  let value = "";
  let alt = fallbackAlt;
  let width = null;
  let height = null;

  if (typeof image === "string") {
    value = image.trim();
  } else if (image && typeof image === "object") {
    value =
      safeText(image.url) ||
      safeText(image.src);

    alt = safeText(image.alt) || fallbackAlt;

    width = Number(image.width) || null;
    height = Number(image.height) || null;
  }

  if (!value || value.startsWith("//")) {
    return null;
  }

  try {
    const parsed = new URL(value, SITE_URL);

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return null;
    }

    return {
      url: parsed.toString(),
      alt,
      width:
        width && width > 0 ? width : null,
      height:
        height && height > 0 ? height : null,
    };
  } catch {
    return null;
  }
}

// ============================================================
// ARTICLE IMAGE
// ============================================================

function getArticleImage(article) {
  const candidates = [
    article?.seoEngine?.ogImage,
    article?.seoEngine?.socialImage,
    article?.ogImage,
    article?.featuredImage,
    article?.coverImage,
    article?.image,
    article?.heroImage,
  ];

  for (const candidate of candidates) {
    const image = normalizeImage(
      candidate,
      article?.featuredImageAlt ||
        getArticleTitle(article)
    );

    if (image) {
      return image;
    }
  }

  return null;
}

// ============================================================
// ARTICLE KEYWORDS
// ============================================================

function getArticleKeywords(article) {
  const values = [
    article?.seoEngine?.keywords,
    article?.keywords,
    article?.tags,
  ];

  for (const value of values) {
    if (Array.isArray(value)) {
      const cleaned = value
        .map((item) =>
          typeof item === "object"
            ? item.name || item.label
            : item
        )
        .map((item) => String(item || "").trim())
        .filter(Boolean);

      if (cleaned.length) {
        return cleaned;
      }
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return undefined;
}

// ============================================================
// PUBLICATION DATE
// ============================================================

function getPublishedDate(article) {
  return getSafeIsoDate(
    article?.publishedAt ||
    article?.publishDate ||
    article?.createdAt
  );
}

// ============================================================
// INDEXABILITY
// ============================================================

function isArticleIndexable(article) {
  if (!article) return false;

  if (article.isDeleted === true) return false;

  if (article.isActive === false) return false;

  if (
    article.status !== undefined &&
    article.status !== null &&
    String(article.status).toLowerCase() !== "published"
  ) {
    return false;
  }

  return true;
}

// ============================================================
// ARTICLE CANONICAL
// ============================================================

function getCanonicalUrl(slug) {
  return (
    `${SITE_URL}/knowledge/` +
    encodeURIComponent(cleanSlug(slug))
  );
}

// ============================================================
// FETCH SINGLE ARTICLE
// SERVER COMPONENT + REQUEST CACHE
// ============================================================

const getArticle = cache(async function getArticle(slug) {
  const clean = cleanSlug(slug);

  if (!clean) {
    return null;
  }

  const res = await fetch(
    `${API}/knowledge/slug/${encodeURIComponent(clean)}`,
    {
      next: {
        revalidate: REVALIDATE_SECONDS,
      },
      headers: {
        Accept: "application/json",
      },
    }
  );

  // Genuine missing article.

  if (res.status === 404 || res.status === 410) {
    return null;
  }

  // Do not turn temporary API failure into a false 404.

  if (!res.ok) {
    throw new Error(
      `Knowledge article API failed: ${res.status}`
    );
  }

  const data = await res.json();

  if (data?.success === false) {
    return null;
  }

  return data?.data || null;
});

// ============================================================
// FETCH ALL ARTICLES
// OPTIONAL SIDEBAR / RELATED CONTENT
// ============================================================

const getAllArticles = cache(async function getAllArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge`,
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(
        "Knowledge articles API error:",
        res.status
      );

      return [];
    }

    const data = await res.json();

    return Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (error) {
    console.error(
      "Knowledge articles fetch error:",
      error
    );

    return [];
  }
});

// ============================================================
// GOOGLE ROBOTS
// ============================================================

function getRobots() {
  return {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  };
}

// ============================================================
// SEO METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const slug = resolvedParams?.slug;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Knowledge Article | Property Bouquet",
      description:
        "Property Bouquet real estate knowledge and insights.",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = getArticleTitle(article);

  const description =
    getArticleDescription(article);

  const canonicalUrl = getCanonicalUrl(
    article.slug || slug
  );

  const image = getArticleImage(article);

  const publishedTime = getPublishedDate(article);

  const modifiedTime = getSafeIsoDate(
    article.updatedAt
  );

  const keywords = getArticleKeywords(article);

  if (!isArticleIndexable(article)) {
    return {
      title,
      description,

      robots: {
        index: false,
        follow: false,
      },

      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // Use actual image dimensions only when available.

  const openGraphImage = image
    ? {
        url: image.url,
        alt: image.alt || title,
        ...(image.width && image.height
          ? {
              width: image.width,
              height: image.height,
            }
          : {}),
      }
    : null;

  return {
    metadataBase: new URL(SITE_URL),

    title,

    description,

    ...(keywords ? { keywords } : {}),

    alternates: {
      canonical: canonicalUrl,
    },

    robots: getRobots(),

    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      siteName: "Property Bouquet",
      locale: "en_IN",

      ...(openGraphImage
        ? {
            images: [openGraphImage],
          }
        : {}),

      ...(publishedTime
        ? {
            publishedTime,
          }
        : {}),

      ...(modifiedTime
        ? {
            modifiedTime,
          }
        : {}),
    },

    twitter: {
      card: image
        ? "summary_large_image"
        : "summary",

      title,
      description,

      ...(image
        ? {
            images: [image.url],
          }
        : {}),
    },
  };
}

// ============================================================
// ARTICLE STRUCTURED DATA
// ============================================================

function ArticleSchema({ article }) {
  if (!article) return null;

  const canonicalUrl = getCanonicalUrl(
    article.slug
  );

  const title = getArticleTitle(article);

  const description =
    getArticleDescription(article);

  const image = getArticleImage(article);

  const publishedDate = getPublishedDate(article);

  const modifiedDate = getSafeIsoDate(
    article.updatedAt
  );

  const keywords = getArticleKeywords(article);

  // ==========================================================
  // AUTHOR
  // ==========================================================

  const authorName =
    safeText(article.author) ||
    "Property Bouquet Research Team";

  const authorType = safeText(
    article.authorType
  ).toLowerCase();

  const authorUrl = article.authorUrl
    ? normalizeImage(article.authorUrl)?.url || null
    : null;

  // A Research Team / Editorial Team is an Organization.
  // A named individual can be explicitly marked as Person.

  const organizationAuthor =
    authorType === "organization" ||
    (
      authorType !== "person" &&
      /team|editorial|research|property bouquet/i.test(
        authorName
      )
    );

  const author = organizationAuthor
    ? {
        "@type": "Organization",
        name: authorName,
        url: authorUrl || SITE_URL,
      }
    : {
        "@type": "Person",
        name: authorName,
        ...(authorUrl
          ? { url: authorUrl }
          : {}),
      };

  // ==========================================================
  // PUBLISHER
  // ==========================================================

  const publisher = {
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "Property Bouquet",
    url: SITE_URL,
  };

  // ==========================================================
  // ARTICLE
  // ==========================================================

  const articleSchema = {
    "@type": "BlogPosting",

    "@id": `${canonicalUrl}#article`,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },

    url: canonicalUrl,

    headline: title,

    description,

    ...(image
      ? {
          image: [
            {
              "@type": "ImageObject",
              url: image.url,
              ...(image.width
                ? { width: image.width }
                : {}),
              ...(image.height
                ? { height: image.height }
                : {}),
            },
          ],
        }
      : {}),

    ...(publishedDate
      ? {
          datePublished: publishedDate,
        }
      : {}),

    ...(modifiedDate
      ? {
          dateModified: modifiedDate,
        }
      : {}),

    author,

    publisher,

    articleSection:
      safeText(article.category) ||
      "Property Knowledge",

    ...(keywords
      ? {
          keywords: keywords.join(", "),
        }
      : {}),

    inLanguage: "en-IN",

    copyrightHolder: publisher,
  };

  // ==========================================================
  // WEBPAGE
  // ==========================================================

  const webPageSchema = {
    "@type": "WebPage",

    "@id": canonicalUrl,

    url: canonicalUrl,

    name: title,

    description,

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "Property Bouquet",
      url: SITE_URL,
    },

    ...(image
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: image.url,
          },
        }
      : {}),

    inLanguage: "en-IN",

    breadcrumb: {
      "@id": `${canonicalUrl}#breadcrumb`,
    },

    mainEntity: {
      "@id": `${canonicalUrl}#article`,
    },
  };

  // ==========================================================
  // ORGANIZATION
  // ==========================================================

  const organizationSchema = {
    "@type": "Organization",

    "@id": `${SITE_URL}#organization`,

    name: "Property Bouquet",

    url: SITE_URL,
  };

  // ==========================================================
  // WEBSITE
  // ==========================================================

  const websiteSchema = {
    "@type": "WebSite",

    "@id": `${SITE_URL}#website`,

    name: "Property Bouquet",

    url: SITE_URL,

    publisher: {
      "@id": `${SITE_URL}#organization`,
    },

    inLanguage: "en-IN",
  };

  // ==========================================================
  // BREADCRUMB
  // ==========================================================

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",

    "@id": `${canonicalUrl}#breadcrumb`,

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
        name: "Knowledge Centre",
        item: `${SITE_URL}/knowledge`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  // ==========================================================
  // COMPLETE JSON-LD GRAPH
  // ==========================================================

  const schema = {
    "@context": "https://schema.org",

    "@graph": [
      organizationSchema,
      websiteSchema,
      webPageSchema,
      breadcrumbSchema,
      articleSchema,
    ],
  };

  const safeJsonLd = JSON.stringify(schema)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonLd,
      }}
    />
  );
}

// ============================================================
// SANITIZE ARTICLE CONTENT
// SERVER SIDE ONLY
// ============================================================

function sanitizeArticleContent(html) {
  if (typeof html !== "string" || !html.trim()) {
    return "";
  }

  return sanitizeHtml(
    html.replace(/\u00A0/g, " "),
    {
      allowedTags: [
        "a",
        "abbr",
        "address",
        "b",
        "blockquote",
        "br",
        "caption",
        "cite",
        "code",
        "col",
        "colgroup",
        "dd",
        "del",
        "details",
        "div",
        "dl",
        "dt",
        "em",
        "figcaption",
        "figure",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "hr",
        "i",
        "img",
        "li",
        "mark",
        "ol",
        "p",
        "pre",
        "s",
        "section",
        "small",
        "source",
        "strong",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "tfoot",
        "th",
        "thead",
        "tr",
        "u",
        "ul",
        "video",
      ],

      allowedAttributes: {
        "*": [
          "class",
          "id",
          "aria-label",
          "role",
          "title",
        ],

        a: [
          "href",
          "title",
          "target",
          "rel",
          "name",
        ],

        img: [
          "src",
          "alt",
          "title",
          "width",
          "height",
        ],

        table: [
          "summary",
        ],

        th: [
          "colspan",
          "rowspan",
          "scope",
          "headers",
        ],

        td: [
          "colspan",
          "rowspan",
          "headers",
        ],

        col: [
          "span",
          "width",
        ],

        colgroup: [
          "span",
        ],

        ol: [
          "start",
          "type",
        ],

        li: [
          "value",
        ],

        video: [
          "src",
          "poster",
          "controls",
          "preload",
          "width",
          "height",
        ],

        source: [
          "src",
          "type",
        ],
      },

      allowedSchemes: [
        "http",
        "https",
        "mailto",
        "tel",
      ],

      allowedSchemesByTag: {
        img: ["http", "https"],
        video: ["http", "https"],
        source: ["http", "https"],
      },

      allowedSchemesAppliedToAttributes: [
        "href",
        "src",
        "cite",
      ],

      allowProtocolRelative: false,

      transformTags: {
        // The page hero owns the only H1.
        h1: sanitizeHtml.simpleTransform(
          "h2",
          {},
          true
        ),

        // Article images should load lazily.
        img: (tagName, attribs) => ({
          tagName,
          attribs: {
            ...attribs,
            loading: "lazy",
            decoding: "async",
          },
        }),

        // Protect external new-tab links.
        a: (tagName, attribs) => {
          const updated = {
            ...attribs,
          };

          if (updated.target === "_blank") {
            const rel = new Set(
              String(updated.rel || "")
                .split(/\s+/)
                .filter(Boolean)
            );

            rel.add("noopener");
            rel.add("noreferrer");

            updated.rel = Array.from(rel).join(" ");
          }

          return {
            tagName,
            attribs: updated,
          };
        },
      },
    }
  );
}

// ============================================================
// NAVIGATION LOADING SKELETON
// ============================================================

function ArticleNavigationLoading() {
  return (
    <div
      className="
        mt-20
        grid
        grid-cols-1
        md:grid-cols-2
        gap-8
        animate-pulse
      "
      aria-hidden="true"
    >
      <div className="h-40 rounded-[28px] bg-[#eeeae2]" />
      <div className="h-40 rounded-[28px] bg-[#eeeae2]" />
    </div>
  );
}

// ============================================================
// RELATED ARTICLES LOADING SKELETON
// ============================================================

function RelatedArticlesLoading() {
  return (
    <div className="mt-12" aria-hidden="true">
      <div className="h-10 w-64 rounded bg-[#eeeae2] animate-pulse mb-8" />

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-8
      ">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              overflow-hidden
              bg-[#eeeae2]
              animate-pulse
            "
          >
            <div className="h-48 bg-[#e7e1d6]" />

            <div className="p-5 space-y-4">
              <div className="h-4 w-24 rounded bg-[#ddd5c8]" />
              <div className="h-6 w-full rounded bg-[#ddd5c8]" />
              <div className="h-4 w-3/4 rounded bg-[#ddd5c8]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ASYNC PREVIOUS / NEXT NAVIGATION
// ============================================================

async function ArticleNavigationContent({
  article,
  articlesPromise,
}) {
  const articles = await articlesPromise;

  const publishedArticles = articles.filter(
    isArticleIndexable
  );

  if (!publishedArticles.length) {
    return null;
  }

  const currentIndex = publishedArticles.findIndex(
    (item) =>
      cleanSlug(item.slug) === cleanSlug(article.slug)
  );

  if (currentIndex === -1) {
    return null;
  }

  // Preserve the existing API ordering.

  const previousArticle =
    currentIndex < publishedArticles.length - 1
      ? publishedArticles[currentIndex + 1]
      : null;

  const nextArticle =
    currentIndex > 0
      ? publishedArticles[currentIndex - 1]
      : null;

  return (
    <ArticleNavigation
      previousArticle={previousArticle}
      nextArticle={nextArticle}
    />
  );
}

// ============================================================
// ASYNC RELATED ARTICLES
// ============================================================

async function RelatedArticlesContent({
  article,
  articlesPromise,
}) {
  const articles = await articlesPromise;

  return (
    <RelatedArticles
      currentArticle={article}
      articles={articles}
    />
  );
}

// ============================================================
// MAIN KNOWLEDGE ARTICLE PAGE
// SERVER COMPONENT
// ============================================================

export default async function KnowledgeArticlePage({
  params,
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug || !cleanSlug(slug)) {
    notFound();
  }

  // Start the requests concurrently.

  const articlePromise = getArticle(slug);
  const articlesPromise = getAllArticles();

  // Wait for the current article.

  const article = await articlePromise;

  // Protect unpublished / deleted / inactive articles.

  if (!isArticleIndexable(article)) {
    notFound();
  }

  // Normalize featured image.

  const image = getArticleImage(article);

  const featuredImage = image?.url || null;

  const featuredImageAlt =
    safeText(article.featuredImageAlt) ||
    image?.alt ||
    getArticleTitle(article);

  // Select actual article body.

  const rawContent =
    article.content ||
    article.body ||
    "";

  // Sanitize before rendering.

  const sanitizedContent = sanitizeArticleContent(
    rawContent
  );

  // Prepare article for the page components.

  const articleForPage = {
    ...article,

    title: getArticleTitle(article),

    content: sanitizedContent,

    featuredImage,

    featuredImageAlt,

    publishDate:
      article.publishDate ||
      article.publishedAt ||
      article.createdAt ||
      null,
  };

  return (
    <>
      {/* STRUCTURED DATA */}

      <ArticleSchema article={articleForPage} />

      {/* NAVBAR */}

      <Navbar forceSolid />

      {/* MAIN */}

      <main className="pt-20 lg:pt-26">
        <ArticleHero
          article={articleForPage}
        />

        <section className="
          bg-[#faf8f4]
          pb-20
          lg:pb-24
        ">
          <div className="
            max-w-[1400px]
            mx-auto
            px-5
            lg:px-10
          ">
            <div className="
              grid
              lg:grid-cols-12
              gap-8
              lg:gap-14
              items-start
            ">
              {/* MAIN ARTICLE */}

              <div className="
                lg:col-span-8
                min-w-0
              ">
                <ArticleContent
                  article={articleForPage}
                  navigation={
                    <Suspense
                      fallback={<ArticleNavigationLoading />}
                    >
                      <ArticleNavigationContent
                        article={articleForPage}
                        articlesPromise={articlesPromise}
                      />
                    </Suspense>
                  }
                />
              </div>

              {/* SIDEBAR */}

              <div className="
                lg:col-span-4
                min-w-0
              ">
                <div className="
                  lg:sticky
                  lg:top-28
                  self-start
                ">
                  <ArticleSidebar
                    category={articleForPage.category}
                  />
                </div>
              </div>
            </div>

            {/* RELATED ARTICLES */}

            <Suspense
              fallback={<RelatedArticlesLoading />}
            >
              <RelatedArticlesContent
                article={articleForPage}
                articlesPromise={articlesPromise}
              />
            </Suspense>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <Footer />
    </>
  );
}
