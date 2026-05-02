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
      }, 400);
    },
    [isTransitioning]
  );

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length);
  }, [current, goTo]);

  // Auto-advance: use video duration if slide has video, else 6s
  useEffect(() => {
    const vid = videoRefs.current[current];
    if (vid && heroSlides[current].video) {
      // Wait for video to end, then advance
      const handleEnded = () => next();
      vid.addEventListener("ended", handleEnded);
      return () => vid.removeEventListener("ended", handleEnded);
    } else {
      const timer = setInterval(next, 6000);
      return () => clearInterval(timer);
    }
  }, [current, next]);

  // Play/pause videos on slide change
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
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {s.video ? (
            <>
              {/* Video background */}
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={s.video}
                muted
                playsInline
                loop={false}
                preload={i === 0 ? "auto" : "none"}
                className="w-full h-full object-cover"
              />
              {/* Poster fallback while loading */}
              <img
                src={s.imgPc}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover -z-10"
              />
            </>
          ) : (
            <img
              src={s.imgPc}
              alt={s.title}
              className="w-full h-full object-cover object-center"
            />
          )}
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        </div>
      ))}

      {/* Slide Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 transition-opacity duration-300 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="max-w-[1440px] mx-auto w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-wider uppercase mb-3">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 font-light tracking-wide">
            {slide.subtitle}
          </p>
          <div className="flex gap-4 flex-wrap">
            {slide.btnList.map((btn, i) => (
              <a
                key={i}
                href={btn.link}
                className={`inline-block px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-200 ${
                  btn.type === 1
                    ? "bg-white text-[#1b1b1b] hover:bg-gray-100"
                    : "border-2 border-white text-white hover:bg-white hover:text-[#1b1b1b]"
                }`}
              >
                {btn.text}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroSlides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            title={s.title}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Prev Arrow */}
      <button
        onClick={() => goTo((current - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white transition-colors rounded-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Arrow */}
      <button
        onClick={() => goTo((current + 1) % heroSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/30 hover:bg-black/50 text-white transition-colors rounded-full"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Video indicator badge */}
      {slide.video && (
        <div className="absolute top-24 right-6 flex items-center gap-1.5 bg-black/40 text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          VIDEO
        </div>
      )}
    </section>
  );
}
