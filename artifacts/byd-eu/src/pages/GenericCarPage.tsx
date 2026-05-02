import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "../lib/router";
import carDetailsData from "../data/carDetails.json";

type CarData = {
  slug: string; name: string; tagline: string; description: string;
  heroImg: string; heroVideo?: string | null; color: string;
  stats: { label: string; value: number; unit: string; suffix: string }[];
  features: { title: string; subtitle: string; desc: string; img: string; imgRight: boolean }[];
  specs: Record<string, { label: string; value: string }[]>;
};

/* ─── Placeholder Image ─── */
function Img({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={`flex items-center justify-center ${className ?? ""}`}
        style={{ background: "linear-gradient(135deg,#181818 0%,#111 100%)" }}>
        <span className="text-white/10 text-[10px] tracking-widest uppercase font-bold text-center px-6">{alt}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setErr(true)} />;
}

/* ─── Animated counter ─── */
function Counter({ to, unit, suffix, running }: { to: number; unit: string; suffix: string; running: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!running) return;
    const steps = 50; let i = 0;
    const id = setInterval(() => {
      i++;
      const v = Math.min((to * i) / steps, to);
      setVal(to % 1 !== 0 ? +v.toFixed(1) : Math.round(v));
      if (i >= steps) clearInterval(id);
    }, 1400 / steps);
    return () => clearInterval(id);
  }, [running, to]);
  const display = to % 1 !== 0 ? val.toFixed(1) : val.toLocaleString();
  return <span>{display}{suffix}<span className="text-[0.5em] opacity-50 font-semibold ml-1">{unit}</span></span>;
}

/* ─── Fade-in hook ─── */
function useFadeIn(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return { ref, vis };
}

/* ─── Feature Row ─── */
function FeatureRow({ feature, index }: { feature: CarData["features"][0]; index: number }) {
  const { ref, vis } = useFadeIn(0.1);
  const reverse = feature.imgRight;
  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} border-t border-white/5`}
      style={{
        background: index % 2 === 0 ? "#0a0a0a" : "#080808",
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : `translateX(${reverse ? 40 : -40}px)`,
        transition: "opacity 0.85s ease, transform 0.85s ease",
      }}
    >
      <div className="w-full md:w-[55%] h-64 sm:h-80 md:h-[520px] overflow-hidden">
        <Img src={feature.img} alt={feature.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
      </div>
      <div className="flex flex-col justify-center px-6 py-10 md:px-14 lg:px-20 md:w-[45%]">
        <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/35 mb-3">{feature.subtitle}</p>
        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 leading-tight">{feature.title}</h3>
        <div className="w-10 h-0.5 bg-white/20 mb-5" />
        <p className="text-sm leading-relaxed text-white/45 max-w-md">{feature.desc}</p>
      </div>
    </div>
  );
}

/* ─── Specs Tab ─── */
function SpecsSection({ specs }: { specs: CarData["specs"] }) {
  const tabs = Object.keys(specs);
  const [active, setActive] = useState(tabs[0]);
  const { ref, vis } = useFadeIn(0.05);
  return (
    <section id="specs" className="border-t border-white/5 py-16 md:py-24 px-4 sm:px-8 md:px-16" style={{ background: "#060606" }}>
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Technical Data</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-10">Specifications</h2>

        {/* Tab selector */}
        <div className="flex overflow-x-auto no-scrollbar gap-1 mb-10 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="flex-shrink-0 px-4 py-2 text-[10px] font-bold tracking-[0.14em] uppercase rounded-lg transition-all duration-200"
              style={{
                background: active === tab ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                color: active === tab ? "#fff" : "rgba(255,255,255,0.4)",
                border: active === tab ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Spec rows */}
        <div className="max-w-2xl">
          {specs[active]?.map((row, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-4 border-b border-white/6"
              style={{ borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <span className="text-sm text-white/45 font-medium">{row.label}</span>
              <span className="text-sm text-white font-bold tracking-wide">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   GENERIC CAR PAGE
══════════════════════════════════════════════════ */
export default function GenericCarPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const allCars = carDetailsData as Record<string, CarData>;
  const car = allCars[slug];

  const [heroReady, setHeroReady] = useState(false);
  const [statsVis, setStatsVis] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("Features");
  const statsRef = useRef<HTMLDivElement>(null);
  const ANCHORS = ["Features", "Specs", "Configure"];

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const anchors = ["configure", "specs", "features"];
      for (const a of anchors) {
        const el = document.getElementById(a);
        if (el && el.getBoundingClientRect().top <= 130) {
          setActiveAnchor(a.charAt(0).toUpperCase() + a.slice(1));
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <Header />
        <div className="text-center">
          <p className="text-white/40 text-sm mb-4">Model not found</p>
          <button onClick={() => navigate("/")} className="text-white underline text-sm">← Back to models</button>
        </div>
        <Footer />
      </div>
    );
  }

  const isHybrid = car.tagline.toLowerCase().includes("hybrid") || car.tagline.toLowerCase().includes("dm-i");

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative w-full h-screen min-h-[560px] overflow-hidden bg-black">
        <Img
          src={car.heroImg}
          alt={car.name}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: heroReady ? "scale(1)" : "scale(1.06)",
            transition: "transform 7s cubic-bezier(0.25,0.46,0.45,0.94)",
          } as React.CSSProperties}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, transparent 80%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)" }} />

        {/* Type badge */}
        <div className="absolute top-20 md:top-24 right-4 md:right-8 z-20 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase"
          style={{ background: isHybrid ? "rgba(120,200,80,0.15)" : "rgba(80,150,255,0.15)", border: isHybrid ? "1px solid rgba(120,200,80,0.3)" : "1px solid rgba(80,150,255,0.3)", color: isHybrid ? "rgba(160,230,100,0.9)" : "rgba(100,180,255,0.9)", backdropFilter: "blur(12px)" }}>
          {isHybrid ? "PLUG-IN HYBRID" : "ALL ELECTRIC"}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-20 md:top-24 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase text-white cursor-pointer"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M15 19l-7-7 7-7" /></svg>
          All Models
        </button>

        {/* Bottom content */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-16 pb-10 md:pb-14"
          style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "none" : "translateY(24px)", transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s" }}
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/50 mb-2">{car.tagline}</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6"
            style={{ textShadow: "0 4px 32px rgba(0,0,0,0.7)" }}>
            {car.name}
          </h1>

          {/* Stats bar */}
          <div
            ref={statsRef}
            className="flex w-full max-w-2xl overflow-x-auto no-scrollbar rounded-sm"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {car.stats.map((s, i) => (
              <div key={i} className="flex-1 min-w-[100px] px-4 sm:px-5 py-4"
                style={{ borderRight: i < car.stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <p className="text-lg sm:text-xl md:text-2xl font-extrabold mb-1 leading-none">
                  <Counter to={s.value} unit={s.unit} suffix={s.suffix} running={statsVis} />
                </p>
                <p className="text-[9px] font-semibold text-white/40 tracking-[0.12em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden sm:flex absolute bottom-6 right-8 md:right-16 flex-col items-center gap-1.5 opacity-25">
          <span className="text-[9px] tracking-[0.32em] uppercase font-bold">Scroll</span>
          <div className="w-px h-8 bg-white/70" />
        </div>
      </section>

      {/* ═══ STICKY ANCHOR NAV ═══ */}
      <nav className="sticky top-16 z-40 border-b border-white/7"
        style={{ background: "rgba(10,10,10,0.94)", backdropFilter: "blur(20px)" }}>
        <div className="flex overflow-x-auto no-scrollbar px-2 md:px-0 md:justify-center">
          {ANCHORS.map((a) => (
            <button
              key={a}
              onClick={() => document.getElementById(a.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              className="flex-shrink-0 px-5 md:px-7 py-4 text-[10px] font-bold tracking-[0.16em] uppercase cursor-pointer transition-all duration-200"
              style={{
                color: activeAnchor === a ? "#fff" : "rgba(255,255,255,0.35)",
                background: "transparent", border: "none",
                borderBottom: activeAnchor === a ? "2px solid #fff" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >{a}</button>
          ))}
        </div>
      </nav>

      {/* ═══ INTRO DESCRIPTION ═══ */}
      <section id="features" className="px-4 sm:px-8 md:px-16 py-16 md:py-24 max-w-4xl"
        style={{ background: "#0a0a0a" }}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Overview</p>
        <p className="text-lg md:text-xl leading-relaxed text-white/55 font-light">{car.description}</p>
      </section>

      {/* ═══ FEATURES ═══ */}
      <div>
        {car.features.map((feature, i) => (
          <FeatureRow key={i} feature={feature} index={i} />
        ))}
      </div>

      {/* ═══ SPECS ═══ */}
      <SpecsSection specs={car.specs} />

      {/* ═══ CONFIGURE CTA ═══ */}
      <section id="configure" className="px-6 md:px-16 py-16 md:py-24 text-center border-t border-white/6" style={{ background: "#050505" }}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Ready to Drive</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{car.name}</h2>
        <p className="text-sm text-white/40 mb-10 max-w-sm mx-auto">{car.tagline}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto px-10 py-4 text-[11px] font-bold tracking-[0.18em] uppercase bg-white text-black border-none cursor-pointer transition-colors hover:bg-white/85">
            Configure Now
          </button>
          <button
            className="w-full sm:w-auto px-10 py-4 text-[11px] font-bold tracking-[0.18em] uppercase bg-transparent text-white cursor-pointer transition-colors hover:bg-white/8"
            style={{ border: "1px solid rgba(255,255,255,0.3)" }}
          >
            Book a Test Drive
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
