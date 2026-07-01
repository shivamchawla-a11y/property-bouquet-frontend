import { notFound } from "next/navigation";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import ArticleHero from "./components/ArticleHero";
import ArticleContent from "./components/ArticleContent";
import ArticleSidebar from "./components/ArticleSidebar";
import RelatedArticles from "./components/RelatedArticles";

const API = "https://property-bouquet-backend.onrender.com/api";

// =====================
// Fetch Single Article
// =====================

async function getArticle(slug) {
  try {
    const res = await fetch(
      `${API}/knowledge/slug/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    return data.data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// =====================
// Fetch All Articles
// =====================

async function getAllArticles() {
  try {
    const res = await fetch(
      `${API}/knowledge`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    return data.data || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// =====================
// Page
// =====================

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

              <ArticleSidebar
                article={article}
                articles={articles}
              />

            </div>

          </div>

          <RelatedArticles
  currentArticle={article}
  articles={articles}
/>

        </div>

      </section>

      <Footer />
    </>
  );
}