import { notFound } from "next/navigation";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import ArticleHero from "./components/ArticleHero";
import ArticleContent from "./components/ArticleContent";
import ArticleSidebar from "./components/ArticleSidebar";
import RelatedArticles from "./components/RelatedArticles";

const API = "https://propertybouquet.com/api";
const SITE_URL = "https://propertybouquet.com";


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
// ============================================================

async function getArticle(slug) {
  try {
    const clean = cleanSlug(slug);

    if (!clean) {
      return null;
    }

    const res = await fetch(
      `${API}/knowledge/slug/${encodeURIComponent(clean)}`,
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
      "Knowledge article fetch error:",
      err
    );

    return null;
  }
}


// ============================================================
// FETCH ALL ARTICLES
// ============================================================

async function getAllArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (err) {
    console.error(
      "Knowledge articles fetch error:",
      err
    );

    return [];
  }
}


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

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith("/")) {
      return `${SITE_URL}${value}`;
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

export async function generateMetadata({
  params,
}) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    return {
      title:
        "Knowledge Article | Property Bouquet",
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

  const title =
    getArticleTitle(article);

  const description =
    getArticleDescription(article);

  const image =
    getArticleImage(article);

  const canonicalUrl =
    `${SITE_URL}/knowledge/${encodeURIComponent(clean)}`;

  // ----------------------------------------------------------
  // IMPORTANT:
  // Do not allow draft/deleted articles to be indexed.
  // ----------------------------------------------------------

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
// PAGE
// ============================================================

export default async function KnowledgeArticlePage({
  params,
}) {
  const { slug } = await params;

  const [article, articles] =
    await Promise.all([
      getArticle(slug),
      getAllArticles(),
    ]);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar forceSolid />

      <main className="pt-20 lg:pt-26">
        <ArticleHero article={article} />

        <section className="bg-[#faf8f4] pb-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-14">

              <div className="lg:col-span-8">
                <ArticleContent
                  article={article}
                />
              </div>

              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28 self-start">
                  <ArticleSidebar
                    article={article}
                    articles={articles}
                  />
                </div>
              </div>

            </div>

            <RelatedArticles
              currentArticle={article}
              articles={articles}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}