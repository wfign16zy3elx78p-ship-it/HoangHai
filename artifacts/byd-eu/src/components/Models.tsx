import { useState, useRef } from "react";
import modelsData from "../data/models.json";

type TabType = "electric" | "hybrid";

export default function Models() {
  const [activeTab, setActiveTab] = useState<TabType>("electric");
  const scrollRef = useRef<HTMLDivElement>(null);

  const models = modelsData[activeTab];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b1b1b] tracking-wide uppercase">
              Our Models
            </h2>
            <p className="mt-2 text-gray-500 text-sm tracking-wide">
              Discover the full BYD lineup
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border border-[#1b1b1b]">
            <button
              onClick={() => setActiveTab("electric")}
              className={`px-6 py-2.5 text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === "electric"
                  ? "bg-[#1b1b1b] text-white"
                  : "bg-white text-[#1b1b1b] hover:bg-gray-50"
              }`}
            >
              Electric Cars
            </button>
            <button
              onClick={() => setActiveTab("hybrid")}
              className={`px-6 py-2.5 text-sm font-bold tracking-wider uppercase transition-colors ${
                activeTab === "hybrid"
                  ? "bg-[#1b1b1b] text-white"
                  : "bg-white text-[#1b1b1b] hover:bg-gray-50"
              }`}
            >
              Hybrid Cars
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Scroll Left */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors -translate-x-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {models.map((model) => (
              <a
                key={model.name}
                href={model.link}
                className="group flex-shrink-0 w-[280px] md:w-[300px] bg-[#f5f5f5] hover:bg-[#ebebeb] transition-colors duration-200"
              >
                <div className="h-[180px] overflow-hidden">
                  <img
                    src={model.img}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#1b1b1b] tracking-wider uppercase">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{model.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-bold text-[#1b1b1b] tracking-wider uppercase">
                    EXPLORE MORE
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Scroll Right */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors translate-x-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
