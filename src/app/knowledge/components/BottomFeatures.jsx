import {
  ShieldCheck,
  BookOpen,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Curated Knowledge",
    desc: "Well-researched, updated by real estate experts",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Information",
    desc: "Accurate, transparent and 100% reliable",
  },
  {
    icon: BadgeCheck,
    title: "Practical & Actionable",
    desc: "Guides you can apply at every step",
  },
  {
    icon: Sparkles,
    title: "Always Updated",
    desc: "Latest changes in laws, market & policies",
  },
];

export default function BottomFeatures() {
  return (
    <section
      className="
      bg-[#06111d]
      rounded-2xl
      overflow-hidden
      "
    >
      <div className="grid lg:grid-cols-4">

        {features.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
              p-8
              border-r
              last:border-r-0
              border-[#1b2d3d]
              flex
              gap-5
              items-start
              "
            >
              <div
                className="
                w-14
                h-14
                rounded-full
                border
                border-[#c9a64b]
                flex
                items-center
                justify-center
                shrink-0
                "
              >
                <Icon
                  className="text-[#c9a64b]"
                  size={24}
                />
              </div>

              <div>
                <h3 className="text-white font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="text-gray-400 mt-2 leading-7 text-sm">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}