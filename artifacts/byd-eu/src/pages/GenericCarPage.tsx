import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "../lib/router";
import carDetailsData from "../data/carDetails.json";

type Feature = { title: string; subtitle: string; desc: string; img: string; imgRight: boolean };
type SpecRow = { label: string; value: string };
type CarData = {
  slug: string; name: string; tagline: string; description: string;
  heroImg: string; heroVideo?: string | null; color: string;
  stats: { label: string; value: number; unit: string; suffix: string }[];
  features: Feature[];
  specs: Record<string, SpecRow[]>;
};

/* ─── Placeholder / lazy image ─── */
function Img({ src, alt, className, style }: { src?: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className={`flex items-center justify-center ${className ?? ""}`} style={{ background: "linear-gradient(135deg,#181818 0%,#111 100%)", ...style }}>
        <span className="text-white/10 text-[10px] tracking-widest uppercase font-bold text-center px-6">{alt}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setErr(true)} />;
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
  return <span>{display}{suffix}<span className="text-[0.52em] opacity-50 font-semibold ml-1">{unit}</span></span>;
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

/* ─── Chapter (text | image) — stacks on mobile ─── */
function Chapter({ id, label, title, body, imgSrc, imgAlt, extra, reverse }: {
  id: string; label: string; title: string; body: string;
  imgSrc?: string; imgAlt: string; extra?: React.ReactNode; reverse?: boolean;
}) {
  const { ref, vis } = useFadeIn();
  return (
    <section id={id} className="border-t border-white/5" style={{ background: "#0a0a0a" }}>
      <div
        ref={ref}
        className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} min-h-0 md:min-h-[600px]`}
        style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition: "opacity 0.85s ease, transform 0.85s ease" }}
      >
        <div className="flex flex-col justify-center px-6 py-12 md:px-16 lg:px-20 md:w-[40%] border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/35 mb-4">{label}</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-5 text-white">{title}</h2>
          <div className="w-10 h-0.5 bg-white/20 mb-6" />
          <p className="text-sm leading-relaxed text-white/45 max-w-md">{body}</p>
          {extra && <div className="mt-8">{extra}</div>}
        </div>
        <div className="w-full md:w-[60%] h-64 sm:h-80 md:h-auto overflow-hidden">
          <Img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

/* ─── Feature row — stacks on mobile ─── */
function FeatureRow({ title, body, imgSrc, imgAlt, reverse }: {
  title: string; body: string; imgSrc?: string; imgAlt: string; reverse?: boolean;
}) {
  const { ref, vis } = useFadeIn(0.1);
  return (
    <div
      ref={ref}
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} min-h-0 md:min-h-[480px] border-t border-white/5`}
      style={{ background: "#0a0a0a", opacity: vis ? 1 : 0, transform: vis ? "none" : `translateX(${reverse ? 40 : -40}px)`, transition: "opacity 0.8s ease, transform 0.8s ease" }}
    >
      <div className="w-full md:w-[55%] h-64 sm:h-80 md:h-auto overflow-hidden">
        <Img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center px-6 py-10 md:px-14 lg:px-16 md:w-[45%]">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug">{title}</h3>
        <div className="w-8 h-0.5 bg-white/18 mb-5" />
        <p className="text-sm leading-relaxed text-white/42">{body}</p>
      </div>
    </div>
  );
}

/* ─── Card item (3-col grid) ─── */
function CardItem({ title, body, imgSrc, delay }: { title: string; body: string; imgSrc?: string; delay: number }) {
  const { ref, vis } = useFadeIn();
  return (
    <div
      ref={ref}
      className="flex flex-col border-t border-white/5 md:border-t-0 md:border-r last:border-r-0 last:border-t-0"
      style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}
    >
      <div className="h-52 sm:h-64 md:h-72 overflow-hidden">
        <Img src={imgSrc} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 md:p-8">
        <h4 className="text-base font-bold text-white mb-3 leading-snug">{title}</h4>
        <div className="w-7 h-0.5 bg-white/16 mb-3" />
        <p className="text-xs leading-relaxed text-white/40">{body}</p>
      </div>
    </div>
  );
}

/* ─── Card grid (1-col mobile → 3-col desktop) ─── */
function CardGrid({ items }: { items: { title: string; body: string; imgSrc?: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-white/5" style={{ background: "#0a0a0a" }}>
      {items.map((item, i) => (
        <CardItem key={i} title={item.title} body={item.body} imgSrc={item.imgSrc} delay={i * 0.12} />
      ))}
    </div>
  );
}

/* ─── P7 card item (2-col grid) ─── */
function P7CardItem({ title, body, imgSrc, delay }: { title: string; body: string; imgSrc?: string; delay: number }) {
  const { ref, vis } = useFadeIn();
  return (
    <div
      ref={ref}
      className="flex flex-col border-t border-white/5 md:border-t-0 md:border-r last:border-r-0"
      style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}
    >
      <div className="h-64 sm:h-80 md:h-[420px] overflow-hidden">
        <Img src={imgSrc} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 md:p-10 lg:p-12">
        <h3 className="text-lg md:text-xl font-bold text-white mb-4 leading-snug">{title}</h3>
        <div className="w-8 h-0.5 bg-white/16 mb-4" />
        <p className="text-sm leading-relaxed text-white/40">{body}</p>
      </div>
    </div>
  );
}

/* ─── P7 two-column cards (1-col mobile → 2-col desktop) ─── */
function P7Cards({ items }: { items: { title: string; body: string; imgSrc?: string }[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/5" style={{ background: "#0a0a0a" }}>
      {items.map((item, i) => (
        <P7CardItem key={i} title={item.title} body={item.body} imgSrc={item.imgSrc} delay={i * 0.15} />
      ))}
    </div>
  );
}

/* ─── Specs section with tabs ─── */
function SpecsSection({ specs }: { specs: CarData["specs"] }) {
  const tabs = Object.keys(specs);
  const [active, setActive] = useState(tabs[0]);
  const { ref, vis } = useFadeIn(0.05);
  return (
    <section id="specs" className="border-t border-white/5 py-16 md:py-24 px-4 sm:px-8 md:px-16" style={{ background: "#060606" }}>
      <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Technical Data</p>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-10">Specifications</h2>
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
            >{tab}</button>
          ))}
        </div>
        <div className="max-w-2xl">
          {specs[active]?.map((row, i) => (
            <div key={i} className="flex justify-between items-center py-4 border-b border-white/6"
              style={{ borderTop: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
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
   Build page-specific section content from car data
══════════════════════════════════════════════════ */
function buildSections(car: CarData) {
  const isHybrid = car.tagline.toLowerCase().includes("hybrid") || car.slug.includes("dm-i");
  const f = car.features;
  const perf = car.specs["Performance"] ?? [];
  const range = car.specs["Range & Charging"] ?? [];
  const tech = car.specs["Technology"] ?? [];

  /* Derive key specs as readable sentences */
  const topSpeed = perf.find(r => r.label.toLowerCase().includes("speed"))?.value ?? "";
  const sprint = perf.find(r => r.label.toLowerCase().includes("100"))?.value ?? "";
  const power = perf.find(r => r.label.toLowerCase().includes("output") || r.label.toLowerCase().includes("power"))?.value ?? "";
  const range_ = range.find(r => r.label.toLowerCase().includes("range"))?.value ?? "";
  const battery = range.find(r => r.label.toLowerCase().includes("battery"))?.value ?? "";
  const dcCharge = range.find(r => r.label.toLowerCase().includes("dc"))?.value ?? "";
  const display = tech.find(r => r.label.toLowerCase().includes("display"))?.value ?? "";
  const dipilot = tech.find(r => r.label.toLowerCase().includes("dipilot") || r.label.toLowerCase().includes("adas"))?.value ?? "";
  const v2l = tech.find(r => r.label.toLowerCase().includes("v2l"))?.value ?? "";
  const sound = tech.find(r => r.label.toLowerCase().includes("sound"))?.value ?? "";

  const ANCHORS = ["Design", "Performance", "Technology", "Specs", "Configure"];

  /* ─ Design section ─ */
  const design = {
    chapterLabel: "Design",
    chapterTitle: f[0]?.title ?? "Purposeful beauty",
    chapterBody: f[0]?.desc ?? car.description,
    chapterImg: f[0]?.img,
    featureRows: [
      f[1] ? { title: f[1].title, body: f[1].desc, img: f[1].img, reverse: false } : null,
      f[2] ? { title: f[2].title, body: f[2].desc, img: f[2].img, reverse: true } : null,
    ].filter(Boolean) as { title: string; body: string; img: string; reverse: boolean }[],
  };

  /* ─ Performance section ─ */
  const performanceBody = isHybrid
    ? `With ${power} of combined system power, the ${car.name} sprints from 0–100 km/h in ${sprint} and achieves a top speed of ${topSpeed}. BYD's Super DM hybrid system seamlessly blends electric and petrol power for an exhilarating yet efficient drive.`
    : `With ${power} of electric power and ${sprint} 0–100 km/h acceleration, the ${car.name} delivers a dynamic driving experience. The responsive electric motor provides instant torque for effortless overtaking and spirited performance at any speed.`;

  const performance = {
    chapterLabel: "Performance",
    chapterTitle: isHybrid ? "Super DM power on demand" : "Instant electric performance",
    chapterBody: performanceBody,
    chapterImg: f[1]?.img ?? f[0]?.img,
    p7Cards: [
      {
        title: isHybrid ? "Super DM hybrid system" : "Instant torque",
        body: isHybrid
          ? `The fifth-generation Super DM system delivers seamless transitions between electric and petrol power, maintaining peak efficiency throughout. Total system output reaches ${power} for a responsive driving experience.`
          : `Electric motors deliver power instantaneously — no hesitation, no lag. The ${car.name}'s ${power} motor responds to every input with precision, making every drive engaging and confidence-inspiring.`,
        img: f[1]?.img ?? "/images/2.webp",
      },
      {
        title: isHybrid ? `${range_} combined range` : `${range_} WLTP range`,
        body: isHybrid
          ? `With over ${battery ?? "15 kWh"} of battery capacity for pure EV driving and a petrol engine for extended journeys, the ${car.name} covers over ${range_} of total range — effectively eliminating range anxiety.`
          : `The ${battery} Blade Battery powers the ${car.name} for up to ${range_} on a single charge. Rapid DC charging at ${dcCharge} means you spend less time plugged in and more time on the road.`,
        img: f[2]?.img ?? "/images/1.webp",
      },
    ],
  };

  /* ─ Technology section ─ */
  const technology = {
    chapterLabel: "Technology",
    chapterTitle: "Intelligent by design",
    chapterBody: `The ${car.name} is equipped with BYD's latest DiLink technology platform — a fully connected, continually evolving digital ecosystem that makes every journey smarter. From voice control to over-the-air updates, technology works invisibly to enhance your life.`,
    chapterImg: f[2]?.img ?? f[1]?.img ?? "/images/2.webp",
    cardGrid: [
      {
        title: `${display} infotainment`,
        body: `The ${display} display brings the DiLink ecosystem to life — responsive, intuitive, and packed with features including Android Auto, Apple CarPlay, voice control, and real-time navigation.`,
        img: car.heroImg,
      },
      {
        title: `${dipilot} driver assistance`,
        body: `DiPilot driver assistance brings peace of mind to every journey. Adaptive cruise control, lane-keeping assistance, automatic emergency braking, and 360° cameras work together seamlessly.`,
        img: f[1]?.img ?? "/images/1.webp",
      },
      {
        title: v2l && v2l !== "No" ? `V2L — ${v2l} power export` : `${sound} audio system`,
        body: v2l && v2l !== "No"
          ? `Vehicle-to-Load (V2L) capability lets the ${car.name} power external devices and appliances — from camping equipment to emergency power needs. Your car becomes a portable power station.`
          : `The premium ${sound} audio system fills the cabin with rich, detailed sound. Carefully tuned for the acoustic properties of the ${car.name}'s interior, it creates an immersive listening experience.`,
        img: f[2]?.img ?? "/images/2.webp",
      },
    ],
  };

  return { ANCHORS, design, performance, technology };
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
  const [activeAnchor, setActiveAnchor] = useState("Design");
  const statsRef = useRef<HTMLDivElement>(null);

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

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
        <Header />
        <div className="text-center mt-32">
          <p className="text-white/40 text-sm mb-4">Model not found</p>
          <button onClick={() => navigate("/")} className="text-white underline text-sm">← Back to models</button>
        </div>
        <Footer />
      </div>
    );
  }

  const { ANCHORS, design, performance, technology } = buildSections(car);
  const isHybrid = car.tagline.toLowerCase().includes("hybrid") || car.slug.includes("dm-i");

  const scrollTo = (id: string) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  /* Active anchor tracking */
  useEffect(() => {
    const onScroll = () => {
      for (const a of [...ANCHORS].reverse()) {
        const el = document.getElementById(a.toLowerCase());
        if (el && el.getBoundingClientRect().top <= 130) { setActiveAnchor(a); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 80%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

        {/* Type badge */}
        <div
          className="absolute top-20 md:top-24 right-4 md:right-8 z-20 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase"
          style={{
            background: isHybrid ? "rgba(120,200,80,0.15)" : "rgba(80,150,255,0.15)",
            border: isHybrid ? "1px solid rgba(120,200,80,0.3)" : "1px solid rgba(80,150,255,0.3)",
            color: isHybrid ? "rgba(160,230,100,0.9)" : "rgba(100,180,255,0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
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

        {/* Bottom hero content */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-16 pb-10 md:pb-14"
          style={{ opacity: heroReady ? 1 : 0, transform: heroReady ? "none" : "translateY(24px)", transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s" }}
        >
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/50 mb-2 md:mb-3">{car.tagline}</p>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-none mb-6 md:mb-8"
            style={{ textShadow: "0 4px 32px rgba(0,0,0,0.6)" }}
          >
            {car.name}
          </h1>
          <div
            ref={statsRef}
            className="flex w-full max-w-xl overflow-x-auto no-scrollbar rounded-sm"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {car.stats.map((s, i) => (
              <div
                key={i}
                className="flex-1 min-w-[110px] px-4 sm:px-6 py-4 sm:py-5"
                style={{ borderRight: i < car.stats.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
              >
                <p className="text-lg sm:text-xl md:text-2xl font-extrabold mb-1">
                  <Counter to={s.value} unit={s.unit} suffix={s.suffix} running={statsVis} />
                </p>
                <p className="text-[9px] font-semibold text-white/45 tracking-[0.12em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hidden sm:flex absolute bottom-6 right-8 md:right-16 flex-col items-center gap-1.5 opacity-30">
          <span className="text-[9px] tracking-[0.32em] uppercase font-bold">Scroll</span>
          <div className="w-px h-8 bg-white/70" />
        </div>
      </section>

      {/* ═══ STICKY ANCHOR NAV ═══ */}
      <nav
        className="sticky top-16 z-40 border-b border-white/7"
        style={{ background: "rgba(10,10,10,0.94)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex overflow-x-auto no-scrollbar px-2 md:px-0 md:justify-center">
          {ANCHORS.map((a) => (
            <button
              key={a}
              onClick={() => scrollTo(a)}
              className="flex-shrink-0 px-4 md:px-5 py-4 text-[10px] font-bold tracking-[0.16em] uppercase cursor-pointer transition-all duration-200"
              style={{
                color: activeAnchor === a ? "#fff" : "rgba(255,255,255,0.35)",
                background: "transparent",
                border: "none",
                borderBottom: activeAnchor === a ? "2px solid #fff" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >{a}</button>
          ))}
        </div>
      </nav>

      {/* ═══ DESIGN ═══ */}
      <div id="design">
        <Chapter
          id="design-chapter"
          label={design.chapterLabel}
          title={design.chapterTitle}
          body={design.chapterBody}
          imgSrc={design.chapterImg}
          imgAlt={`${car.name} Design`}
        />
        {design.featureRows.map((row, i) => (
          <FeatureRow
            key={i}
            title={row.title}
            body={row.body}
            imgSrc={row.img}
            imgAlt={row.title}
            reverse={row.reverse}
          />
        ))}
      </div>

      {/* ═══ PERFORMANCE ═══ */}
      <div id="performance">
        <Chapter
          id="performance-chapter"
          label={performance.chapterLabel}
          title={performance.chapterTitle}
          body={performance.chapterBody}
          imgSrc={performance.chapterImg}
          imgAlt={`${car.name} Performance`}
          reverse
        />
        <P7Cards items={performance.p7Cards} />
      </div>

      {/* ═══ TECHNOLOGY ═══ */}
      <div id="technology">
        <Chapter
          id="technology-chapter"
          label={technology.chapterLabel}
          title={technology.chapterTitle}
          body={technology.chapterBody}
          imgSrc={technology.chapterImg}
          imgAlt={`${car.name} Technology`}
        />
        <CardGrid items={technology.cardGrid} />
      </div>

      {/* ═══ SPECS ═══ */}
      <SpecsSection specs={car.specs} />

      {/* ═══ CONFIGURE CTA ═══ */}
      <section id="configure" className="px-6 md:px-16 py-16 md:py-24 text-center border-t border-white/6" style={{ background: "#050505" }}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Ready to Drive</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">{car.name}</h2>
        <p className="text-sm text-white/40 mb-10 max-w-xs mx-auto">{car.tagline}</p>
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
