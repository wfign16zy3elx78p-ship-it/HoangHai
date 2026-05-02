import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "../lib/router";

/* ─── Placeholder / lazy image ─── */
function Img({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={`flex items-center justify-center ${className ?? ""}`}
        style={{ background: "linear-gradient(135deg,#181818 0%,#111 100%)" }}>
        <span className="text-white/10 text-[10px] tracking-widest uppercase font-bold text-center px-4">{alt}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setErrored(true)} />;
}

/* ─── Animated counter ─── */
function Counter({ to, unit, running }: { to: string; unit: string; running: boolean }) {
  const num = parseFloat(to.replace(/,/g, ""));
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!running) return;
    const steps = 50; let i = 0;
    const id = setInterval(() => {
      i++;
      setVal(+(Math.min((num * i) / steps, num).toFixed(num % 1 !== 0 ? 1 : 0)));
      if (i >= steps) clearInterval(id);
    }, 1400 / steps);
    return () => clearInterval(id);
  }, [running, num]);
  return (
    <span>
      {num % 1 !== 0 ? val.toFixed(1) : val.toLocaleString()}
      <span className="text-[0.52em] opacity-50 font-semibold ml-1">{unit}</span>
    </span>
  );
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
        {/* Text side */}
        <div className="flex flex-col justify-center px-6 py-12 md:px-16 lg:px-20 md:w-[40%] border-b md:border-b-0 md:border-r border-white/5">
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/35 mb-4">{label}</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-5 text-white">{title}</h2>
          <div className="w-10 h-0.5 bg-white/20 mb-6" />
          <p className="text-sm leading-relaxed text-white/45 max-w-md">{body}</p>
          {extra && <div className="mt-8">{extra}</div>}
        </div>
        {/* Image side */}
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

/* ─── Card item ─── */
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

/* ─── P7 card item ─── */
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

/* ══════════════════════════════════════════════════════════
   SEALION 7 PAGE
══════════════════════════════════════════════════════════ */
const ANCHORS = ["Exterior", "Interior", "Charging", "Performance", "Technology", "Safety", "Connectivity", "V2L"];

export default function Sealion7Page() {
  const { navigate } = useRouter();
  const [heroReady, setHeroReady] = useState(false);
  const [statsVis, setStatsVis] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("Exterior");
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

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

  const scrollTo = (id: string) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen" style={{ fontFamily: "Montserrat, sans-serif" }}>
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative w-full h-screen min-h-[560px] overflow-hidden bg-black">
        <Img
          src="/images/BYD-SEALION-7.webp"
          alt="BYD SEALION 7"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: heroReady ? "scale(1)" : "scale(1.06)",
            transition: "transform 7s cubic-bezier(0.25,0.46,0.45,0.94)",
          } as React.CSSProperties}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 80%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 60%)" }} />

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
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase text-white/50 mb-2 md:mb-3">Electric Performance SUV</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-none mb-6 md:mb-8"
            style={{ textShadow: "0 4px 32px rgba(0,0,0,0.6)" }}>
            BYD SEALION 7
          </h1>

          {/* Stats bar — horizontal scroll on mobile */}
          <div
            ref={statsRef}
            className="flex w-full max-w-xl overflow-x-auto no-scrollbar rounded-sm"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {[
              { val: "23000", unit: "RPM", label: "Motor speed" },
              { val: "215", unit: "km/h", label: "Top speed" },
              { val: "91.3", unit: "kWh", label: "Battery" },
            ].map((s, i) => (
              <div key={i} className="flex-1 min-w-[110px] px-4 sm:px-6 py-4 sm:py-5"
                style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <p className="text-lg sm:text-xl md:text-2xl font-extrabold mb-1">
                  <Counter to={s.val} unit={s.unit} running={statsVis} />
                </p>
                <p className="text-[9px] font-semibold text-white/45 tracking-[0.12em] uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue — hidden on small mobile */}
        <div className="hidden sm:flex absolute bottom-6 right-8 md:right-16 flex-col items-center gap-1.5 opacity-30">
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
              onClick={() => scrollTo(a)}
              className="flex-shrink-0 px-4 md:px-5 py-4 text-[10px] font-bold tracking-[0.16em] uppercase cursor-pointer transition-all duration-200"
              style={{
                color: activeAnchor === a ? "#fff" : "rgba(255,255,255,0.35)",
                background: "transparent",
                border: "none",
                borderBottom: activeAnchor === a ? "2px solid #fff" : "2px solid transparent",
                whiteSpace: "nowrap",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══ EXTERIOR ═══ */}
      <div id="exterior">
        <Chapter
          id="exterior-chapter" label="Exterior" title="Ocean aesthetics with a dynamic edge"
          body="Designed by BYD's Global Design Director, Wolfgang Egger, the BYD SEALION 7 is more than just an SUV — it's a lifestyle statement. Its sleek, flowing lines and aerodynamic profile give the SEALION 7 a sporty, futuristic look that turns heads wherever you go."
          imgSrc="/images/sealion-7-exterior-01.jpg" imgAlt="SEALION 7 Exterior"
        />
        <FeatureRow
          title="Dynamic water drop tail lamps"
          body="The SEALION 7's futuristic tail lamps combine sleek linear light strips with water-drop-shaped dots, creating a sense of movement and energy that stands out on the road."
          imgSrc="/images/sealion-7-exterior-03.jpg" imgAlt="Tail Lamps"
        />
        <FeatureRow
          title="Intelligent and effortless tailgate"
          body="With an electric tailgate that opens with just a simple foot gesture, loading and unloading is seamless. The intelligent anti-pinch system and customisable stopping positions enhance both safety and convenience."
          imgSrc="/images/sealion-7-exterior-04.jpg" imgAlt="Electric Tailgate" reverse
        />
      </div>

      {/* ═══ INTERIOR ═══ */}
      <div id="interior">
        <Chapter
          id="interior-chapter" label="Interior" title="Reinventing the senses"
          body="Inspired by the dynamic flow and speed of sailboat racing, the BYD SEALION 7's interior embodies movement, suspension, and volume — creating a cohesive atmosphere where every element feels like it's floating in harmony with the waves."
          imgSrc="/images/sealion-7-interior-01.jpg" imgAlt="SEALION 7 Interior"
        />
        <FeatureRow
          title={`15.6" rotating centre screen`}
          body={`A 15.6" rotating touchscreen adapts to your every need. Whether navigating through a city or winding down with your favourite playlist, this screen keeps you always connected and in control.`}
          imgSrc="/images/sealion-7-interior-02.jpg" imgAlt="Rotating Screen"
        />
        <FeatureRow
          title="Unmatched comfort"
          body="Sink into premium quilted Nappa leather seats, surrounded by soft vegan leather covering over 80% of the interior — a tactile experience that elevates every journey."
          imgSrc="/images/sealion-7-interior-03.jpg" imgAlt="Interior Seats" reverse
        />
        <CardGrid items={[
          { title: "Adaptive ambience", imgSrc: "/images/sealion-7-interior-04.jpg", body: "128-colour ambient lighting creates the perfect environment — calming after a long day or energising for an early commute." },
          { title: "Head-up display", imgSrc: "/images/sealion-7-interior-08.jpg", body: "Essential driving information projected directly onto the windshield, keeping your eyes on the road at all times." },
          { title: "Panoramic sunroof", imgSrc: "/images/sealion-7-interior-09.jpg", body: "The panoramic sunroof fills the cabin with natural light — an electric sunshade provides shade and comfort without compromise." },
        ]} />
      </div>

      {/* ═══ CHARGING ═══ */}
      <div id="charging">
        <Chapter
          id="charging-chapter" label="Charging" title="Fast and efficient charging"
          body="Stay on the go with rapid DC charging up to 230 kW — the SEALION 7 Excellence AWD charges from 10% to 80% in just 24 minutes. Spend less time waiting and more time living."
          imgSrc="/images/sealion-7-charging-01.jpg" imgAlt="SEALION 7 Charging"
        />
      </div>

      {/* ═══ PERFORMANCE ═══ */}
      <div id="performance">
        <Chapter
          id="performance-chapter" label="Performance" title="Drive with purpose"
          body="Feel the thrill of high-performance driving with an electric motor reaching 23,000 RPM. The AWD version sprints from 0–100 km/h in just 4.5 seconds with a top speed of 215 km/h."
          imgSrc="/images/sealion-7-performance-01.jpg" imgAlt="SEALION 7 Performance"
        />
      </div>

      {/* ═══ TECHNOLOGY ═══ */}
      <div id="technology">
        <Chapter
          id="technology-chapter" label="Technology" title="BYD Blade Battery"
          body="BYD has been a pioneering name in the battery industry for more than 29 years. Our latest game-changing Blade Battery has passed a series of extreme tests in rigorous conditions — making it one of the world's safest batteries."
          imgSrc="/images/sealion-7-battery-01.jpg" imgAlt="BYD Blade Battery"
          extra={
            <a href="#" className="inline-block px-6 py-3 text-[10px] font-bold tracking-[0.18em] uppercase text-white border border-white/30 transition-all duration-200 hover:bg-white/10">
              Learn More
            </a>
          }
        />
        <CardGrid items={[
          { title: "CTB Cell-to-Body Technology", imgSrc: "/images/sealion-7-tech-02.jpg", body: "BYD's innovative CTB technology integrates the Blade Battery directly into the vehicle's structure, providing unparalleled strength and rigidity." },
          { title: "World's first 8-in-1 powertrain", imgSrc: "/images/sealion-7-tech-03.jpg", body: "BYD integrates 8 key components into the world's first mass-produced 8-in-1 electric powertrain, optimising space and energy efficiency." },
          { title: "High efficiency heat pump", imgSrc: "/images/sealion-7-tech-01.jpg", body: "Advanced energy-saving heat pump reliably operates in a broad range of temperatures, enhancing efficiency and increasing driving range in cold weather." },
        ]} />
      </div>

      {/* ═══ SAFETY ═══ */}
      <div id="safety">
        <Chapter
          id="safety-chapter" label="Safety" title="iTAC — intelligence Torque Adaption Control"
          body="Rather than simply reducing power, iTAC intelligently allocates drive torque, efficiently minimises or eliminates skidding, and elevates handling comfort for a smooth and secure driving experience in all conditions."
          imgSrc="/images/sealion-7-itac.jpg" imgAlt="iTAC System"
        />
        <P7Cards items={[
          { title: "Advanced suspension system", imgSrc: "/images/sealion-7-innovation-01.jpg", body: "Front double-wishbone and rear multi-link suspension with FSD shock absorbers adjust in real-time to deliver a smooth, stable ride across all road conditions." },
          { title: "Intelligent driving assistance", imgSrc: "/images/sealion-7-innovation-02.jpg", body: "BYD's state-of-the-art ADAS and 360° panoramic cameras monitor surroundings continuously, making every drive a stress-free experience." },
        ]} />
      </div>

      {/* ═══ CONNECTIVITY ═══ */}
      <div id="connectivity">
        <P7Cards items={[
          { title: "Connectivity that keeps you ahead", imgSrc: "/images/sealion-7-connectivity-01.jpg", body: "From four-zone voice control to Android Auto and Apple CarPlay integration, every feature keeps you effortlessly connected. OTA updates ensure your vehicle always runs the latest software." },
          { title: "Total control, anywhere", imgSrc: "/images/sealion-7-connectivity-02.jpg", body: "NFC card or BYD app lets you unlock your car with a tap. Remote A/C and scheduled charging from your smartphone — the SEALION 7 is always ready when you are." },
        ]} />
      </div>

      {/* ═══ V2L ═══ */}
      <div id="v2l">
        <Chapter
          id="v2l-chapter" label="V2L" title="Power on demand"
          body="Vehicle-to-Load (V2L) functionality empowers your adventures. Whether camping or in an emergency, the SEALION 7 supplies energy to your devices and appliances — transforming your vehicle into a reliable power station."
          imgSrc="/images/sealion-7-v2l-01.jpg" imgAlt="SEALION 7 V2L"
        />
      </div>

      {/* ═══ ORDER CTA ═══ */}
      <section className="px-6 md:px-16 py-16 md:py-24 text-center border-t border-white/6" style={{ background: "#050505" }}>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-4">Ready to Drive</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3">BYD SEALION 7</h2>
        <p className="text-sm text-white/40 mb-10 max-w-xs mx-auto">Electric Performance SUV — Up to 502 km range</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="w-full sm:w-auto px-10 py-4 text-[11px] font-bold tracking-[0.18em] uppercase bg-white text-black border-none cursor-pointer transition-colors hover:bg-white/85">
            Configure Now
          </button>
          <button className="w-full sm:w-auto px-10 py-4 text-[11px] font-bold tracking-[0.18em] uppercase bg-transparent text-white cursor-pointer transition-colors hover:bg-white/8"
            style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
            Book a Test Drive
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
