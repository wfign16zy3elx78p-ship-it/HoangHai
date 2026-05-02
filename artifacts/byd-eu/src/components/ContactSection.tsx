import { useState } from "react";

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
    consent: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-20 bg-[#f5f5f5]">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div>
            <p className="text-sm font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1b1b1b] tracking-wide uppercase mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 leading-relaxed mb-10">
              Whether you're interested in a test drive, want to find your nearest dealer, or simply have a question about our vehicles — we're here to help.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1b1b1b] flex items-center justify-center flex-shrink-0">
                  <img src="/images/dealerIcon2.svg" alt="Dealer" className="w-6 h-6 invert" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1b1b1b] tracking-wider uppercase text-sm mb-1">Find a Dealer</h4>
                  <p className="text-gray-500 text-sm">Locate your nearest BYD showroom</p>
                  <a href="/eu/find-store" className="text-sm font-bold text-[#1b1b1b] underline mt-1 inline-block hover:text-gray-600 tracking-wider uppercase">
                    Find Store →
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1b1b1b] flex items-center justify-center flex-shrink-0">
                  <img src="/images/buttonIcon.svg" alt="Test Drive" className="w-6 h-6 invert" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1b1b1b] tracking-wider uppercase text-sm mb-1">Book a Test Drive</h4>
                  <p className="text-gray-500 text-sm">Experience BYD first-hand</p>
                  <a href="/eu/test-drive" className="text-sm font-bold text-[#1b1b1b] underline mt-1 inline-block hover:text-gray-600 tracking-wider uppercase">
                    Book Now →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white p-8 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <img src="/images/green-check-icon.png" alt="Success" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1b1b1b] mb-2">Thank you!</h3>
                <p className="text-gray-500 text-sm">We've received your enquiry and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 mb-1">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b1b1b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 mb-1">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b1b1b] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b1b1b] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b1b1b] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 mb-1">Interested In</label>
                  <select
                    name="interest"
                    value={form.interest}
                    onChange={handleChange}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b1b1b] transition-colors bg-white appearance-none"
                  >
                    <option value="">Select a model...</option>
                    <option>BYD ATTO 3 EVO</option>
                    <option>BYD SEAL</option>
                    <option>BYD SEAL U</option>
                    <option>BYD SEALION 7</option>
                    <option>BYD HAN</option>
                    <option>BYD TANG</option>
                    <option>BYD DOLPHIN</option>
                    <option>BYD SEAL 6 DM-i</option>
                    <option>BYD SEAL U DM-i</option>
                    <option>BYD SEALION 5 DM-i</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-gray-600 mb-1">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1b1b1b] transition-colors resize-none"
                  />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="consent"
                    id="consent"
                    required
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor="consent" className="text-xs text-gray-500 leading-relaxed">
                    I agree to BYD's{" "}
                    <a href="/eu/privacy" className="underline">Privacy Policy</a> and consent to being contacted about BYD products and services. *
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1b1b1b] text-white py-3.5 text-sm font-bold tracking-widest uppercase hover:bg-[#333] transition-colors"
                >
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
