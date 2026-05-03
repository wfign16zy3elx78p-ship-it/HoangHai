import { useState } from "react";
import techData from "../data/technology.json";

export default function Technology() {
  const [active, setActive] = useState(0);
  const tech = techData[active];

  return (
    <section id="technology" className="py-24 relative overflow-hidden" style={{ background: "#050505" }}>
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)",
          filter: "blur(60px)",
          transform: "translateY(-40%)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <img src="/images/technology.svg" alt="" className="w-4 h-4 invert opacity-60" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">Công Nghệ</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-4">
            Công Nghệ BYD
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
            Đột phá công nghệ đặt an toàn, hiệu quả và hiệu suất vào trung tâm của mỗi chiếc xe.
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Image panel */}
          <div
            className="relative overflow-hidden rounded-[24px] aspect-[4/3]"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <img
              key={tech.id}
              src={tech.img}
              alt={tech.title}
              className="w-full h-full object-cover"
              style={{ transition: "opacity 0.5s ease" }}
            />
            {/* Inner overlay */}
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }}
            />
            {/* Corner label */}
            <div
              className="absolute bottom-5 left-5 px-4 py-2 rounded-xl text-xs font-bold tracking-[0.15em] uppercase text-white"
              style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {tech.title}
            </div>
          </div>

          {/* Accordion */}
          <div
            className="rounded-[24px] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {techData.map((item, i) => (
              <div
                key={item.id}
                style={{ borderBottom: i < techData.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
              >
                <button
                  className="w-full flex items-center justify-between px-7 py-6 text-left group"
                  style={{ transition: "background 0.25s ease" }}
                  onClick={() => setActive(i)}
                  onMouseEnter={(e) => { if (i !== active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: i === active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                        border: i === active ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.08)",
                        color: i === active ? "#fff" : "rgba(255,255,255,0.4)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-sm font-bold tracking-[0.1em] uppercase"
                      style={{
                        color: i === active ? "#fff" : "rgba(255,255,255,0.45)",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    style={{
                      color: i === active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
                      transform: i === active ? "rotate(180deg)" : "rotate(0)",
                      transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                    }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {i === active && (
                  <div className="px-7 pb-6" style={{ animation: "fadeIn 0.3s ease" }}>
                    <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }`}</style>
                    <p className="text-xs text-white/50 leading-relaxed mb-5">{item.desc}</p>
                    <a
                      href={item.link}
                      className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase group"
                      style={{ color: "rgba(255,255,255,0.7)", transition: "color 0.2s ease" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)"; }}
                    >
                      {item.linkText}
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1" style={{ transition: "transform 0.2s ease" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Background strip */}
        <div
          className="mt-16 relative overflow-hidden"
          style={{
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
          }}
        >
          <img src="/images/bc-1.webp" alt="BYD Technology" className="w-full h-[260px] object-cover opacity-50" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.3) 50%, rgba(5,5,5,0.85) 100%)" }}
          />
          <div
            className="absolute inset-0 flex items-center justify-center text-center"
            style={{ backdropFilter: "blur(0px)" }}
          >
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/40 mb-3 font-bold">Build Your Dreams</p>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-wide">Đổi Mới Vì Thế Giới Tốt Đẹp Hơn</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
