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

  // IMPORTANT:
  // No placeholder image because user does not currently
  // have one. Return null so <Image> is not rendered.
  return null;
}

// ============================================================
// FETCH ALL PUBLISHED ARTICLES
// ============================================================

async function getArticles() {
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
}

// ============================================================
// GET CURRENT ARTICLE
// ============================================================

async function getArticle(slug) {
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
}

// ============================================================
// SEO METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const resolvedParams = await params;

  const slug = resolvedParams?.slug;

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

  const { article } = await getArticle(slug);

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
  // METADATA
  // ==========================================================

  return {
    title,

    description,

    keywords:
      article.keywords ||
      article.tags ||
      undefined,

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
                  "Property Bouquet",
              },
            ],
          }
        : {}),

      ...(article.publishDate
        ? {
            publishedTime:
              new Date(
                article.publishDate
              ).toISOString(),
          }
        : {}),

      ...(article.updatedAt
        ? {
            modifiedTime:
              new Date(
                article.updatedAt
              ).toISOString(),
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
// ARTICLE JSON-LD
// ============================================================

function ArticleSchema({ article }) {
  if (!article) {
    return null;
  }

  const canonical =
    `${SITE_URL}/insights/${article.slug}`;

  const image = getSafeImageUrl(
    article.featuredImage
  );

  const description =
    article.seoDescription ||
    article.metaDescription ||
    article.shortDescription ||
    "";

  const schema = {
    "@context": "https://schema.org",

    "@type": "Article",

    "@id": `${canonical}#article`,

    mainEntityOfPage: {
      "@type": "WebPage",

      "@id": canonical,
    },

    headline:
      article.title ||
      "Property Insights",

    description,

    url: canonical,

    ...(image
      ? {
          image: [image],
        }
      : {}),

    ...(article.publishDate
      ? {
          datePublished:
            new Date(
              article.publishDate
            ).toISOString(),
        }
      : {}),

    ...(article.updatedAt
      ? {
          dateModified:
            new Date(
              article.updatedAt
            ).toISOString(),
        }
      : article.publishDate
        ? {
            dateModified:
              new Date(
                article.publishDate
              ).toISOString(),
          }
        : {}),

    author: {
      "@type": "Person",

      name:
        article.author ||
        "Property Bouquet Research Team",
    },

    publisher: {
      "@type": "Organization",

      name: "Property Bouquet",

      url: SITE_URL,

      logo: {
        "@type": "ImageObject",

        url:
          `${SITE_URL}/logo.webp`,
      },
    },

    articleSection:
      article.category ||
      "Property Insights",

    ...(Array.isArray(article.tags)
      ? {
          keywords:
            article.tags.join(", "),
        }
      : typeof article.tags === "string"
        ? {
            keywords: article.tags,
          }
        : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
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

  // Convert non-breaking spaces
  cleaned = cleaned.replace(
    /&nbsp;/g,
    " "
  );

  cleaned = cleaned.replace(
    /\u00A0/g,
    " "
  );

  // ----------------------------------------------------------
  // Remove images with empty src
  //
  // Removes:
  // <img src="">
  // <img src=''>
  // <img src="   ">
  // ----------------------------------------------------------

  cleaned = cleaned.replace(
    /<img\b([^>]*?)\bsrc\s*=\s*["']\s*["']([^>]*)>/gi,
    ""
  );

  // ----------------------------------------------------------
  // Remove images where src is missing
  //
  // Example:
  // <img alt="something">
  // ----------------------------------------------------------

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

  // ==========================================================
  // FETCH ARTICLE
  // ==========================================================

  const {
    article,
    articles,
  } = await getArticle(slug);

  // ==========================================================
  // ARTICLE NOT FOUND
  // ==========================================================

  if (!article) {
    notFound();
  }

  // ==========================================================
  // CLEAN ARTICLE CONTENT
  // ==========================================================

  const articleContent =
    cleanArticleHtml(
      article.content || ""
    );

  // ==========================================================
  // SAFE FEATURED IMAGE
  // ==========================================================

  const safeFeaturedImage =
    getSafeImageUrl(
      article.featuredImage
    );

  // ==========================================================
  // CREATE SERIALIZABLE ARTICLE OBJECT
  // ==========================================================

  const clientArticle = {
    ...article,

    featuredImage:
      safeFeaturedImage,
  };

  // ==========================================================
  // SERVER RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          ARTICLE STRUCTURED DATA
      ====================================================== */}

      <ArticleSchema
        article={clientArticle}
      />

      {/* ======================================================
          ARTICLE PAGE
      ====================================================== */}

      <InsightArticleClient
        article={clientArticle}
        articles={articles}
        articleContent={articleContent}
      />
    </>
  );
}