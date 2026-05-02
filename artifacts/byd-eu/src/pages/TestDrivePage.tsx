import { useState, useEffect } from "react";
import { useRouter } from "@/lib/router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/* ── Cập nhật thông tin showroom của bạn tại đây ── */
const SHOWROOM = {
  name: "BYD Showroom",
  address: "123 Showroom Street",
  city: "Your City",
  hours: "Mon – Sat: 8:00 AM – 6:00 PM",
  phone: "+XX XXX XXX XXXX",
};

const ALL_MODELS = [
  { slug: "sealion-7", name: "BYD SEALION 7" },
  { slug: "seal",      name: "BYD SEAL" },
  { slug: "seal-u",    name: "BYD SEAL U" },
  { slug: "han",       name: "BYD HAN" },
  { slug: "tang",      name: "BYD TANG" },
  { slug: "dolphin",   name: "BYD DOLPHIN" },
  { slug: "dolphin-surf",       name: "BYD DOLPHIN SURF" },
  { slug: "atto-3-evo",         name: "BYD ATTO 3 EVO" },
  { slug: "sealion-5-dm-i",     name: "BYD SEALION 5 DM-i" },
  { slug: "seal-u-dm-i",        name: "BYD SEAL U DM-i" },
  { slug: "seal-6-dm-i",        name: "BYD SEAL 6 DM-i" },
  { slug: "seal-6-dm-i-touring",name: "BYD SEAL 6 DM-i TOURING" },
  { slug: "atto-2-dm-i",        name: "BYD ATTO 2 DM-i" },
];

const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
];

function generateRef() {
  return "BYD-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Date.now().toString().slice(-4);
}

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().split("T")[0];
}

function getMaxDate() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().split("T")[0];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

interface FormData {
  model: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes: string;
}

const EMPTY_FORM: FormData = {
  model: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  date: "",
  timeSlot: "",
  notes: "",
};

/* ─────────────────────── Step indicator ─────────────────────── */
function StepIndicator({ step }: { step: number }) {
  const steps = ["Your Car", "Your Details", "Confirmation"];
  return (
    <div className="flex items-center justify-center mb-12 md:mb-16">
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold tracking-wide transition-all duration-500"
                style={{
                  background: done || active ? "#fff" : "rgba(255,255,255,0.08)",
                  color: done || active ? "#000" : "rgba(255,255,255,0.3)",
                  border: done || active ? "none" : "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : idx}
              </div>
              <span
                className="text-[9px] font-bold tracking-[0.16em] uppercase hidden sm:block transition-colors duration-300"
                style={{ color: active ? "#fff" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-16 sm:w-24 md:w-32 h-px mx-2 sm:mx-3 transition-all duration-500"
                style={{ background: done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────── Shared field ─────────────────────── */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">{label}</label>
      {children}
      {error && <span className="text-[10px] text-red-400 tracking-wide">{error}</span>}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.06] transition-all duration-200 appearance-none";

const selectCls = inputCls + " cursor-pointer";

/* ─────────────────────── Showroom card ─────────────────────── */
function ShowroomCard() {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 border border-white/[0.07]"
      style={{ background: "rgba(255,255,255,0.025)" }}
    >
      <div
        className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold tracking-wide text-white">{SHOWROOM.name}</p>
        <p className="text-[11px] text-white/40 mt-0.5">{SHOWROOM.address}, {SHOWROOM.city}</p>
      </div>
      <div className="flex flex-col gap-1 sm:text-right">
        <p className="text-[10px] text-white/30 font-medium">{SHOWROOM.hours}</p>
        <p className="text-[10px] text-white/30">{SHOWROOM.phone}</p>
      </div>
    </div>
  );
}

/* ─────────────────────── Step 1 ─────────────────────── */
function Step1({
  form, setForm, errors, onNext,
}: { form: FormData; setForm: (f: FormData) => void; errors: Partial<Record<keyof FormData, string>>; onNext: () => void }) {
  const selected = ALL_MODELS.find(m => m.slug === form.model);
  const isHybrid = selected?.slug.includes("dm-i");

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-2">Step 1 of 2</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Choose your car</h2>
        <p className="text-sm text-white/40">Select the model you'd like to experience at our showroom.</p>
      </div>

      <Field label="Model" error={errors.model}>
        <select
          className={selectCls}
          value={form.model}
          onChange={e => setForm({ ...form, model: e.target.value })}
          style={{ WebkitAppearance: "none", background: "rgba(255,255,255,0.04)" }}
        >
          <option value="" disabled style={{ background: "#111" }}>Select a model</option>
          <optgroup label="Electric Cars" style={{ background: "#111" }}>
            {ALL_MODELS.filter(m => !m.slug.includes("dm-i")).map(m => (
              <option key={m.slug} value={m.slug} style={{ background: "#111" }}>{m.name}</option>
            ))}
          </optgroup>
          <optgroup label="Hybrid Cars" style={{ background: "#111" }}>
            {ALL_MODELS.filter(m => m.slug.includes("dm-i")).map(m => (
              <option key={m.slug} value={m.slug} style={{ background: "#111" }}>{m.name}</option>
            ))}
          </optgroup>
        </select>
      </Field>

      {/* Selected model preview */}
      {selected && (
        <div
          className="flex items-center gap-4 p-5 border border-white/[0.07]"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full text-lg"
            style={{ background: isHybrid ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.07)" }}
          >
            {isHybrid ? "🔋" : "⚡"}
          </div>
          <div>
            <p className="font-bold text-sm tracking-wide">{selected.name}</p>
            <p className="text-[11px] text-white/35 mt-0.5">
              {isHybrid ? "Plug-in Hybrid" : "All-Electric"} · 45-minute test drive
            </p>
          </div>
        </div>
      )}

      {/* Showroom info */}
      <div>
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/25 mb-3">Location</p>
        <ShowroomCard />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          className="px-10 py-4 bg-white text-black text-[11px] font-bold tracking-[0.18em] uppercase transition-colors hover:bg-white/90 cursor-pointer border-none"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Step 2 ─────────────────────── */
function Step2({
  form, setForm, errors, onBack, onNext,
}: { form: FormData; setForm: (f: FormData) => void; errors: Partial<Record<keyof FormData, string>>; onBack: () => void; onNext: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-2">Step 2 of 2</p>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Your details</h2>
        <p className="text-sm text-white/40">We'll confirm your test drive appointment by email or phone.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="First Name" error={errors.firstName}>
          <input
            className={inputCls}
            type="text"
            placeholder="First name"
            value={form.firstName}
            onChange={e => setForm({ ...form, firstName: e.target.value })}
          />
        </Field>
        <Field label="Last Name" error={errors.lastName}>
          <input
            className={inputCls}
            type="text"
            placeholder="Last name"
            value={form.lastName}
            onChange={e => setForm({ ...form, lastName: e.target.value })}
          />
        </Field>
        <Field label="Email Address" error={errors.email}>
          <input
            className={inputCls}
            type="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Phone Number" error={errors.phone}>
          <input
            className={inputCls}
            type="tel"
            placeholder="+XX XXX XXX XXXX"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Preferred Date" error={errors.date}>
          <input
            className={inputCls}
            type="date"
            min={getMinDate()}
            max={getMaxDate()}
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            style={{ colorScheme: "dark" }}
          />
        </Field>
        <Field label="Preferred Time" error={errors.timeSlot}>
          <select
            className={selectCls}
            value={form.timeSlot}
            onChange={e => setForm({ ...form, timeSlot: e.target.value })}
            style={{ WebkitAppearance: "none", background: "rgba(255,255,255,0.04)" }}
          >
            <option value="" disabled style={{ background: "#111" }}>Select a time slot</option>
            {TIME_SLOTS.map(t => (
              <option key={t} value={t} style={{ background: "#111" }}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Notes (Optional)">
        <textarea
          className={inputCls + " resize-none"}
          rows={3}
          placeholder="Any specific requirements or questions for our team..."
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
        />
      </Field>

      <div className="flex flex-col sm:flex-row gap-3 justify-between pt-2">
        <button
          onClick={onBack}
          className="px-8 py-4 bg-transparent text-white/60 text-[11px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-colors hover:text-white border border-white/15 hover:border-white/30"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="px-10 py-4 bg-white text-black text-[11px] font-bold tracking-[0.18em] uppercase transition-colors hover:bg-white/90 cursor-pointer border-none"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Step 3 — Success ─────────────────────── */
function Step3({ form, bookingRef, onDone }: { form: FormData; bookingRef: string; onDone: () => void }) {
  const modelName = ALL_MODELS.find(m => m.slug === form.model)?.name ?? form.model;

  return (
    <div className="flex flex-col items-center text-center gap-8">
      {/* Animated checkmark */}
      <div className="relative flex items-center justify-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 20L16 28L32 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          className="absolute w-32 h-32 rounded-full opacity-20 animate-ping"
          style={{ background: "rgba(255,255,255,0.15)", animationDuration: "2s" }}
        />
      </div>

      <div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/30 mb-3">Booking Confirmed</p>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">See you at our showroom</h2>
        <p className="text-sm text-white/45 max-w-sm mx-auto">
          We'll be in touch at <span className="text-white/70">{form.email}</span> or <span className="text-white/70">{form.phone}</span> to confirm the details.
        </p>
      </div>

      {/* Booking summary */}
      <div
        className="w-full max-w-md text-left border border-white/8 divide-y divide-white/6"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">Booking Reference</span>
          <span className="text-sm font-bold tracking-wider text-white">{bookingRef}</span>
        </div>
        {[
          { label: "Name",     value: `${form.firstName} ${form.lastName}` },
          { label: "Model",    value: modelName },
          { label: "Location", value: `${SHOWROOM.name}, ${SHOWROOM.city}` },
          { label: "Date",     value: formatDate(form.date) },
          { label: "Time",     value: form.timeSlot },
        ].map(row => (
          <div key={row.label} className="px-6 py-3.5 flex items-center justify-between gap-4">
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/25 flex-shrink-0">{row.label}</span>
            <span className="text-sm text-white/70 text-right">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <button
          onClick={onDone}
          className="px-10 py-4 bg-white text-black text-[11px] font-bold tracking-[0.18em] uppercase transition-colors hover:bg-white/90 cursor-pointer border-none"
        >
          Back to Models
        </button>
        <button
          onClick={() => window.print()}
          className="px-10 py-4 bg-transparent text-white text-[11px] font-bold tracking-[0.18em] uppercase cursor-pointer transition-colors hover:bg-white/5 border border-white/15 hover:border-white/30"
        >
          Print Confirmation
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────── Main page ─────────────────────── */
export default function TestDrivePage() {
  const { navigate } = useRouter();
  const [step, setStep] = useState(1);
  const [bookingRef, setBookingRef] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const preselect = new URLSearchParams(window.location.search).get("model") ?? "";
  const [form, setForm] = useState<FormData>({ ...EMPTY_FORM, model: preselect });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function validateStep1() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.model) e.model = "Please select a model";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.date) e.date = "Please select a date";
    if (!form.timeSlot) e.timeSlot = "Please select a time slot";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext2() {
    if (!validateStep2()) return;
    const ref = generateRef();
    setBookingRef(ref);
    const bookings = JSON.parse(localStorage.getItem("byd-bookings") || "[]");
    bookings.push({ ...form, ref, showroom: SHOWROOM.name, createdAt: new Date().toISOString() });
    localStorage.setItem("byd-bookings", JSON.stringify(bookings));
    setStep(3);
  }

  return (
    <div className="byd-app" style={{ background: "#050505", minHeight: "100vh" }}>
      <Header />

      <main className="pt-28 pb-24 px-4 sm:px-6 md:px-12 lg:px-20 max-w-3xl mx-auto">
        {step < 3 && (
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold tracking-[0.32em] uppercase text-white/25 mb-4">{SHOWROOM.name}</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Book a Test Drive
            </h1>
            <p className="text-sm text-white/40 max-w-xs mx-auto">
              Experience the future of driving — completely free, no obligation.
            </p>
          </div>
        )}

        <StepIndicator step={step} />

        <div
          className="border border-white/[0.07] p-6 sm:p-10 md:p-14"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {step === 1 && (
            <Step1
              form={form}
              setForm={f => { setErrors({}); setForm(f); }}
              errors={errors}
              onNext={() => { if (validateStep1()) setStep(2); }}
            />
          )}
          {step === 2 && (
            <Step2
              form={form}
              setForm={f => { setErrors({}); setForm(f); }}
              errors={errors}
              onBack={() => setStep(1)}
              onNext={handleNext2}
            />
          )}
          {step === 3 && (
            <Step3 form={form} bookingRef={bookingRef} onDone={() => navigate("/")} />
          )}
        </div>

        {step < 3 && (
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 mt-12">
            {[
              "Free of charge",
              "No obligation",
              "45-min session",
              "Cancel anytime",
            ].map(t => (
              <div key={t} className="flex items-center gap-2">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5L3.8 7.5L8.5 2.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] font-medium tracking-wide text-white/30">{t}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
