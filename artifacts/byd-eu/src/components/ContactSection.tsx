import { useRouter } from "@/lib/router";

export default function ContactSection() {
  const { navigate } = useRouter();

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #050505 0%, #080808 100%)" }}>
      {/* Ambient glow */}
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

          {/* Left: Info */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>
              Liên Hệ
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-wide uppercase mb-6">
              Kết Nối Với Chúng Tôi
            </h2>
            <div className="shimmer-line mb-8" />
            <p className="text-white/40 text-sm leading-relaxed mb-12">
              Dù bạn muốn đặt lịch lái thử, tìm showroom gần nhất, hay có câu hỏi về xe — chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: "/images/dealerIcon2.svg",
                  title: "Tìm Showroom",
                  desc: "Tìm showroom BYD gần bạn nhất",
                  link: "/eu/find-store",
                  cta: "Tìm Ngay",
                },
                {
                  icon: "/images/buttonIcon.svg",
                  title: "Đặt Lịch Lái Thử",
                  desc: "Trải nghiệm BYD trực tiếp tại showroom",
                  link: "/test-drive",
                  cta: "Đặt Ngay",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-5 p-5 rounded-[20px] group"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                    transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.08)";
                    el.style.borderColor = "rgba(255,255,255,0.16)";
                    el.style.boxShadow = "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = "rgba(255,255,255,0.04)";
                    el.style.borderColor = "rgba(255,255,255,0.08)";
                    el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)";
                    el.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.12)",
                    }}
                  >
                    <img src={item.icon} alt={item.title} className="w-5 h-5 invert opacity-70" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-[0.1em] uppercase mb-1">{item.title}</h4>
                    <p className="text-white/40 text-xs mb-3">{item.desc}</p>
                    <button
                      onClick={() => navigate(item.link)}
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-white/60 hover:text-white group-hover:text-white/80 bg-transparent border-none cursor-pointer p-0"
                      style={{ transition: "color 0.2s ease" }}
                    >
                      {item.cta}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="rounded-[24px] overflow-hidden" style={{ minHeight: "420px" }}>
            <img
              src="/images/contact-showroom.png"
              alt="BYD Showroom"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}
