import { useState, useEffect, useCallback } from "react";
import { useRouter } from "@/lib/router";

const API_BASE = import.meta.env.VITE_API_URL ?? "https://jimmy-tebm.onrender.com";
const SESSION_KEY = "byd-admin-token";

interface Booking {
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  modelName: string;
  date: string;
  timeSlot: string;
  showroom: string;
  notes?: string;
  createdAt?: string;
}

/* ── helpers ── */
function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── Login screen ── */
function LoginScreen({ onLogin }: { onLogin: (pass: string) => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${pass}` },
      });
      if (res.status === 401) { setError("Sai mật khẩu. Vui lòng thử lại."); return; }
      if (!res.ok) { setError("Lỗi kết nối máy chủ."); return; }
      sessionStorage.setItem(SESSION_KEY, pass);
      onLogin(pass);
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#050505" }}
    >
      <div className="mb-10 text-center">
        <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/20 mb-3">BYD Showroom</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Quản Trị Viên</h1>
        <p className="text-sm text-white/35 mt-2">Đăng nhập để xem danh sách đặt lịch lái thử</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5 border border-white/[0.07] p-8"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">
            Tên đăng nhập
          </label>
          <input
            type="text"
            value="admin"
            readOnly
            className="w-full px-4 py-3 text-sm text-white/40 border border-white/[0.06]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40">
            Mật Khẩu
          </label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••••"
            autoFocus
            className="w-full px-4 py-3 text-sm text-white border border-white/[0.08] focus:outline-none focus:border-white/30 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
          {error && <p className="text-[11px] text-red-400">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || !pass}
          className="w-full py-3.5 bg-white text-black text-[11px] font-bold tracking-[0.2em] uppercase transition-opacity disabled:opacity-40"
        >
          {loading ? "Đang xác thực..." : "Đăng Nhập"}
        </button>
      </form>

      <p className="text-[10px] text-white/15 mt-8 tracking-wide">
        Mật khẩu được cài đặt qua biến môi trường <code className="text-white/25">ADMIN_PASSWORD</code>
      </p>
    </div>
  );
}

/* ── Dashboard ── */
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Lỗi tải dữ liệu");
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    return (
      b.ref.toLowerCase().includes(q) ||
      `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      (b.modelName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 border-b border-white/[0.06]"
        style={{ background: "rgba(5,5,5,0.95)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-[0.35em] uppercase text-white/30">BYD</span>
          <span className="text-white/10">|</span>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/60">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-white/25 hidden sm:block">
            {bookings.length} lịch đặt
          </span>
          <button
            onClick={fetchBookings}
            className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors px-3 py-1.5 border border-white/10 hover:border-white/25"
          >
            Tải lại
          </button>
          <button
            onClick={onLogout}
            className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/40 hover:text-red-400 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Tổng Đặt Lịch", value: bookings.length },
            { label: "Hôm Nay", value: bookings.filter(b => b.createdAt?.startsWith(new Date().toISOString().slice(0,10))).length },
            { label: "Tuần Này", value: (() => { const d = new Date(); d.setDate(d.getDate()-7); return bookings.filter(b => b.createdAt && new Date(b.createdAt) > d).length; })() },
            { label: "Xe Phổ Biến", value: bookings.length ? [...bookings.reduce((m, b) => { m.set(b.modelName, (m.get(b.modelName)??0)+1); return m; }, new Map<string,number>())].sort((a,b)=>b[1]-a[1])[0]?.[0]?.split(" ").slice(1).join(" ") ?? "—" : "—" },
          ].map(s => (
            <div key={s.label} className="border border-white/[0.07] p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/25 mb-2">{s.label}</p>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại, mã đặt lịch, dòng xe..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3.5 text-sm text-white placeholder-white/20 border border-white/[0.08] focus:outline-none focus:border-white/25 transition-colors"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-24 text-white/30 text-sm tracking-wide">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-center py-24 text-red-400 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-white/20 text-sm tracking-wide">
            {search ? "Không tìm thấy kết quả." : "Chưa có lịch đặt nào."}
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.01)" }}>
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Mã", "Khách Hàng", "Dòng Xe", "Ngày / Giờ", "Liên Hệ", "Đặt Lúc", ""].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(b => (
                  <tr
                    key={b.ref}
                    className="hover:bg-white/[0.025] transition-colors cursor-pointer"
                    onClick={() => setSelected(b)}
                  >
                    <td className="px-5 py-4 font-mono text-[11px] text-white/50">{b.ref}</td>
                    <td className="px-5 py-4 font-semibold text-white/80">{b.firstName} {b.lastName}</td>
                    <td className="px-5 py-4 text-white/60 text-[12px]">{b.modelName}</td>
                    <td className="px-5 py-4 text-white/50 text-[12px]">{b.date}<br/><span className="text-white/30">{b.timeSlot}</span></td>
                    <td className="px-5 py-4 text-white/45 text-[11px]">{b.email}<br/>{b.phone}</td>
                    <td className="px-5 py-4 text-white/30 text-[11px]">{formatDate(b.createdAt)}</td>
                    <td className="px-5 py-4 text-white/20 text-[11px]">Chi tiết →</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-md border border-white/[0.1] overflow-hidden"
            style={{ background: "#0f0f0f" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-white/[0.06]">
              <div>
                <p className="text-[9px] font-bold tracking-[0.3em] uppercase text-white/25 mb-1">Chi Tiết Đặt Lịch</p>
                <p className="font-mono text-sm text-white/70">{selected.ref}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {[
                ["Họ Tên", `${selected.firstName} ${selected.lastName}`],
                ["Email", selected.email],
                ["Điện Thoại", selected.phone],
                ["Dòng Xe", selected.modelName],
                ["Showroom", selected.showroom],
                ["Ngày Hẹn", selected.date],
                ["Giờ Hẹn", selected.timeSlot],
                ["Đặt Lúc", formatDate(selected.createdAt)],
                ...(selected.notes ? [["Ghi Chú", selected.notes]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4 px-7 py-3.5">
                  <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/25 w-28 flex-shrink-0 pt-0.5">{label}</span>
                  <span className="text-sm text-white/70 break-all">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-7 py-5 border-t border-white/[0.06]">
              <button
                onClick={() => setSelected(null)}
                className="w-full py-3 border border-white/15 text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 hover:text-white hover:border-white/30 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main ── */
export default function AdminPanelPage() {
  const { navigate } = useRouter();
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY));

  void navigate;

  function handleLogin(pass: string) { setToken(pass); }
  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
