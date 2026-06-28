import {
  ArrowRight,
  Download,
  FileText,
  Calculator,
} from "lucide-react";

const resources = [
  {
    title: "Home Buying Checklist",
    type: "PDF",
    icon: FileText,
  },
  {
    title: "Document Checklist",
    type: "PDF",
    icon: FileText,
  },
  {
    title: "Cost Calculator Sheet",
    type: "Excel",
    icon: Calculator,
  },
];

export default function FeaturedResources() {
  return (
    <section
      className="
      mt-16
      bg-white
      border
      border-[#e8dfcf]
      rounded-2xl
      overflow-hidden
      "
    >
      <div className="grid lg:grid-cols-12">

        {/* Left */}

        <div
          className="
          lg:col-span-4
          p-8
          flex
          items-center
          gap-6
          border-b
          lg:border-b-0
          lg:border-r
          border-[#ece5d8]
          "
        >
          <div
            className="
            w-16
            h-16
            rounded-full
            border
            border-[#c9a64b]
            flex
            items-center
            justify-center
            "
          >
            <Download
              className="text-[#c9a64b]"
              size={28}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-[#0f1720]">
              Free Resource Library
            </h3>

            <p className="text-gray-600 mt-2 leading-7">
              Download checklists,
              templates and guides to
              make your home buying
              journey easier.
            </p>
          </div>
        </div>

        {/* Resources */}

        <div className="lg:col-span-5 grid md:grid-cols-3">

          {resources.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="
                p-6
                border-r
                border-[#ece5d8]
                last:border-r-0
                flex
                gap-4
                items-start
                "
              >
                <Icon
                  className="text-[#c9a64b] mt-1"
                  size={22}
                />

                <div>
                  <h4 className="font-medium text-[#222] leading-6">
                    {item.title}
                  </h4>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.type}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}

        <div
          className="
          lg:col-span-3
          flex
          items-center
          justify-center
          p-8
          "
        >
          <button
            className="
            bg-[#c9a64b]
            hover:bg-[#b89236]
            transition
            text-[#111]
            font-semibold
            rounded-lg
            px-8
            py-4
            flex
            items-center
            gap-3
            "
          >
            VIEW ALL RESOURCES

            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}