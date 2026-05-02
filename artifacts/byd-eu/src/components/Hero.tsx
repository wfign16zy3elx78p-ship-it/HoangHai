import { useState, useEffect, useCallback, useRef } from "react";
import heroSlides from "../data/heroSlides.json";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  useEffect(() => {
    const vid = videoRefs.current[current];
    if (vid && heroSlides[current].video) {
      const handleEnded = () => next();
      vid.addEventListener("ended", handleEnded);
      return () => vid.removeEventListener("ended", handleEnded);
    } else {
      const timer = setInterval(next, 6000);
      return () => clearInterval(timer);
    }
  }, [current, next]);

  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === current) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [current]);

  const slide = heroSlides[current];

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-black">
      {/* Background Slides */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0"
          style={{
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.4,0,0.2,1)",
            zIndex: i === current ? 1 : 0,
          }}
        >
          <img
            src={s.imgPc}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {s.video && (
            <video
              ref={(el) => { videoRefs.current[i] = el; }}
              src={s.video}
              poster={s.imgPc}
              muted
              playsInline
              loop={false}
              preload={i === 0 ? "auto" : "metadata"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Layered gradient overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(105deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)"
          }} />
        </div>
      ))}

      {/* Content */}
      <div
        className="absolute inset-0 flex flex-col justify-end pb-28 px-8 md:px-16 lg:px-24"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.45s ease, transform 0.45s ease",
          zIndex: 10,
        }}
      >
        <div className="max-w-[1440px] mx-auto w-full">
          {/* Label pill */}
          <div
            className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-white/80"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.14)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            {slide.subtitle}
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase mb-8"
            style={{
              letterSpacing: "0.04em",
              textShadow: "0 2px 24px rgba(0,0,0,0.4)",
              lineHeight: 1.05,
            }}
          >
            {slide.title}
          </h1>

          <div className="flex gap-3 flex-wrap">
            {slide.btnList.map((btn, i) => (
              <a
                key={i}
                href={btn.link}
                className={btn.type === 1 ? "btn-glass-primary" : "btn-glass-secondary"}
                style={{ display: "inline-block" }}
              >
                {btn.text}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            title={s.title}
            style={{
              width: i === current ? 32 : 8,
              height: 8,
              borderRadius: 9999,
              background: i === current ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(4px)",
              transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              cursor: "pointer",
              boxShadow: i === current ? "0 0 12px rgba(255,255,255,0.4)" : "none",
            }}
          />
        ))}
      </div>

      {/* Arrows */}
      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          onClick={() =>
            goTo(dir === "prev"
              ? (current - 1 + heroSlides.length) % heroSlides.length
              : (current + 1) % heroSlides.length)
          }
          className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
          style={{
            [dir === "prev" ? "left" : "right"]: 20,
            width: 44,
            height: 44,
            borderRadius: 999,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "white",
            transition: "all 0.25s ease",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(255,255,255,0.12)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={dir === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
            />
          </svg>
        </button>
      ))}

      {/* Video badge */}
      {slide.video && (
        <div
          className="absolute top-24 right-8 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 z-20"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 999,
            padding: "6px 14px",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          LIVE
        </div>
      )}
    </section>
  );
}
