import { useState } from "react";
import techData from "../data/technology.json";

export default function Technology() {
  const [active, setActive] = useState(0);
  const tech = techData[active];

  return (
    <section className="py-20 bg-[#0a0a0a] text-white">
      <div className="max-w-[1440px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/images/technology.svg" alt="Technology" className="w-8 h-8 invert" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400">Technology</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide uppercase">
            BYD Technology
          </h2>
          <p className="mt-3 text-gray-400 max-w-xl mx-auto text-sm">
            Pioneering innovation that puts safety, efficiency, and performance at the heart of every vehicle.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/3]">
            <img
              key={tech.id}
              src={tech.img}
              alt={tech.title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          {/* Tech Tabs */}
          <div className="space-y-0">
            {techData.map((item, i) => (
              <div
                key={item.id}
                className={`border-t border-white/10 cursor-pointer transition-all duration-300 ${
                  i === techData.length - 1 ? "border-b" : ""
                }`}
                onClick={() => setActive(i)}
              >
                <div className="flex items-center justify-between py-6 px-2">
                  <h3
                    className={`text-lg font-bold tracking-wider uppercase transition-colors ${
                      i === active ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      i === active ? "rotate-180 text-white" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {i === active && (
                  <div className="pb-6 px-2">
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
                    <a
                      href={item.link}
                      className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-white border-b border-white pb-0.5 hover:text-gray-300 hover:border-gray-300 transition-colors"
                    >
                      {item.linkText}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Background image strip */}
        <div className="mt-16 relative h-[300px] overflow-hidden rounded-sm">
          <img src="/images/bc-1.webp" alt="BYD Technology Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div>
              <p className="text-sm tracking-[0.3em] uppercase text-gray-300 mb-3">Build Your Dreams</p>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-wide">Innovation for a Better World</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
