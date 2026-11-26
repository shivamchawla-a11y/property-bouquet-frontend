
import { cache } from "react";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

import "@/app/insights/article.css";

import InsightArticleClient from "./InsightArticleClient";

const API = "https://propertybouquet.com/api";
const SITE_URL = "https://propertybouquet.com";
const LOGO_URL = `${SITE_URL}/logo.webp`;

// ============================================================
// SAFE TEXT
// ============================================================

function getSafeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

// ============================================================
// SAFE IMAGE URL
// ============================================================

function getSafeImageUrl(image) {
  let value = null;

  if (typeof image === "string") {
    value = image.trim();
  } else if (image && typeof image === "object") {
    if (typeof image.url === "string") {
      value = image.url.trim();
    } else if (typeof image.src === "string") {
      value = image.src.trim();
    }
  }

  if (!value) return null;

  // Reject protocol-relative URLs.
  if (value.startsWith("//")) {
    return null;
  }

  // Resolve relative image paths against the website.
  try {
    const parsed = new URL(value, SITE_URL);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    // Preserve root-relative URLs for Next Image.
    if (value.startsWith("/")) {
      return value;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

// ============================================================
// SAFE ABSOLUTE URL
// ============================================================

function getSafeAbsoluteUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const parsed = new URL(value.trim(), SITE_URL);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
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
// SAFE ARTICLE KEYWORDS
// ============================================================

function getArticleKeywords(article) {
  if (!article) return null;

  if (Array.isArray(article.tags)) {
    const tags = article.tags
      .map((tag) => getSafeText(String(tag || "")))
      .filter(Boolean);

    if (tags.length > 0) {
      return tags.join(", ");
    }
  }

  if (
    typeof article.tags === "string" &&
    article.tags.trim()
  ) {
    return article.tags.trim();
  }

  if (Array.isArray(article.keywords)) {
    const keywords = article.keywords
      .map((keyword) => getSafeText(String(keyword || "")))
      .filter(Boolean);

    if (keywords.length > 0) {
      return keywords.join(", ");
    }
  }

  if (
    typeof article.keywords === "string" &&
    article.keywords.trim()
  ) {
    return article.keywords.trim();
  }

  return null;
}

// ============================================================
// ARTICLE CANONICAL
// ============================================================

function getArticleCanonical(slug) {
  return new URL(
    `/insights/${encodeURIComponent(String(slug || ""))}`,
    SITE_URL
  ).toString();
}

// ============================================================
// FETCH ALL PUBLISHED ARTICLES
// ============================================================

const getArticles = cache(async function getArticles() {
  const response = await fetch(
    `${API}/news?status=published`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    }
  );

  // Do not turn an API failure into an empty article list.
  // A genuine API failure must remain a server error,
  // not become a false 404 for an existing article.

  if (!response.ok) {
    throw new Error(
      `Failed to fetch published articles: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data?.success || !Array.isArray(data.data)) {
    throw new Error(
      "Invalid published articles API response"
    );
  }

  return data.data;
});

// ============================================================
// GET CURRENT ARTICLE
// ============================================================

const getArticle = cache(async function getArticle(slug) {
  const articles = await getArticles();

  const currentArticle = articles.find(
    (item) =>
      String(item?.slug || "") ===
      String(slug || "")
  );

  return {
    article: currentArticle || null,
    articles,
  };
});

// ============================================================
// GOOGLE ROBOTS SETTINGS
// ============================================================

function getIndexableRobots() {
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

  if (!slug) {
    return {
      title: "Article Not Found | Property Bouquet",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { article } = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found | Property Bouquet",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // TITLE

  const title =
    getSafeText(article.seoTitle) ||
    getSafeText(article.metaTitle) ||
    getSafeText(article.title) ||
    "Property Insights | Property Bouquet";

  // DESCRIPTION

  const description =
    getSafeText(article.seoDescription) ||
    getSafeText(article.metaDescription) ||
    getSafeText(article.shortDescription) ||
    "Read real estate insights, property trends and market intelligence from Property Bouquet.";

  // CANONICAL

  const canonical = getArticleCanonical(article.slug);

  // IMAGE

  const image = getSafeImageUrl(article.featuredImage);

  const absoluteImage = image
    ? getSafeAbsoluteUrl(image)
    : null;

  // DATES

  const publishedTime = getSafeIsoDate(
    article.publishDate
  );

  const modifiedTime = getSafeIsoDate(
    article.updatedAt
  );

  // KEYWORDS

  const keywords = getArticleKeywords(article);

  // AUTHOR PROFILE URL, WHEN AVAILABLE

  const authorUrl = getSafeAbsoluteUrl(
    article.authorUrl
  );

  return {
    metadataBase: new URL(SITE_URL),

    title,

    description,

    ...(keywords ? { keywords } : {}),

    alternates: {
      canonical,
    },

    // GOOGLE DISCOVER IMAGE PREVIEW

    robots: getIndexableRobots(),

    // OPEN GRAPH

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Property Bouquet",
      type: "article",

      ...(absoluteImage
        ? {
            images: [
              {
                url: absoluteImage,
                alt:
                  getSafeText(article.featuredImageAlt) ||
                  getSafeText(article.title) ||
                  "Property Bouquet Insights",
              },
            ],
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

      ...(authorUrl
        ? {
            authors: [authorUrl],
          }
        : {}),
    },

    // TWITTER / X

    twitter: {
      card: absoluteImage
        ? "summary_large_image"
        : "summary",

      title,
      description,

      ...(absoluteImage
        ? {
            images: [absoluteImage],
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

  const canonical = getArticleCanonical(
    article.slug
  );

  const image = getSafeImageUrl(
    article.featuredImage
  );

  const absoluteImage = image
    ? getSafeAbsoluteUrl(image)
    : null;

  const title =
    getSafeText(article.title) ||
    "Property Insights | Property Bouquet";

  const description =
    getSafeText(article.shortDescription) ||
    getSafeText(article.seoDescription) ||
    getSafeText(article.metaDescription);

  const publishedDate = getSafeIsoDate(
    article.publishDate
  );

  // Only use an actual modification date.
  // Do not automatically copy the publication date.

  const dateModified = getSafeIsoDate(
    article.updatedAt
  );

  const keywords = getArticleKeywords(article);

  // ==========================================================
  // AUTHOR
  // ==========================================================

  const authorName =
    getSafeText(article.author) ||
    "Property Bouquet Research Team";

  const declaredAuthorType = getSafeText(
    article.authorType
  ).toLowerCase();

  const authorUrl = getSafeAbsoluteUrl(
    article.authorUrl
  );

  // Explicit CMS authorType takes priority.
  // The existing Research Team is treated as an Organization.

  const isOrganizationAuthor =
    declaredAuthorType === "organization" ||
    (
      declaredAuthorType !== "person" &&
      /team|editorial|research|property bouquet/i.test(authorName)
    );

  const author = isOrganizationAuthor
    ? {
        "@type": "Organization",
        name: authorName,
        url: authorUrl || SITE_URL,
      }
    : {
        "@type": "Person",
        name: authorName,
        ...(authorUrl ? { url: authorUrl } : {}),
      };

  // ==========================================================
  // ARTICLE
  // ==========================================================

  const articleSchema = {
    "@type": "Article",

    "@id": `${canonical}#article`,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },

    url: canonical,

    headline: title,

    ...(description ? { description } : {}),

    ...(absoluteImage
      ? {
          image: [absoluteImage],
        }
      : {}),

    ...(publishedDate
      ? {
          datePublished: publishedDate,
        }
      : {}),

    ...(dateModified
      ? {
          dateModified,
        }
      : {}),

    author,

    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}#organization`,
      name: "Property Bouquet",
      url: SITE_URL,

      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}#logo`,
        url: LOGO_URL,
      },
    },

    articleSection:
      getSafeText(article.category) ||
      "Property Insights",

    ...(keywords ? { keywords } : {}),

    inLanguage: "en-IN",

    copyrightHolder: {
      "@type": "Organization",
      name: "Property Bouquet",
      url: SITE_URL,
    },

    ...(publishedDate
      ? {
          copyrightYear: new Date(
            publishedDate
          ).getFullYear(),
        }
      : {}),
  };

  // ==========================================================
  // BREADCRUMB STRUCTURED DATA
  // ==========================================================

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",

    "@id": `${canonical}#breadcrumb`,

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
        name: "Property Insights",
        item: `${SITE_URL}/insights`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: canonical,
      },
    ],
  };

  // ==========================================================
  // WEBPAGE STRUCTURED DATA
  // ==========================================================

  const webPageSchema = {
    "@type": "WebPage",

    "@id": canonical,

    url: canonical,

    name: title,

    ...(description ? { description } : {}),

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      name: "Property Bouquet",
      url: SITE_URL,
    },

    about: {
      "@type": "Thing",
      name:
        getSafeText(article.category) ||
        "Real Estate Insights",
    },

    inLanguage: "en-IN",

    breadcrumb: {
      "@id": `${canonical}#breadcrumb`,
    },

    mainEntity: {
      "@id": `${canonical}#article`,
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

    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}#logo`,
      url: LOGO_URL,
    },
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

  // Escape characters that could terminate the script element.

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
// SANITIZE ARTICLE HTML
// ============================================================

function sanitizeArticleHtml(html) {
  if (typeof html !== "string" || !html.trim()) {
    return "";
  }

  const source = html.replace(/\u00A0/g, " ");

  return sanitizeHtml(source, {
    // Only allow article elements required by the editorial layout.

    allowedTags: [
      "a",
      "abbr",
      "address",
      "article",
      "aside",
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

    // Explicitly permitted attributes.

    allowedAttributes: {
      "*": [
        "class",
        "id",
        "aria-label",
        "role",
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
        "loading",
        "decoding",
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

    // Restrict URL protocols.

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

    // Convert body H1 headings to H2.
    // The page already has its own main H1.

    transformTags: {
      h1: sanitizeHtml.simpleTransform(
        "h2",
        {},
        true
      ),

      // Lazy-load article images.

      img: (tagName, attribs) => {
        return {
          tagName,
          attribs: {
            ...attribs,
            loading: "lazy",
            decoding: "async",
          },
        };
      },

      // Protect visitors opening external links in new tabs.

      a: (tagName, attribs) => {
        const nextAttributes = {
          ...attribs,
        };

        if (nextAttributes.target === "_blank") {
          const relValues = new Set(
            String(nextAttributes.rel || "")
              .split(/\s+/)
              .filter(Boolean)
          );

          relValues.add("noopener");
          relValues.add("noreferrer");

          nextAttributes.rel = [
            ...relValues,
          ].join(" ");
        }

        return {
          tagName,
          attribs: nextAttributes,
        };
      },
    },

    // Use the sanitizer's default safe HTML parser settings.
    enforceHtmlBoundary: true,
  });
}

// ============================================================
// SERVER COMPONENT
// ============================================================

export default async function InsightDetailPage({
  params,
}) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    notFound();
  }

  // API errors propagate as server errors.
  // Only a successful API response with no matching article
  // should result in a genuine 404.

  const {
    article,
    articles,
  } = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // SANITIZED ARTICLE HTML

  const articleContent = sanitizeArticleHtml(
    article.content || ""
  );

  // SAFE FEATURED IMAGE

  const safeFeaturedImage = getSafeImageUrl(
    article.featuredImage
  );

  // REMOVE CONTENT FROM THE CLIENT ARTICLE OBJECT.

  const {
    content: originalContent,
    ...articleFieldsForPage
  } = article;

  const clientArticle = {
    ...articleFieldsForPage,
    featuredImage: safeFeaturedImage,
  };

  // ==========================================================
  // PREVIOUS / NEXT ARTICLES
  // ==========================================================

  const currentIndex = articles.findIndex(
    (item) =>
      String(item?.slug || "") ===
      String(article.slug || "")
  );

  const previousRecord =
    currentIndex > 0
      ? articles[currentIndex - 1]
      : null;

  const nextRecord =
    currentIndex >= 0 &&
    currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  const previousArticle = previousRecord?.slug
    ? {
        slug: previousRecord.slug,
        title:
          previousRecord.title ||
          "Previous article",
      }
    : null;

  const nextArticle = nextRecord?.slug
    ? {
        slug: nextRecord.slug,
        title:
          nextRecord.title ||
          "Next article",
      }
    : null;

  // ==========================================================
  // LATEST ARTICLES SIDEBAR
  // ==========================================================

  const latestArticles = articles
    .filter(
      (item) =>
        item?.slug &&
        item.slug !== article.slug
    )
    .slice(0, 4)
    .map((item) => ({
      slug: item.slug,

      title:
        item.title ||
        "Property Insight",

      featuredImage: getSafeImageUrl(
        item.featuredImage
      ),

      readTime:
        item.readTime || null,
    }));

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <ArticleSchema article={article} />

      <InsightArticleClient
        article={clientArticle}
        articleContent={articleContent}
        previousArticle={previousArticle}
        nextArticle={nextArticle}
        latestArticles={latestArticles}
      />
    </>
  );
}
