import { useState, useEffect } from "react";

const navModels = {
  electric: [
    { name: "BYD ATTO 3 EVO", img: "/images/Nav_BYD_ATTO3_EVO.png", link: "/eu/electric-cars/atto-3-evo" },
    { name: "BYD DOLPHIN SURF", img: "/images/BYD_DOLPHIN_SURF.png", link: "/eu/electric-cars/dolphin-surf" },
    { name: "BYD ATTO 2", img: "/images/Nav_BYD_ATTO2.png", link: "/eu/electric-cars/atto-2" },
    { name: "BYD SEALION 7", img: "/images/NAV_BYD_SEALION_7.png", link: "/eu/electric-cars/sealion-7" },
    { name: "BYD ATTO 3", img: "/images/Nav_BYD_ATTO3.png", link: "/eu/electric-cars/atto-3" },
    { name: "BYD DOLPHIN", img: "/images/Nav_BYD_DOLPHIN.png", link: "/eu/electric-cars/dolphin" },
    { name: "BYD HAN", img: "/images/Nav_BYD_HAN.png", link: "/eu/electric-cars/han" },
    { name: "BYD SEAL", img: "/images/Nav_BYD_SEAL.png", link: "/eu/electric-cars/seal" },
    { name: "BYD SEAL U EV", img: "/images/Nav_BYD_SEAL_U_EV.png", link: "/eu/electric-cars/seal-u" },
    { name: "BYD TANG", img: "/images/BYD_TANG_2024.png", link: "/eu/electric-cars/tang" },
  ],
  hybrid: [
    { name: "BYD SEALION 5 DM-i", img: "/images/BYD-SEALION5-DM-i.png", link: "/eu/hybrid-cars/sealion-5-dm-i" },
    { name: "BYD SEAL U DM-i", img: "/images/Nav_BYD_SEAL_U_DMI.png", link: "/eu/hybrid-cars/seal-u-dm-i" },
    { name: "BYD SEAL 6 DM-i", img: "/images/BYD-SEAL-6-DM-i.png", link: "/eu/hybrid-cars/seal-6-dm-i" },
    { name: "BYD SEAL 6 DM-i TOURING", img: "/images/BYD-SEAL-6-DM-i-TOURING.png", link: "/eu/hybrid-cars/seal-6-dm-i-touring" },
    { name: "BYD ATTO 2 DM-i", img: "/images/Atto2dmi.webp", link: "/eu/hybrid-cars/atto-2-dm-i" },
  ],
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"electric" | "hybrid">("electric");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Electric Cars", key: "electric" },
    { label: "Hybrid Cars", key: "hybrid" },
    { label: "Technology", key: "technology" },
    { label: "About BYD", key: "about" },
    { label: "Ownership", key: "ownership" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activeMenu ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <a href="/eu" className="flex items-center">
          <span
            className={`text-2xl font-bold tracking-widest ${
              scrolled || activeMenu ? "text-[#1b1b1b]" : "text-white"
            }`}
          >
            BYD
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.key}
              onMouseEnter={() => setActiveMenu(item.key)}
              onMouseLeave={() => setActiveMenu(null)}
              className={`text-sm font-semibold tracking-wider uppercase transition-colors duration-200 ${
                scrolled || activeMenu
                  ? "text-[#1b1b1b] hover:text-[#1db954]"
                  : "text-white hover:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="/eu/find-store"
            className={`flex items-center gap-1.5 text-sm font-semibold tracking-wider transition-colors ${
              scrolled || activeMenu ? "text-[#1b1b1b]" : "text-white"
            }`}
          >
            <img
              src={scrolled || activeMenu ? "/images/findStoreIconDark.svg" : "/images/findStoreIconDark.svg"}
              alt="Find Store"
              className="w-5 h-5"
            />
            <span>Find Store</span>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={`block w-6 h-0.5 transition-colors ${scrolled ? "bg-[#1b1b1b]" : "bg-white"}`} />
          <span className={`block w-6 h-0.5 transition-colors ${scrolled ? "bg-[#1b1b1b]" : "bg-white"}`} />
          <span className={`block w-6 h-0.5 transition-colors ${scrolled ? "bg-[#1b1b1b]" : "bg-white"}`} />
        </button>
      </div>

      {/* Mega Menu - Models */}
      {(activeMenu === "electric" || activeMenu === "hybrid") && (
        <div
          className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 py-8"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-[1440px] mx-auto px-6">
            <div className="flex gap-8 mb-6">
              <button
                onClick={() => setActiveTab("electric")}
                className={`text-sm font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
                  activeTab === "electric" ? "border-[#1b1b1b] text-[#1b1b1b]" : "border-transparent text-gray-400"
                }`}
              >
                Electric Cars
              </button>
              <button
                onClick={() => setActiveTab("hybrid")}
                className={`text-sm font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${
                  activeTab === "hybrid" ? "border-[#1b1b1b] text-[#1b1b1b]" : "border-transparent text-gray-400"
                }`}
              >
                Hybrid Cars
              </button>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {navModels[activeTab].map((model) => (
                <a
                  key={model.name}
                  href={model.link}
                  className="group flex flex-col items-center text-center hover:bg-gray-50 rounded-lg p-3 transition-colors"
                >
                  <img
                    src={model.img}
                    alt={model.name}
                    className="w-full h-24 object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                  <span className="mt-2 text-xs font-semibold text-[#1b1b1b] tracking-wide">{model.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={`/eu/${item.key}`}
                className="block text-sm font-semibold uppercase tracking-wider text-[#1b1b1b] hover:text-gray-500 py-2 border-b border-gray-100"
              >
                {item.label}
              </a>
            ))}
            <a href="/eu/find-store" className="block text-sm font-semibold uppercase tracking-wider text-[#1b1b1b] py-2">
              Find Store
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
