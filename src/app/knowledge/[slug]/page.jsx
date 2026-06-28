import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import ArticleHero from "./components/ArticleHero";
import ArticleContent from "./components/ArticleContent";
import ArticleSidebar from "./components/ArticleSidebar";
import RelatedArticles from "./components/RelatedArticles";

export default function KnowledgeArticlePage() {
  return (
    <>
      <Navbar forceSolid />

      <ArticleHero />

      <section className="bg-[#faf8f4] pb-24">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

          <div className="grid lg:grid-cols-12 gap-14">

            <div className="lg:col-span-8">
              <ArticleContent />
            </div>

            <div className="lg:col-span-4">
              <ArticleSidebar />
            </div>

          </div>

          <RelatedArticles />

        </div>

      </section>

      <Footer />
    </>
  );
}