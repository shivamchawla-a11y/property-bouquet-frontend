
import { cache, Suspense } from "react";
import { notFound } from "next/navigation";

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
// FETCH SINGLE ARTICLE
// SERVER SIDE + REQUEST CACHE
// ============================================================

const getArticle = cache(async function getArticle(slug) {
  try {
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
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data?.data || null;

  } catch (error) {
    console.error(
      "Knowledge article fetch error:",
      error
    );

    return null;
  }
});

// ============================================================
// FETCH ALL ARTICLES
// SERVER SIDE + REQUEST CACHE
// ============================================================

const getAllArticles = cache(async function getAllArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge`,
      {
        next: {
          revalidate: REVALIDATE_SECONDS,
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
// TEXT CLEANER
// ============================================================

function stripHtml(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ============================================================
// DESCRIPTION BUILDER
// ============================================================

function getArticleDescription(article) {
  const candidates = [
    article?.seoEngine?.metaDescription,
    article?.metaDescription,
    article?.description,
    article?.excerpt,
    article?.summary,
    article?.content,
    article?.body,
  ];

  for (const candidate of candidates) {
    const cleaned = stripHtml(candidate);

    if (cleaned.length >= 50) {
      return cleaned.slice(0, 160);
    }
  }

  return "Read expert real estate insights, guides and property knowledge from Property Bouquet.";
}

// ============================================================
// TITLE BUILDER
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
// IMAGE BUILDER
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

  for (const image of candidates) {
    if (!image) {
      continue;
    }

    const value = String(image).trim();

    if (!value) {
      continue;
    }

    try {
      const imageUrl = new URL(value, SITE_URL);

      if (
        imageUrl.protocol === "https:" ||
        imageUrl.protocol === "http:"
      ) {
        return imageUrl.toString();
      }

    } catch {
      continue;
    }
  }

  return `${SITE_URL}/logo.png`;
}

// ============================================================
// ROBOTS / INDEXABILITY
// ============================================================

function isArticleIndexable(article) {
  if (!article) {
    return false;
  }

  if (article.isDeleted === true) {
    return false;
  }

  if (article.isActive === false) {
    return false;
  }

  if (
    article.status !== undefined &&
    article.status !== null &&
    article.status !== "published"
  ) {
    return false;
  }

  return true;
}

// ============================================================
// GENERATE METADATA
// ============================================================

export async function generateMetadata({ params }) {
  const { slug } = await params;

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

  const clean = cleanSlug(
    article.slug || slug
  );

  const title = getArticleTitle(article);

  const description =
    getArticleDescription(article);

  const image = getArticleImage(article);

  const canonicalUrl =
    `${SITE_URL}/knowledge/${encodeURIComponent(clean)}`;

  // Do not index draft, deleted or inactive articles.

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

  return {
    title,

    description,

    keywords:
      article?.seoEngine?.keywords ||
      article?.keywords ||
      undefined,

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "article",

      url: canonicalUrl,

      title,

      description,

      siteName: "Property Bouquet",

      locale: "en_IN",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],

      publishedTime:
        article?.publishedAt ||
        article?.createdAt ||
        undefined,

      modifiedTime:
        article?.updatedAt ||
        article?.publishedAt ||
        article?.createdAt ||
        undefined,

      authors: [
        "Property Bouquet",
      ],
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: [image],
    },
  };
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
    <div
      className="mt-12"
      aria-hidden="true"
    >
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

  if (!Array.isArray(articles) || !articles.length) {
    return null;
  }

  const currentIndex = articles.findIndex(
    (item) => item.slug === article.slug
  );

  // Do not accidentally link to the first article
  // when the current article is absent from the list.

  if (currentIndex === -1) {
    return null;
  }

  const previousArticle =
    currentIndex < articles.length - 1
      ? articles[currentIndex + 1]
      : null;

  const nextArticle =
    currentIndex > 0
      ? articles[currentIndex - 1]
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
  const { slug } = await params;

  // Start both requests concurrently.

  const articlePromise = getArticle(slug);

  const articlesPromise = getAllArticles();

  // Wait only for the current article.

  const article = await articlePromise;

  // Return 404 if article does not exist.

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <Navbar forceSolid />

      {/* ==================================================
          MAIN ARTICLE
      ================================================== */}

      <main className="pt-20 lg:pt-26">

        {/* ARTICLE HERO */}

        <ArticleHero
          article={article}
        />

        {/* ==================================================
            ARTICLE BODY
        ================================================== */}

        <section className="bg-[#faf8f4] pb-24">

          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

            <div className="grid lg:grid-cols-12 gap-14">

              {/* ==========================================
                  MAIN ARTICLE CONTENT
              ========================================== */}

              <div className="lg:col-span-8 min-w-0">

                <ArticleContent
                  article={article}
                  navigation={
                    <Suspense
                      fallback={<ArticleNavigationLoading />}
                    >
                      <ArticleNavigationContent
                        article={article}
                        articlesPromise={articlesPromise}
                      />
                    </Suspense>
                  }
                />

              </div>

              {/* ==========================================
                  STATIC ARTICLE SIDEBAR
              ========================================== */}

              <div className="lg:col-span-4 min-w-0">

                <div className="lg:sticky lg:top-28 self-start">

                  <ArticleSidebar />

                </div>

              </div>

            </div>

            {/* ==========================================
                RELATED ARTICLES
                STREAMED INDEPENDENTLY
            ========================================== */}

            <Suspense
              fallback={<RelatedArticlesLoading />}
            >

              <RelatedArticlesContent
                article={article}
                articlesPromise={articlesPromise}
              />

            </Suspense>

          </div>

        </section>

      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <Footer />
    </>
  );
}
