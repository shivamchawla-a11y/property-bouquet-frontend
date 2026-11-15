
import KnowledgeCard from "./KnowledgeCard";

// ======================================================
// KNOWLEDGE GRID
// SERVER COMPONENT
// ======================================================

export default function KnowledgeGrid({
  articles = [],
  totalCount = 0,
  onClearFilters,
}) {

  // ====================================================
  // EMPTY STATE
  // ====================================================

  if (!Array.isArray(articles) || articles.length === 0) {

    return (

      <div
        className="
          rounded-2xl
          border
          border-[#eae4d9]
          bg-white
          px-6
          py-16
          text-center
        "
      >

        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#f5f0e6]
            text-2xl
            text-[#b88638]
          "
        >
          ✦
        </div>

        <h3
          className="
            mt-5
            text-2xl
            text-[#163629]
          "
          style={{
            fontFamily: "Georgia, serif",
          }}
        >
          No Matching Articles
        </h3>

        <p
          className="
            mx-auto
            mt-3
            max-w-md
            text-sm
            leading-7
            text-gray-500
          "
        >
          We couldn't find an article matching
          your current selection. Try another
          category or search term.
        </p>

        {onClearFilters && (

          <button
            type="button"
            onClick={onClearFilters}
            className="
              mt-6
              rounded-full
              bg-[#163629]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-[#214a39]
            "
          >
            Clear Filters
          </button>

        )}

      </div>

    );
  }

  // ====================================================
  // ARTICLE GRID
  // ====================================================

  return (

    <section id="knowledge-article-results">

      <div
        className="
          grid
          grid-cols-1
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {articles.map((article) => (

          <KnowledgeCard
            key={article._id || article.slug}

            image={article.featuredImage}

            badge={article.category}

            title={article.title}

            description={
              article.shortDescription
            }

            href={`/knowledge/${article.slug}`}

            readTime={article.readTime}

            publishDate={
              article.publishDate ||
              article.createdAt
            }
          />

        ))}

      </div>

    </section>

  );
}
