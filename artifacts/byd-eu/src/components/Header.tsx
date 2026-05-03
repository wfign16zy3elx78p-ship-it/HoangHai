import { useState, useEffect, useRef } from "react";
import { useRouter } from "../lib/router";

const navModels = {
  electric: [
    { name: "BYD ATTO 3 EVO", img: "/images/Nav_BYD_ATTO3_EVO.png", link: "/car/atto-3-evo" },
    { name: "BYD DOLPHIN SURF", img: "/images/BYD_DOLPHIN_SURF.png", link: "/car/dolphin-surf" },
    { name: "BYD SEALION 7", img: "/images/NAV_BYD_SEALION_7.png", link: "/car/sealion-7" },
    { name: "BYD DOLPHIN", img: "/images/Nav_BYD_DOLPHIN.png", link: "/car/dolphin" },
    { name: "BYD HAN", img: "/images/Nav_BYD_HAN.png", link: "/car/han" },
    { name: "BYD SEAL", img: "/images/Nav_BYD_SEAL.png", link: "/car/seal" },
    { name: "BYD SEAL U", img: "/images/Nav_BYD_SEAL_U_EV.png", link: "/car/seal-u" },
    { name: "BYD TANG", img: "/images/BYD_TANG_2024.png", link: "/car/tang" },
  ],
  hybrid: [
    { name: "BYD SEALION 5 DM-i", img: "/images/BYD-SEALION5-DM-i.png", link: "/car/sealion-5-dm-i" },
    { name: "BYD SEAL U DM-i", img: "/images/Nav_BYD_SEAL_U_DMI.png", link: "/car/seal-u-dm-i" },
    { name: "BYD SEAL 6 DM-i", img: "/images/BYD-SEAL-6-DM-i.png", link: "/car/seal-6-dm-i" },
    { name: "BYD SEAL 6 DM-i TOURING", img: "/images/BYD-SEAL-6-DM-i-TOURING.png", link: "/car/seal-6-dm-i-touring" },
    { name: "BYD ATTO 2 DM-i", img: "/images/Atto2dmi.webp", link: "/car/atto-2-dm-i" },
  ],
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"electric" | "hybrid">("electric");
  const { navigate } = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(key);
    setActiveTab(key === "hybrid" ? "hybrid" : "electric");
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Xe Điện", key: "electric" },
    { label: "Xe Hybrid", key: "hybrid" },
    { label: "Công Nghệ", key: "technology" },
    { label: "Về BYD", key: "about" },
    { label: "Sở Hữu Xe", key: "ownership" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)" }}
    >
      {/* Glass bar */}
      <div
        className="mx-4 mt-3 rounded-2xl overflow-visible"
        style={{
          background: scrolled || activeMenu
            ? "rgba(10,10,10,0.72)"
            : "rgba(0,0,0,0.18)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          border: scrolled || activeMenu
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(255,255,255,0.10)",
          boxShadow: scrolled || activeMenu
            ? "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
            : "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="px-6 flex items-center justify-between h-[64px]">
          {/* Logo */}
          <a href="/" onClick={e => { e.preventDefault(); navigate("/"); }} className="flex items-center group">
            <span
              className="text-xl font-bold tracking-[0.25em] text-white"
              style={{ transition: "all 0.3s ease", textShadow: "0 0 20px rgba(255,255,255,0.3)" }}
            >
              BYD
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                onMouseEnter={() => openMenu(item.key)}
                onMouseLeave={scheduleClose}
                className="relative px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase text-white/80 rounded-xl group"
                style={{ transition: "all 0.25s ease" }}
              >
                <span
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    transition: "opacity 0.25s ease",
                  }}
                />
                <span className="relative z-10 group-hover:text-white" style={{ transition: "color 0.25s ease" }}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/"
              onClick={e => { e.preventDefault(); navigate("/"); }}
              className="flex items-center gap-2 text-xs font-semibold tracking-[0.12em] uppercase text-white/80 hover:text-white px-4 py-2 rounded-xl group"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.14)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.22)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <img src="/images/findStoreIconDark.svg" alt="Find Store" className="w-4 h-4 invert opacity-70 group-hover:opacity-100" style={{ transition: "opacity 0.25s ease" }} />
              <span>Tìm Showroom</span>
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-5 h-px bg-white/80"
                style={{
                  transition: "all 0.3s ease",
                  transform: mobileOpen
                    ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                      : i === 1 ? "scaleX(0)"
                      : "rotate(-45deg) translate(4px, -4px)"
                    : "none",
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mega Menu */}
      {(activeMenu === "electric" || activeMenu === "hybrid") && (
        <div
          className="mx-4 mt-1 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(8,8,8,0.88)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            animation: "fadeDown 0.25s cubic-bezier(0.4,0,0.2,1)",
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <style>{`
            @keyframes fadeDown {
              from { opacity: 0; transform: translateY(-8px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div className="p-6">
            <div className="flex gap-2 mb-6">
              {(["electric", "hybrid"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-lg"
                  style={{
                    background: activeTab === tab ? "rgba(255,255,255,0.12)" : "transparent",
                    border: activeTab === tab ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                    color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.4)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tab === "electric" ? "Xe Điện" : "Xe Hybrid"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-3">
              {navModels[activeTab].map((model) => (
                <div
                  key={model.name}
                  onClick={() => { navigate(model.link); setActiveMenu(null); }}
                  className="group flex flex-col items-center text-center p-3 rounded-xl cursor-pointer"
                  style={{
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  <img
                    src={model.img}
                    alt={model.name}
                    className="w-full h-20 object-contain group-hover:scale-105"
                    style={{ transition: "transform 0.3s ease", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
                  />
                  <span className="mt-2 text-[10px] font-bold text-white/70 tracking-wider group-hover:text-white" style={{ transition: "color 0.2s ease" }}>
                    {model.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="lg:hidden mx-4 mt-1 rounded-2xl overflow-hidden"
          style={{
            background: "rgba(8,8,8,0.92)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          }}
        >
          <div className="px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.key}
                href="/"
                onClick={e => {
                  e.preventDefault();
                  setMobileOpen(false);
                  const scrollTarget = (item.key === "hybrid" || item.key === "electric") ? "electric" : item.key;
                  const doScroll = () => {
                    document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
                    if (item.key === "hybrid") {
                      window.dispatchEvent(new CustomEvent("byd-models-tab", { detail: "hybrid" }));
                    }
                  };
                  if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(doScroll, 300);
                  } else {
                    doScroll();
                  }
                }}
                className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white py-3 px-3 rounded-xl hover:bg-white/08"
                style={{ transition: "all 0.2s ease", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/test-drive"
              onClick={e => { e.preventDefault(); setMobileOpen(false); navigate("/test-drive"); }}
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/70 hover:text-white py-3 px-3 rounded-xl"
              style={{ transition: "all 0.2s ease" }}
            >
              Đặt Lịch Lái Thử
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
