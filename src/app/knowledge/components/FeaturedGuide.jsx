"use client";

export default function FeaturedGuide() {
  return (
    <section
      className="
      rounded-2xl
      border
      bg-white
      shadow-sm
      overflow-hidden
      "
    >

      <div
        className="
        grid
        lg:grid-cols-2
        items-center
        "
      >

        <div className="p-10">

          <h2
            className="
            text-4xl
            font-serif
            text-[#111]
            "
          >
            Everything You Need to Know Before You Buy
          </h2>

          <p
            className="
            mt-6
            text-gray-600
            leading-8
            text-lg
            "
          >
            Explore our expert guides that walk you
            through every step of the home buying
            journey — from planning and
            shortlisting to paperwork and
            possession.
          </p>

        </div>

        <div className="h-full">

          <img
            src="/knowledge/featured-guide.jpg"
            alt=""
            className="
            w-full
            h-full
            object-cover
            "
          />

        </div>

      </div>

    </section>
  );
}