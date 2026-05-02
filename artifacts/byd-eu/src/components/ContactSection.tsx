import { useState } from "react";
import { useRouter } from "@/lib/router";

export default function ContactSection() {
  const { navigate } = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", interest: "", message: "", consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const InputClass = "input-glass";
  const LabelClass = "block text-[10px] font-bold tracking-[0.2em] uppercase mb-2";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

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
                      onClick={() => item.link.startsWith("/test-drive") || item.link.startsWith("/") ? navigate(item.link) : undefined}
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

          {/* Right: Form */}
          <div
            className="p-8 rounded-[24px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 16px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            }}
          >
            {submitted ? (
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)" }}
                >
                  <img src="/images/green-check-icon.png" alt="Success" className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide mb-3">Cảm ơn bạn!</h3>
                <p className="text-white/40 text-sm leading-relaxed">Chúng tôi đã nhận được yêu cầu và sẽ liên hệ với bạn sớm nhất.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[{ name: "firstName", label: "Họ" }, { name: "lastName", label: "Tên" }].map((f) => (
                    <div key={f.name}>
                      <label className={LabelClass} style={{ color: "rgba(255,255,255,0.4)" }}>{f.label} *</label>
                      <input
                        type="text"
                        name={f.name}
                        required
                        value={(form as Record<string, string>)[f.name]}
                        onChange={handleChange}
                        placeholder={f.label}
                        className={InputClass}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className={LabelClass} style={{ color: "rgba(255,255,255,0.4)" }}>Email *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="ban@example.com" className={InputClass} />
                </div>

                <div>
                  <label className={LabelClass} style={{ color: "rgba(255,255,255,0.4)" }}>Điện Thoại</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+84 000 000 000" className={InputClass} />
                </div>

                <div>
                  <label className={LabelClass} style={{ color: "rgba(255,255,255,0.4)" }}>Quan Tâm Đến</label>
                  <select name="interest" value={form.interest} onChange={handleChange} className={InputClass}
                    style={{ appearance: "none", background: "rgba(255,255,255,0.05)", color: form.interest ? "#fff" : "rgba(255,255,255,0.35)" }}>
                    <option value="" disabled>Chọn dòng xe...</option>
                    {["BYD ATTO 3 EVO","BYD SEAL","BYD SEAL U","BYD SEALION 7","BYD HAN","BYD TANG","BYD DOLPHIN","BYD SEAL 6 DM-i","BYD SEAL U DM-i","BYD SEALION 5 DM-i"].map(m => (
                      <option key={m} value={m} style={{ background: "#111", color: "#fff" }}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={LabelClass} style={{ color: "rgba(255,255,255,0.4)" }}>Tin Nhắn</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Chúng tôi có thể giúp gì cho bạn?" className={InputClass} style={{ resize: "none" }} />
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <input
                    type="checkbox"
                    name="consent"
                    id="consent"
                    required
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-0.5 flex-shrink-0"
                    style={{ accentColor: "white" }}
                  />
                  <label htmlFor="consent" className="text-[11px] text-white/40 leading-relaxed">
                    Tôi đồng ý với{" "}
                    <a href="/eu/privacy" className="text-white/70 underline hover:text-white" style={{ transition: "color 0.2s ease" }}>Chính Sách Bảo Mật</a>
                    {" "}của BYD và đồng ý được liên hệ. *
                  </label>
                </div>

                <button type="submit" className="btn-glass-primary w-full mt-2">
                  Gửi Yêu Cầu
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
