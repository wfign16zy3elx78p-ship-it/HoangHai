import { useState, useRef } from "react";
import modelsData from "../data/models.json";

type TabType = "electric" | "hybrid";

export default function Models() {
  const [activeTab, setActiveTab] = useState<TabType>("electric");
  const scrollRef = useRef<HTMLDivElement>(null);

  const models = modelsData[activeTab];

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section className="py-24" style={{ background: "linear-gradient(180deg, #080808 0%, #0d0d0d 100%)" }}>
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
              Lineup
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide uppercase">
              Our Models
            </h2>
          </div>

          {/* Glass Tab Toggle */}
          <div
            className="flex gap-1 p-1 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            {(["electric", "hybrid"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 text-xs font-bold tracking-[0.12em] uppercase rounded-xl"
                style={{
                  background: activeTab === tab ? "rgba(255,255,255,0.12)" : "transparent",
                  color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                  border: activeTab === tab ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                  boxShadow: activeTab === tab ? "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {tab === "electric" ? "Electric Cars" : "Hybrid Cars"}
              </button>
            ))}
          </div>
        </div>

        {/* Shimmer divider */}
        <div className="shimmer-line mb-10" />

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center -translate-x-5"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
          >
            {models.map((model) => (
              <a
                key={model.name}
                href={model.link}
                className="group flex-shrink-0 w-[280px] rounded-[20px] overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.08)";
                  el.style.borderColor = "rgba(255,255,255,0.2)";
                  el.style.boxShadow = "0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)";
                  el.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(255,255,255,0.04)";
                  el.style.borderColor = "rgba(255,255,255,0.09)";
                  el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Image */}
                <div className="h-[175px] overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <img
                    src={model.img}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105"
                    style={{ transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.6))" }}
                  />
                </div>

                {/* Info */}
                <div className="p-5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 className="text-sm font-bold text-white tracking-[0.1em] uppercase mb-1">
                    {model.name}
                  </h3>
                  <p className="text-xs text-white/50 mb-4">{model.desc}</p>
                  <div
                    className="flex items-center gap-1.5 text-[10px] font-bold text-white/60 group-hover:text-white tracking-[0.15em] uppercase"
                    style={{ transition: "color 0.25s ease" }}
                  >
                    EXPLORE MORE
                    <svg
                      className="w-3.5 h-3.5 group-hover:translate-x-1"
                      style={{ transition: "transform 0.25s ease" }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center translate-x-5"
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              transition: "all 0.25s ease",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
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
