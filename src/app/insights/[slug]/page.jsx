import { cache } from "react";
import { notFound } from "next/navigation";

import "@/app/insights/article.css";

import InsightArticleClient from "./InsightArticleClient";

const API = "https://propertybouquet.com/api";
const SITE_URL = "https://propertybouquet.com";

// ============================================================
// SAFE IMAGE URL
// ============================================================

function getSafeImageUrl(image) {
  // Normal string URL
  if (typeof image === "string" && image.trim()) {
    return image.trim();
  }

  // Object format:
  // { url: "https://..." }
  if (image && typeof image === "object") {
    if (
      typeof image.url === "string" &&
      image.url.trim()
    ) {
      return image.url.trim();
    }

    // Object format:
    // { src: "https://..." }
    if (
      typeof image.src === "string" &&
      image.src.trim()
    ) {
      return image.src.trim();
    }
  }

  // No placeholder.
  // Return null so image markup is not generated.
  return null;
}

// ============================================================
// SAFE DATE
// ============================================================

function getSafeIsoDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

// ============================================================
// SAFE KEYWORDS
// ============================================================

function getArticleKeywords(article) {
  if (!article) {
    return null;
  }

  // Tags array
  if (Array.isArray(article.tags)) {
    const tags = article.tags
      .filter(Boolean)
      .map((tag) => String(tag).trim())
      .filter(Boolean);

    if (tags.length > 0) {
      return tags.join(", ");
    }
  }

  // Tags string
  if (
    typeof article.tags === "string" &&
    article.tags.trim()
  ) {
    return article.tags.trim();
  }

  // Keywords array
  if (Array.isArray(article.keywords)) {
    const keywords = article.keywords
      .filter(Boolean)
      .map((keyword) => String(keyword).trim())
      .filter(Boolean);

    if (keywords.length > 0) {
      return keywords.join(", ");
    }
  }

  // Keywords string
  if (
    typeof article.keywords === "string" &&
    article.keywords.trim()
  ) {
    return article.keywords.trim();
  }

  return null;
}

// ============================================================
// FETCH ALL PUBLISHED ARTICLES
// ============================================================

const getArticles = cache(async function getArticles() {
  try {
    const res = await fetch(
      `${API}/news?status=published`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch articles: ${res.status}`
      );
    }

    const data = await res.json();

    if (!data?.success) {
      throw new Error(
        "Unable to fetch published articles"
      );
    }

    return Array.isArray(data.data)
      ? data.data
      : [];
  } catch (error) {
    console.error(
      "FETCH PUBLISHED ARTICLES ERROR:",
      error
    );

    return [];
  }
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
// SEO METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const slug = resolvedParams?.slug;

  // ==========================================================
  // INVALID SLUG
  // ==========================================================

  if (!slug) {
    return {
      title:
        "Article Not Found | Property Bouquet",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ==========================================================
  // FETCH ARTICLE
  // ==========================================================

  const { article } = await getArticle(slug);

  // ==========================================================
  // ARTICLE NOT FOUND
  // ==========================================================

  if (!article) {
    return {
      title:
        "Article Not Found | Property Bouquet",

      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // ==========================================================
  // TITLE
  // ==========================================================

  const title =
    article.seoTitle ||
    article.metaTitle ||
    article.title ||
    "Property Insights | Property Bouquet";

  // ==========================================================
  // DESCRIPTION
  // ==========================================================

  const description =
    article.seoDescription ||
    article.metaDescription ||
    article.shortDescription ||
    "Read the latest real estate insights, property trends and market intelligence from Property Bouquet.";

  // ==========================================================
  // CANONICAL
  // ==========================================================

  const canonical =
    `${SITE_URL}/insights/${article.slug}`;

  // ==========================================================
  // SAFE IMAGE
  // ==========================================================

  const image = getSafeImageUrl(
    article.featuredImage
  );

  // ==========================================================
  // PUBLISHED DATE
  // ==========================================================

  const publishedTime =
    getSafeIsoDate(
      article.publishDate
    );

  // ==========================================================
  // MODIFIED DATE
  // ==========================================================

  const modifiedTime =
    getSafeIsoDate(
      article.updatedAt
    );

  // ==========================================================
  // KEYWORDS
  // ==========================================================

  const keywords =
    getArticleKeywords(article);

  // ==========================================================
  // METADATA
  // ==========================================================

  return {
    title,

    description,

    ...(keywords
      ? {
          keywords,
        }
      : {}),

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,

      description,

      url: canonical,

      siteName: "Property Bouquet",

      type: "article",

      ...(image
        ? {
            images: [
              {
                url: image,

                width: 1600,

                height: 900,

                alt:
                  article.title ||
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

      authors: [
        article.author ||
          "Property Bouquet Research Team",
      ],
    },

    twitter: {
      card: image
        ? "summary_large_image"
        : "summary",

      title,

      description,

      ...(image
        ? {
            images: [image],
          }
        : {}),
    },
  };
}

// ============================================================
// ARTICLE STRUCTURED DATA
// ============================================================

function ArticleSchema({
  article,
}) {
  if (!article) {
    return null;
  }

  // ==========================================================
  // BASIC DATA
  // ==========================================================

  const canonical =
    `${SITE_URL}/insights/${article.slug}`;

  const image =
    getSafeImageUrl(
      article.featuredImage
    );

  const title =
    article.title ||
    "Property Insights | Property Bouquet";

  const description =
    article.seoDescription ||
    article.metaDescription ||
    article.shortDescription ||
    "";

  const publishedDate =
    getSafeIsoDate(
      article.publishDate
    );

  const updatedDate =
    getSafeIsoDate(
      article.updatedAt
    );

  const dateModified =
    updatedDate ||
    publishedDate ||
    null;

  const keywords =
    getArticleKeywords(article);

  const authorName =
    typeof article.author === "string" &&
    article.author.trim()
      ? article.author.trim()
      : "Property Bouquet Research Team";

  // ==========================================================
  // AUTHOR TYPE
  //
  // If an actual author is supplied, treat it as a Person.
  // Otherwise use the Property Bouquet research team as an
  // Organization.
  // ==========================================================

  const hasRealAuthor =
    typeof article.author === "string" &&
    article.author.trim();

  const author = hasRealAuthor
    ? {
        "@type": "Person",
        name: authorName,
      }
    : {
        "@type": "Organization",
        name: "Property Bouquet Research Team",
        url: SITE_URL,
      };

  // ==========================================================
  // ARTICLE
  //
  // "Article" is intentionally used here instead of
  // "NewsArticle" because Property Insights can contain:
  //
  // - Market analysis
  // - Property guides
  // - Investment guides
  // - Market trends
  // - Reports
  // - Real estate news
  //
  // If your CMS later adds contentType === "News",
  // this can safely be changed to NewsArticle only for
  // genuine news content.
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

    description,

    // ========================================================
    // IMAGE
    // ========================================================

    ...(image
      ? {
          image: [
            image,
          ],
        }
      : {}),

    // ========================================================
    // DATES
    // ========================================================

    ...(publishedDate
      ? {
          datePublished:
            publishedDate,
        }
      : {}),

    ...(dateModified
      ? {
          dateModified,
        }
      : {}),

    // ========================================================
    // AUTHOR
    // ========================================================

    author,

    // ========================================================
    // PUBLISHER
    // ========================================================

    publisher: {
      "@type": "Organization",

      "@id": `${SITE_URL}#organization`,

      name: "Property Bouquet",

      url: SITE_URL,

      logo: {
        "@type": "ImageObject",

        "@id": `${SITE_URL}#logo`,

        url:
          `${SITE_URL}/logo.webp`,
      },
    },

    // ========================================================
    // ARTICLE SECTION
    // ========================================================

    articleSection:
      article.category ||
      "Property Insights",

    // ========================================================
    // KEYWORDS
    // ========================================================

    ...(keywords
      ? {
          keywords,
        }
      : {}),

    // ========================================================
    // LANGUAGE
    // ========================================================

    inLanguage: "en-IN",

    // ========================================================
    // COPYRIGHT
    // ========================================================

    copyrightHolder: {
      "@type": "Organization",

      name: "Property Bouquet",

      url: SITE_URL,
    },

    ...(publishedDate
      ? {
          copyrightYear:
            new Date(
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

        item:
          `${SITE_URL}/insights`,
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

    description,

    isPartOf: {
      "@type": "WebSite",

      "@id": `${SITE_URL}#website`,

      name: "Property Bouquet",

      url: SITE_URL,
    },

    about: {
      "@type": "Thing",

      name:
        article.category ||
        "Real Estate Insights",
    },

    inLanguage: "en-IN",

    breadcrumb: {
      "@id":
        `${canonical}#breadcrumb`,
    },

    mainEntity: {
      "@id":
        `${canonical}#article`,
    },
  };

  // ==========================================================
  // ORGANIZATION STRUCTURED DATA
  // ==========================================================

  const organizationSchema = {
    "@type": "Organization",

    "@id": `${SITE_URL}#organization`,

    name: "Property Bouquet",

    url: SITE_URL,

    logo: {
      "@type": "ImageObject",

      "@id": `${SITE_URL}#logo`,

      url:
        `${SITE_URL}/logo.webp`,
    },
  };

  // ==========================================================
  // WEBSITE STRUCTURED DATA
  // ==========================================================

  const websiteSchema = {
    "@type": "WebSite",

    "@id": `${SITE_URL}#website`,

    name: "Property Bouquet",

    url: SITE_URL,

    publisher: {
      "@id":
        `${SITE_URL}#organization`,
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(schema),
      }}
    />
  );
}

// ============================================================
// CLEAN ARTICLE HTML
// ============================================================

function cleanArticleHtml(html) {
  if (
    typeof html !== "string" ||
    !html.trim()
  ) {
    return "";
  }

  let cleaned = html;

  // ==========================================================
  // CONVERT NON-BREAKING SPACES
  // ==========================================================

  cleaned = cleaned.replace(
    /&nbsp;/g,
    " "
  );

  cleaned = cleaned.replace(
    /\u00A0/g,
    " "
  );

  // ==========================================================
  // REMOVE IMAGES WITH EMPTY SRC
  //
  // Removes:
  // <img src="">
  // <img src=''>
  // <img src="   ">
  // ==========================================================

  cleaned = cleaned.replace(
    /<img\b([^>]*?)\bsrc\s*=\s*["']\s*["']([^>]*)>/gi,
    ""
  );

  // ==========================================================
  // REMOVE IMAGES WHERE SRC IS MISSING
  //
  // Example:
  // <img alt="something">
  // ==========================================================

  cleaned = cleaned.replace(
    /<img\b(?![^>]*\bsrc\s*=)[^>]*>/gi,
    ""
  );

  return cleaned;
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

  // The request-cached function is also used by generateMetadata.
  // The API still uses no-store to preserve the current publishing freshness.
  const { article, articles } = await getArticle(slug);

  if (!article) {
    notFound();
  }

  const articleContent = cleanArticleHtml(article.content || "");
  const safeFeaturedImage = getSafeImageUrl(article.featuredImage);

  // Do not send the full HTML body to the browser as part of the article
  // object: articleContent is rendered by this Server Component instead.
  const { content: _content, ...articleFieldsForPage } = article;
  const clientArticle = {
    ...articleFieldsForPage,
    featuredImage: safeFeaturedImage,
  };

  const currentIndex = articles.findIndex(
    (item) => String(item?.slug || "") === String(article.slug || "")
  );

  // Preserve the existing previous/next order, but only send fields used
  // by those links instead of sending complete article records.
  const previousRecord = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextRecord =
    currentIndex >= 0 && currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  const previousArticle = previousRecord?.slug
    ? { slug: previousRecord.slug, title: previousRecord.title || "Previous article" }
    : null;

  const nextArticle = nextRecord?.slug
    ? { slug: nextRecord.slug, title: nextRecord.title || "Next article" }
    : null;

  // LatestInsightsSidebar only uses these four fields and displays four items.
  const latestArticles = articles
    .filter((item) => item?.slug && item.slug !== article.slug)
    .slice(0, 4)
    .map((item) => ({
      slug: item.slug,
      title: item.title || "Property Insight",
      featuredImage: getSafeImageUrl(item.featuredImage),
      readTime: item.readTime || null,
    }));

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
