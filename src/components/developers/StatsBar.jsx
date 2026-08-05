"use client";

import {
  ShieldCheck,
  Building2,
  Users,
  Gem,
  BadgeCheck,
} from "lucide-react";

const stats = [
  {
    icon: ShieldCheck,
    value: "50+",
    label: "Top Developers",
  },
  {
    icon: Building2,
    value: "100+",
    label: "Projects Available",
  },
  {
    icon: Users,
    value: "1000+",
    label: "Happy Clients",
  },
  {
    icon: Gem,
    value: "5+",
    label: "Years of Excellence",
  },
  {
    icon: BadgeCheck,
    value: "Trusted",
    label: "Partnerships",
  },
];

export default function StatsBar() {
  return (
    <section className="relative z-20 -mt-16 px-5 lg:px-8">
      <div className="max-w-[1380px] mx-auto">

        <div
          className="
            rounded-[28px]
            border border-[#d4af37]/20
            bg-[#04110d]/95
            backdrop-blur-xl
            overflow-hidden
            shadow-[0_25px_70px_rgba(0,0,0,0.35)]
          "
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="
                    relative
                    flex
                    items-center
                    gap-5
                    px-7
                    py-8
                  "
                >
                  {/* Divider */}

                  {index !== stats.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-12 w-px bg-[#d4af37]/20" />
                  )}

                  {/* Icon */}

                  <div
                    className="
                      h-12
                      w-12
                      rounded-xl
                      border
                      border-[#d4af37]/25
                      bg-[#d4af37]/5
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.8}
                      className="text-[#d4af37]"
                    />
                  </div>

                  {/* Text */}

                  <div>

                    <h3
                      className="
                        text-white
                        text-[34px]
                        leading-none
                        font-light
                      "
                    >
                      {item.value}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-white/70
                        text-[14px]
                        leading-5
                      "
                    >
                      {item.label}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

      </div>
    </section>
  );
}