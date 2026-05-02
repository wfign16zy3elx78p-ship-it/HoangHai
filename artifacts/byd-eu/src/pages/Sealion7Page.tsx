import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "../lib/router";

/* ─── Placeholder / lazy image ─── */
function Img({ src, alt, className, style }: { src?: string; alt: string; className?: string; style?: React.CSSProperties }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return (
      <div className={className} style={{ background: "linear-gradient(135deg,#181818 0%,#111 100%)", display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
        <span style={{ color: "rgba(255,255,255,0.14)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 700, textAlign: "center", padding: "0 20px" }}>{alt}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} onError={() => setErrored(true)} />;
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
  return <span>{num % 1 !== 0 ? val.toFixed(1) : val.toLocaleString()} <span style={{ fontSize: "0.52em", opacity: 0.55, fontWeight: 600 }}>{unit}</span></span>;
}

/* ─── p2 Chapter (text left | image right) ─── */
function Chapter({ id, label, title, body, imgSrc, imgAlt, extra }: {
  id: string; label: string; title: string; body: string;
  imgSrc?: string; imgAlt: string; extra?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <section id={id} style={{ background: "#0a0a0a" }}>
      <div ref={ref} style={{ display: "flex", flexDirection: "row", minHeight: 640, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition: "opacity 0.85s ease, transform 0.85s ease" }}>
        <div style={{ flex: "0 0 40%", padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>{label}</p>
          <h2 style={{ fontSize: "clamp(22px,2.4vw,38px)", fontWeight: 800, lineHeight: 1.18, marginBottom: 28, color: "#fff" }}>{title}</h2>
          <div style={{ width: 40, height: 2, background: "rgba(255,255,255,0.2)", marginBottom: 28 }} />
          <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.45)", maxWidth: 420 }}>{body}</p>
          {extra}
        </div>
        <div style={{ flex: "0 0 60%", overflow: "hidden" }}>
          <Img src={imgSrc} alt={imgAlt} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </div>
      </div>
    </section>
  );
}

/* ─── Alternating feature row ─── */
function FeatureRow({ title, body, imgSrc, imgAlt, reverse }: { title: string; body: string; imgSrc?: string; imgAlt: string; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: reverse ? "row-reverse" : "row", minHeight: 540, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0a0a", opacity: vis ? 1 : 0, transform: vis ? "none" : `translateX(${reverse ? 40 : -40}px)`, transition: "opacity 0.8s ease, transform 0.8s ease" }}>
      <div style={{ flex: "0 0 55%", overflow: "hidden" }}>
        <Img src={imgSrc} alt={imgAlt} style={{ objectFit: "cover", width: "100%", height: "100%", transition: "transform 0.7s ease" }} />
      </div>
      <div style={{ flex: "0 0 45%", padding: "72px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h3 style={{ fontSize: "clamp(18px,1.9vw,28px)", fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.35 }}>{title}</h3>
        <div style={{ width: 32, height: 2, background: "rgba(255,255,255,0.18)", marginBottom: 24 }} />
        <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.42)" }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── Single card (for p3 grid) ─── */
function CardItem({ title, body, imgSrc, delay, last }: { title: string; body: string; imgSrc?: string; delay: number; last: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", borderRight: !last ? "1px solid rgba(255,255,255,0.05)" : "none", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      <div style={{ height: 340, overflow: "hidden" }}>
        <Img src={imgSrc} alt={title} style={{ objectFit: "cover", width: "100%", height: "100%", transition: "transform 0.6s ease" }} />
      </div>
      <div style={{ padding: "36px 40px 44px" }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16, lineHeight: 1.4 }}>{title}</h4>
        <div style={{ width: 28, height: 2, background: "rgba(255,255,255,0.16)", marginBottom: 16 }} />
        <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.40)" }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── p3 card grid ─── */
function CardGrid({ items }: { items: { title: string; body: string; imgSrc?: string }[] }) {
  const cols = Math.min(items.length, 3);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0a0a" }}>
      {items.map((item, i) => (
        <CardItem key={i} title={item.title} body={item.body} imgSrc={item.imgSrc} delay={i * 0.12} last={i === items.length - 1} />
      ))}
    </div>
  );
}

/* ─── Single p7 card ─── */
function P7CardItem({ title, body, imgSrc, delay, isFirst }: { title: string; body: string; imgSrc?: string; delay: number; isFirst: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ borderRight: isFirst ? "1px solid rgba(255,255,255,0.05)" : "none", opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      <div style={{ height: 480, overflow: "hidden" }}>
        <Img src={imgSrc} alt={title} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      </div>
      <div style={{ padding: "40px 52px 52px" }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.35 }}>{title}</h3>
        <div style={{ width: 32, height: 2, background: "rgba(255,255,255,0.16)", marginBottom: 20 }} />
        <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.40)" }}>{body}</p>
      </div>
    </div>
  );
}

/* ─── p7 two-column cards ─── */
function P7Cards({ items }: { items: { title: string; body: string; imgSrc?: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0a0a" }}>
      {items.map((item, i) => (
        <P7CardItem key={i} title={item.title} body={item.body} imgSrc={item.imgSrc} delay={i * 0.15} isFirst={i === 0} />
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVis(true); }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      for (const a of [...ANCHORS].reverse()) {
        const el = document.getElementById(a.toLowerCase());
        if (el && el.getBoundingClientRect().top <= 120) { setActiveAnchor(a); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "Montserrat, sans-serif" }}>
      <Header />

      {/* ═══ HERO ═══ */}
      <section style={{ position: "relative", height: "100vh", minHeight: 640, overflow: "hidden", background: "#000" }}>
        <Img
          src="/images/sealion-7-hero.jpg"
          alt="BYD SEALION 7"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: heroReady ? "scale(1)" : "scale(1.06)", transition: "transform 7s cubic-bezier(0.25,0.46,0.45,0.94)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.28) 50%, transparent 80%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />

        {/* Back button */}
        <button onClick={() => navigate("/")} style={{ position: "absolute", top: 96, left: 32, zIndex: 20, display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M15 19l-7-7 7-7" /></svg>
          All Models
        </button>

        {/* Bottom content */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 60px 52px", opacity: heroReady ? 1 : 0, transform: heroReady ? "none" : "translateY(24px)", transition: "opacity 1s ease 0.2s, transform 1s ease 0.2s" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Electric Performance SUV</p>
          <h1 style={{ fontSize: "clamp(48px,6vw,90px)", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1, marginBottom: 40, textShadow: "0 4px 32px rgba(0,0,0,0.6)" }}>BYD SEALION 7</h1>

          {/* 3-stat bar */}
          <div ref={statsRef} style={{ display: "flex", maxWidth: 600, background: "rgba(0,0,0,0.52)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
            {[
              { val: "23000", unit: "RPM", label: "Motor speed" },
              { val: "215", unit: "km/h", label: "Top speed" },
              { val: "91.3", unit: "kWh", label: "Battery capacity" },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: "20px 24px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <p style={{ fontSize: "clamp(20px,2vw,28px)", fontWeight: 800, marginBottom: 4 }}>
                  <Counter to={s.val} unit={s.unit} running={statsVis} />
                </p>
                <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: 28, right: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.32 }}>
          <span style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 700 }}>Scroll</span>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.7)" }} />
        </div>
      </section>

      {/* ═══ STICKY ANCHOR NAV ═══ */}
      <nav style={{ position: "sticky", top: 64, zIndex: 40, background: "rgba(10,10,10,0.93)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {ANCHORS.map((a) => (
            <button key={a} onClick={() => scrollTo(a)} style={{ padding: "16px 24px", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: activeAnchor === a ? "#fff" : "rgba(255,255,255,0.35)", background: "transparent", border: "none", borderBottom: activeAnchor === a ? "2px solid #fff" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s ease" }}>
              {a}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══ EXTERIOR ═══ */}
      <div id="exterior">
        <Chapter
          id="exterior-chapter" label="Exterior" title="Ocean aesthetics with a dynamic edge"
          body="Designed by BYD's Global Design Director, Wolfgang Egger, the BYD SEALION 7 is more than just an SUV — it's a lifestyle statement. Seamlessly blending ocean-inspired aesthetics with cutting-edge innovation, this SUV is crafted for those who live life at full charge. Its sleek, flowing lines and aerodynamic profile give the SEALION 7 a sporty, futuristic look that turns heads wherever you go."
          imgSrc="/images/sealion-7-exterior-01.jpg" imgAlt="SEALION 7 Exterior"
        />
        <FeatureRow
          title="Dynamic water drop tail lamps"
          body="The SEALION 7's futuristic tail lamps combine sleek linear light strips with water-drop-shaped dots, creating a sense of movement and energy. These design elements evoke the high-speed motion of water droplets, giving this electric SUV a modern aesthetic that stands out on the road."
          imgSrc="/images/sealion-7-exterior-03.jpg" imgAlt="Tail Lamps"
        />
        <FeatureRow
          title="Intelligent and effortless tailgate"
          body="With an electric tailgate that opens with just a simple foot gesture, the BYD SEALION 7 makes loading and unloading cargo seamless. The intelligent anti-pinch system and customisable stopping positions enhance both safety and convenience, making every day a little easier."
          imgSrc="/images/sealion-7-exterior-04.jpg" imgAlt="Electric Tailgate" reverse
        />
      </div>

      {/* ═══ INTERIOR ═══ */}
      <div id="interior">
        <Chapter
          id="interior-chapter" label="Interior" title="Reinventing the senses with a new level of aspiration"
          body="Inspired by the dynamic flow and speed of sailboat racing, the BYD SEALION 7's interior embodies a sense of movement, suspension, and volume. This design creates a cohesive and immersive atmosphere, where every element feels like it is floating in harmony with the waves."
          imgSrc="/images/sealion-7-interior-01.jpg" imgAlt="SEALION 7 Interior"
        />
        <FeatureRow
          title={`15.6" rotating centre screen`}
          body={`Stay ahead of the curve with a 15.6" rotating touchscreen that adapts to your needs. Whether navigating through a busy city or winding down with your favourite playlist, this screen ensures you are always connected and in control.`}
          imgSrc="/images/sealion-7-interior-02.jpg" imgAlt="Rotating Screen"
        />
        <FeatureRow
          title="Unmatched comfort"
          body="Sink into the premium quilted Nappa leather seats, designed with your comfort in mind. Surrounding you is soft vegan leather that covers over 80% of the interior, providing a tactile experience that elevates every journey."
          imgSrc="/images/sealion-7-interior-03.jpg" imgAlt="Interior Seats" reverse
        />
        <CardGrid items={[
          { title: "Adaptive ambience", imgSrc: "/images/sealion-7-interior-04.jpg", body: "Create the perfect environment inside the car with 128-colour ambient lighting. Whether you need a calming space after a long day or an energising atmosphere for an early commute, the BYD SEALION 7 adapts to your every mood." },
          { title: "Head-up display", imgSrc: "/images/sealion-7-interior-08.jpg", body: "The BYD SEALION 7's advanced HUD makes every drive simpler and safer by projecting essential driving information directly onto the windshield, keeping your eyes on the road at all times." },
          { title: "Panoramic sunroof", imgSrc: "/images/sealion-7-interior-09.jpg", body: "The panoramic sunroof fills the cabin with natural light, creating a sense of openness and wonder. The electric sunshade effortlessly provides shade and comfort, allowing you to enjoy the view without compromise." },
        ]} />
      </div>

      {/* ═══ CHARGING ═══ */}
      <div id="charging">
        <Chapter
          id="charging-chapter" label="Charging" title="Fast and Efficient"
          body="Stay on the go with rapid DC charging up to 230 kW — the BYD SEALION 7 Excellence AWD version charges from 10% to 80% in just 24 minutes. Perfect for those with busy schedules, this feature ensures you spend less time waiting and more time living life to the fullest."
          imgSrc="/images/sealion-7-charging-01.jpg" imgAlt="SEALION 7 Charging"
        />
      </div>

      {/* ═══ PERFORMANCE ═══ */}
      <div id="performance">
        <Chapter
          id="performance-chapter" label="Performance" title="Drive with purpose"
          body="Feel the thrill of high-performance driving with the electric motor reaching an impressive 23,000 RPM. The AWD version sprints from 0-100 km/h in just 4.5 seconds. With a top speed of 215 km/h, the SEALION 7 combines power, speed, and precision for an exhilarating drive."
          imgSrc="/images/sealion-7-performance-01.jpg" imgAlt="SEALION 7 Performance"
        />
      </div>

      {/* ═══ TECHNOLOGY ═══ */}
      <div id="technology">
        <Chapter
          id="technology-chapter" label="Technology" title="BYD Blade Battery"
          body="BYD has been a pioneering name in the battery industry for more than 29 years. Our latest game-changing Blade Battery has passed a series of extreme tests in rigorous conditions making it one of the world's safest batteries."
          imgSrc="/images/sealion-7-battery-01.jpg" imgAlt="BYD Blade Battery"
          extra={
            <a href="#" style={{ marginTop: 32, display: "inline-block", padding: "12px 28px", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", textDecoration: "none", transition: "all 0.25s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >Learn More</a>
          }
        />
        <CardGrid items={[
          { title: "CTB Cell-to-Body Technology", imgSrc: "/images/sealion-7-tech-02.jpg", body: "BYD's innovative CTB technology integrates the Blade Battery directly into the vehicle's structure, providing unparalleled strength and rigidity. The Blade Battery is more than an energy source — it is also a structural component capable of withstanding significant force." },
          { title: "World's first 8-in-1 electric powertrain", imgSrc: "/images/sealion-7-tech-03.jpg", body: "BYD integrates 8 key components — VCU, BMS, MCU, PDU, DC-DC controller, on-board charger, drive motor and transmission — producing the world's first mass-produced 8-in-1 electric powertrain, optimising space and energy efficiency." },
          { title: "High efficiency heat pump", imgSrc: "/images/sealion-7-tech-01.jpg", body: "An advanced energy-saving heat pump system comes as standard. Reliably operating in a broad range of temperatures, it highly utilises residual heat from the surroundings, powertrain, and batteries to enhance efficiency and increase driving range in cold weather." },
        ]} />
      </div>

      {/* ═══ SAFETY / iTAC ═══ */}
      <div id="safety">
        <div style={{ display: "flex", minHeight: 540, borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0a0a0a" }}>
          <div style={{ flex: "0 0 42%", padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Safety</p>
            <h2 style={{ fontSize: "clamp(18px,2vw,30px)", fontWeight: 700, color: "#fff", marginBottom: 20, lineHeight: 1.35 }}>iTAC — intelligence Torque Adaption Control System</h2>
            <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.18)", marginBottom: 24 }} />
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "rgba(255,255,255,0.42)", maxWidth: 420 }}>The BYD SEALION 7 features the latest iTAC technology. Rather than simply reducing power, iTAC intelligently allocates drive torque, efficiently minimises or eliminates skidding, and elevates handling comfort for a smooth and secure driving experience in all conditions.</p>
          </div>
          <div style={{ flex: "0 0 58%", overflow: "hidden" }}>
            <Img src="/images/sealion-7-itac.jpg" alt="iTAC System" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
          </div>
        </div>
        <P7Cards items={[
          { title: "Advanced suspension system", imgSrc: "/images/sealion-7-innovation-01.jpg", body: "The BYD SEALION 7 features a front double-wishbone and rear multi-link suspension setup, along with FSD shock absorbers. This advanced system adjusts in real-time to deliver a smooth, stable ride, minimising body roll and enhancing stability across all road conditions." },
          { title: "Intelligent driving assistance", imgSrc: "/images/sealion-7-innovation-02.jpg", body: "With BYD's state-of-the-art ADAS and 360 degree panoramic cameras, driving this electric SUV becomes a stress-free experience. The system continuously monitors surroundings, adjusting to changing conditions and providing support wherever needed." },
        ]} />
      </div>

      {/* ═══ CONNECTIVITY ═══ */}
      <div id="connectivity">
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 64px 0", background: "#0a0a0a" }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>Connectivity</p>
        </div>
        <P7Cards items={[
          { title: "Connectivity that keeps you ahead", imgSrc: "/images/sealion-7-connectivity-01.jpg", body: "Stay connected on the go with the intelligent cockpit. From four-zone voice control to seamless integration with Android Auto and Apple CarPlay, every feature is designed to keep you effortlessly connected. OTA updates ensure your vehicle is always running the latest software." },
          { title: "Total control, anywhere you are", imgSrc: "/images/sealion-7-connectivity-02.jpg", body: "Skip the traditional car keys with the NFC-enabled card or BYD app — unlock your car with just a tap. Remote A/C control lets you pre-condition the cabin from your smartphone, and scheduled charging ensures the SEALION 7 is always ready when you are." },
        ]} />
      </div>

      {/* ═══ V2L ═══ */}
      <div id="v2l">
        <Chapter
          id="v2l-chapter" label="V2L" title="Power on demand"
          body="Empower your adventures with the BYD SEALION 7's Vehicle-to-Load (V2L) functionality. Whether camping, relaxing, or needing an emergency power source, the SEALION 7 can supply energy to your devices and appliances, transforming your vehicle into a reliable power station wherever you go."
          imgSrc="/images/sealion-7-v2l-01.jpg" imgAlt="SEALION 7 V2L"
        />
      </div>

      {/* ═══ ORDER CTA ═══ */}
      <section style={{ padding: "100px 64px", textAlign: "center", background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>Ready to Drive</p>
        <h2 style={{ fontSize: "clamp(36px,5vw,72px)", fontWeight: 800, letterSpacing: "0.02em", marginBottom: 16 }}>BYD SEALION 7</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 48, maxWidth: 400, margin: "0 auto 48px" }}>Electric Performance SUV — Up to 502 km range</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ padding: "16px 40px", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", background: "#fff", color: "#000", border: "none", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#ddd"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          >Configure Now</button>
          <button style={{ padding: "16px 40px", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >Book a Test Drive</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
