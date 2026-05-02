import { useEffect, useRef, useState } from "react";
import carDetails from "../data/carDetails.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "../lib/router";

type CarData = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroImg: string;
  heroVideo: string | null;
  color: string;
  stats: { label: string; value: number; unit: string; suffix: string }[];
  features: { title: string; subtitle: string; desc: string; img: string; imgRight: boolean }[];
  specs: Record<string, { label: string; value: string }[]>;
};

function AnimatedNumber({
  target, unit, suffix, running,
}: {
  target: number; unit: string; suffix: string; running: boolean;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!running) return;
    const isDecimal = target % 1 !== 0;
    const steps = 60;
    const inc = target / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const val = Math.min(inc * step, target);
      setDisplay(isDecimal ? Math.round(val * 10) / 10 : Math.round(val));
      if (step >= steps) clearInterval(interval);
    }, 1800 / steps);
    return () => clearInterval(interval);
  }, [running, target]);

  return (
    <span>
      {display}{suffix}
      <span className="text-base ml-1 font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
        {unit}
      </span>
    </span>
  );
}

export default function CarDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const car = (carDetails as Record<string, CarData>)[slug];

  const [activeSpecTab, setActiveSpecTab] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);
  const statsRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setHeroLoaded(false);
    setStatsVisible(false);
    setVisibleFeatures([]);
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    if (!car) return;
    setActiveSpecTab(Object.keys(car.specs)[0]);
  }, [car]);

  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.25 }
    );
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [car]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    featureRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setVisibleFeatures((p) => [...new Set([...p, i])]); },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [car]);

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col bg-[#080808] text-white">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-8xl font-bold mb-6 opacity-10">404</p>
          <p className="text-white/40 mb-8 text-sm">Car model not found</p>
          <button onClick={() => navigate("/")} className="btn-glass-secondary">← Back to Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  const specTabs = Object.keys(car.specs);

  /* ─── glass helpers ─── */
  const glassPanel = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
  } as React.CSSProperties;

  return (
    <div className="bg-[#080808] text-white min-h-screen">
      <Header />

      {/* ══════════ HERO ══════════ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-black">
        {/* Background */}
        <img
          src={car.heroImg}
          alt={car.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: heroLoaded ? "scale(1)" : "scale(1.05)",
            transition: "transform 6s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
        {car.heroVideo && (
          <video
            src={car.heroVideo}
            poster={car.heroImg}
            autoPlay muted playsInline loop
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.28) 55%,transparent 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 52%)" }} />

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-24 left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-[0.15em] uppercase"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#fff",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            Object.assign((e.currentTarget as HTMLElement).style, {
              background: "rgba(255,255,255,0.16)",
              borderColor: "rgba(255,255,255,0.3)",
              boxShadow: "0 4px 16px rgba(255,255,255,0.08)",
            });
          }}
          onMouseLeave={(e) => {
            Object.assign((e.currentTarget as HTMLElement).style, {
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.14)",
              boxShadow: "none",
            });
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Models
        </button>

        {/* Hero text */}
        <div
          className="absolute inset-0 flex flex-col justify-end pb-24 px-8 md:px-16 lg:px-24 z-10"
          style={{
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s, transform 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s",
          }}
        >
          <div className="max-w-[1440px] mx-auto w-full">
            {/* Pill label */}
            <div
              className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white/55" />
              {car.tagline}
            </div>

            <h1
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold uppercase mb-8"
              style={{ letterSpacing: "0.02em", lineHeight: 1, textShadow: "0 4px 48px rgba(0,0,0,0.5)" }}
            >
              {car.name}
            </h1>

            <div className="flex gap-3 flex-wrap">
              <a
                href="#specs"
                className="btn-glass-primary"
                onClick={(e) => { e.preventDefault(); document.getElementById("specs")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                Configure
              </a>
              <button
                className="btn-glass-secondary"
                onClick={() => document.getElementById("overview")?.scrollIntoView({ behavior: "smooth" })}
              >
                Discover More
              </button>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] tracking-[0.35em] uppercase font-bold">Scroll</span>
          <div className="w-px h-8 animate-pulse" style={{ background: "rgba(255,255,255,0.6)" }} />
        </div>
      </section>

      {/* ══════════ OVERVIEW / STATS ══════════ */}
      <section id="overview" className="py-28" style={{ background: "#050505" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
                Overview
              </p>
              <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide mb-6">{car.name}</h2>
              <div className="shimmer-line mb-6" />
              <p className="text-white/45 text-sm leading-relaxed">{car.description}</p>
            </div>

            {/* Right stats */}
            <div ref={statsRef} className="grid grid-cols-2 gap-4">
              {car.stats.map((s) => (
                <div
                  key={s.label}
                  className="p-6 rounded-[20px]"
                  style={glassPanel}
                  onMouseEnter={(e) => {
                    Object.assign((e.currentTarget as HTMLElement).style, {
                      background: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(255,255,255,0.18)",
                    });
                  }}
                  onMouseLeave={(e) => {
                    Object.assign((e.currentTarget as HTMLElement).style, {
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.09)",
                    });
                  }}
                >
                  <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold">
                    <AnimatedNumber target={s.value} unit={s.unit} suffix={s.suffix} running={statsVisible} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section className="py-28" style={{ background: "#080808" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
              Features
            </p>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">What Makes It Special</h2>
          </div>

          <div className="space-y-28">
            {car.features.map((f, i) => (
              <div
                key={i}
                ref={(el) => { featureRefs.current[i] = el; }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center"
                style={{
                  opacity: visibleFeatures.includes(i) ? 1 : 0,
                  transform: visibleFeatures.includes(i) ? "translateY(0)" : "translateY(44px)",
                  transition: "opacity 0.75s cubic-bezier(0.4,0,0.2,1), transform 0.75s cubic-bezier(0.4,0,0.2,1)",
                }}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden rounded-[24px] ${f.imgRight ? "lg:order-2" : ""}`}
                  style={{
                    aspectRatio: "4/3",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 80px rgba(0,0,0,0.7)",
                  }}
                >
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover"
                    style={{ transition: "transform 0.6s ease" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.3) 0%,transparent 60%)" }} />
                </div>

                {/* Text */}
                <div className={f.imgRight ? "lg:order-1" : ""}>
                  <p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {f.subtitle}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-6">{f.title}</h3>
                  <div className="shimmer-line mb-6" />
                  <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ SPECS ══════════ */}
      <section id="specs" className="py-28" style={{ background: "#050505" }}>
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
              Specifications
            </p>
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-wide">Technical Details</h2>
          </div>

          {/* Tab bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {specTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSpecTab(tab)}
                style={{
                  padding: "9px 22px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  borderRadius: 12,
                  cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  background: activeSpecTab === tab ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  color: activeSpecTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                  border: activeSpecTab === tab ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: activeSpecTab === tab ? "0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" : "none",
                  transition: "all 0.25s ease",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Rows */}
          <div
            className="max-w-2xl mx-auto rounded-[24px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {(car.specs[activeSpecTab] ?? []).map((row, i, arr) => (
              <div
                key={row.label}
                className="flex items-center justify-between px-8 py-5"
                style={{
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{row.label}</span>
                <span className="text-sm font-bold text-white">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="py-28 relative overflow-hidden" style={{ background: "#030303" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${car.color}44 0%, transparent 62%)`,
            filter: "blur(56px)",
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
          <p className="text-[10px] font-bold tracking-[0.35em] uppercase mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Ready to Drive
          </p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase tracking-wide mb-4">{car.name}</h2>
          <p className="text-white/40 text-sm max-w-md mx-auto mb-10 leading-relaxed">{car.tagline}</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-glass-primary">Find a Dealer</button>
            <button className="btn-glass-secondary">Book Test Drive</button>
          </div>

          {/* Floating car image */}
          <div className="mt-16 relative">
            <div
              className="absolute bottom-0 left-0 right-0 h-2/3 pointer-events-none z-10"
              style={{ background: "linear-gradient(to bottom, transparent, #030303)" }}
            />
            <img
              src={car.heroImg}
              alt={car.name}
              className="w-full max-w-4xl mx-auto rounded-[24px] object-cover"
              style={{
                aspectRatio: "16/7",
                objectPosition: "center",
                filter: "brightness(0.75)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 40px 120px rgba(0,0,0,0.85)",
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
