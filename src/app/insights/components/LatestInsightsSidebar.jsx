import Link from "next/link";
import Image from "next/image";

export default function LatestInsightsSidebar({ articles = [] }) {
  const latest = Array.isArray(articles)
    ? articles.filter((item) => item?.slug).slice(0, 4)
    : [];

  return (
    <div
      className="
        relative overflow-hidden rounded-[32px]
        border border-[#ebe5db]
        bg-gradient-to-b from-white to-[#fcfaf7]
        p-8 shadow-[0_20px_60px_rgba(0,0,0,.06)]
        transition-all duration-500
        hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(0,0,0,.09)]
        text-[#163629]
      "
    >
      <div
        className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#b88638]/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative">
        <p className="text-[11px] font-semibold uppercase tracking-[3px] text-[#805b1e]">
          Editorial Picks
        </p>

        <h3
          className="mt-2 text-[30px] leading-tight text-[#163629]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Latest Insights
        </h3>
      </div>

      <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#e6ddcf] to-transparent" />

      <div className="space-y-5">
        {latest.map((item, index) => (
          <Link
            key={item.slug}
            href={`/insights/${item.slug}`}
            className="
              group block rounded-2xl p-3 transition-all duration-300
              hover:bg-[#f8f4ec] hover:shadow-md
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-[#805b1e] focus-visible:ring-offset-2
            "
          >
            <div className="flex gap-4">
              <div className="relative h-[82px] w-[105px] shrink-0 overflow-hidden rounded-2xl bg-[#f1ece3]">
                {item.featuredImage ? (
                  <Image
                    src={item.featuredImage}
                    fill
                    alt=""
                    sizes="105px"
                    quality={70}
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#666666]">
                    Property insight
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#805b1e]">
                  Article {index + 1}
                </span>

                <h4 className="mt-2 text-[16px] font-semibold leading-7 text-[#163629] transition-colors group-hover:text-[#805b1e]">
                  {item.title}
                </h4>

                <p className="mt-3 text-sm text-[#666666]">
                  {item.readTime ? `${item.readTime} min read` : "Read article"}
                </p>
              </div>
            </div>
          </Link>
        ))}

        {latest.length === 0 && (
          <p className="rounded-xl bg-[#f8f4ec] p-4 text-sm text-[#666666]">
            More insights are coming soon.
          </p>
        )}
      </div>

      <Link
        href="/insights"
        className="
          mt-8 flex h-14 items-center justify-center rounded-full
          border border-[#cfa85d] bg-white font-semibold tracking-wide
          text-[#163629] shadow-sm transition-all duration-300
          hover:border-[#163629] hover:bg-[#163629] hover:text-white
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-[#805b1e] focus-visible:ring-offset-2
        "
      >
        VIEW ALL INSIGHTS →
      </Link>
    </div>
  );
}
