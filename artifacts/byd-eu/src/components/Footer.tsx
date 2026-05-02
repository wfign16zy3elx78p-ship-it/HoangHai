import { useState } from "react";

const footerLinks = [
  {
    title: "Models",
    links: [
      { text: "BYD HAN", href: "/eu/electric-cars/han" },
      { text: "BYD SEAL", href: "/eu/electric-cars/seal" },
      { text: "BYD SEAL U", href: "/eu/electric-cars/seal-u" },
      { text: "BYD SEAL U DM-i", href: "/eu/hybrid-cars/seal-u-dm-i" },
      { text: "BYD SEALION 7", href: "/eu/electric-cars/sealion-7" },
      { text: "BYD TANG", href: "/eu/electric-cars/tang" },
      { text: "BYD DOLPHIN SURF", href: "/eu/electric-cars/dolphin-surf" },
      { text: "BYD SEAL 6 DM-i", href: "/eu/hybrid-cars/seal-6-dm-i" },
      { text: "BYD SEAL 6 DM-i TOURING", href: "/eu/hybrid-cars/seal-6-dm-i-touring" },
      { text: "BYD ATTO 2 DM-i", href: "/eu/hybrid-cars/atto-2-dm-i" },
      { text: "BYD SEALION 5 DM-i", href: "/eu/hybrid-cars/sealion-5-dm-i" },
      { text: "BYD ATTO 3 EVO", href: "/eu/electric-cars/atto-3-evo" },
      { text: "BYD DOLPHIN", href: "/eu/electric-cars/dolphin" },
    ],
  },
  {
    title: "About BYD",
    links: [
      { text: "About BYD", href: "/eu/about-byd" },
      { text: "Media HUB", href: "https://media.byd.com/eu?lang=eng" },
      { text: "News", href: "/eu/news-list" },
      { text: "Blogs", href: "/eu/blog" },
      { text: "Image Bank", href: "/eu/image-bank" },
      { text: "Dealer Admittance Portal", href: "/eu/dealer-admittance" },
    ],
  },
  {
    title: "Technology",
    links: [
      { text: "BYD Blade Battery", href: "/eu/technology/byd-blade-battery" },
      { text: "BYD Super DM", href: "/eu/technology/byd-super-dm-plug-in-hybrid-technology" },
      { text: "BYD e-Platform 3.0", href: "/eu/technology/byd-e-platform-3" },
      { text: "What is a NEV?", href: "/eu/electric-cars/what-is-a-nev" },
    ],
  },
  {
    title: "Ownership",
    links: [
      { text: "BYD Service", href: "/eu/ownership.html" },
      { text: "Service Maintenance", href: "/eu/service-maintenance" },
      { text: "BYD Assistance", href: "/eu/ownership/roadside-assistance" },
      { text: "App & Community", href: "/eu/ownership/app-community" },
      { text: "Privacy & Data", href: "/eu/ownership/how-byd-protects-your-privacy-data" },
      { text: "FAQ", href: "/eu/ownership/faq" },
    ],
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/bydauto.eu", icon: "/images/facebook.svg" },
  { name: "Twitter", href: "https://twitter.com/BYD_Europe", icon: "/images/twitter.svg" },
  { name: "Instagram", href: "https://www.instagram.com/byd.europe/", icon: "/images/ins.svg" },
  { name: "TikTok", href: "https://www.tiktok.com/@byd.europe", icon: "/images/tiktok.svg" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/bydeurope", icon: "/images/linkedin.svg" },
  { name: "YouTube", href: "https://www.youtube.com/bydeurope", icon: "/images/youtube.svg" },
];

const legalLinks = [
  { text: "Privacy Policy", href: "/eu/privacy" },
  { text: "Terms of Use", href: "/eu/terms-of-use" },
  { text: "Cookie", href: "/eu/cookie" },
  { text: "Contact", href: "/eu/contact-us" },
  { text: "RMl & Dismantling Info", href: "https://eurmi.byd.com/home" },
  { text: "Data Act Notice", href: "/eu/data-act-notice" },
];

export default function Footer() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <footer style={{ background: "#030303", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      {/* Main links */}
      <div className="max-w-[1440px] mx-auto px-6 py-16">
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-4 gap-10">
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4
                className="text-[10px] font-bold tracking-[0.25em] uppercase mb-6"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-xs text-white/35 hover:text-white/80"
                      style={{ transition: "color 0.2s ease", lineHeight: 1.6 }}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordions */}
        <div className="md:hidden space-y-0">
          {footerLinks.map((col) => (
            <div key={col.title} style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <button
                onClick={() => setExpanded(expanded === col.title ? null : col.title)}
                className="flex items-center justify-between w-full py-4 text-left"
              >
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/50">{col.title}</span>
                <img
                  src="/images/add.svg"
                  alt="expand"
                  className="w-3.5 h-3.5 invert opacity-40"
                  style={{ transform: expanded === col.title ? "rotate(45deg)" : "none", transition: "transform 0.25s ease" }}
                />
              </button>
              {expanded === col.title && (
                <ul className="pb-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.text}>
                      <a href={link.href} className="text-xs text-white/35 hover:text-white/80" style={{ transition: "color 0.2s ease" }}>
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer divider */}
      <div className="shimmer-line" />

      {/* Bottom bar */}
      <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Legal */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center md:justify-start">
          {legalLinks.map((link) => (
            <a
              key={link.text}
              href={link.href}
              className="text-[10px] text-white/30 hover:text-white/70"
              style={{ transition: "color 0.2s ease" }}
            >
              {link.text}
            </a>
          ))}
        </div>

        {/* Social */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase mr-1">Follow Us</span>
          {socialLinks.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.12)";
                el.style.borderColor = "rgba(255,255,255,0.2)";
                el.style.boxShadow = "0 4px 12px rgba(255,255,255,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(255,255,255,0.05)";
                el.style.borderColor = "rgba(255,255,255,0.08)";
                el.style.boxShadow = "none";
              }}
            >
              <img src={s.icon} alt={s.name} className="w-3.5 h-3.5 invert opacity-50 hover:opacity-80" style={{ transition: "opacity 0.2s ease" }} />
            </a>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="py-4 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p className="text-[10px] tracking-[0.1em]" style={{ color: "rgba(255,255,255,0.2)" }}>
          © BYD Europe B.V. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
