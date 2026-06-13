# BYD Vietnam — Website Showroom Ô Tô

Website showroom ô tô BYD phong cách Apple dark UI, viết hoàn toàn bằng tiếng Việt. Bao gồm trang chi tiết cho 13 dòng xe, hệ thống đặt lịch lái thử, thông báo Telegram + Email, và trang quản trị admin.

> **Dành cho người nhận bàn giao:** Đọc [Mục 0 — Hướng dẫn setup nhanh](#0-hướng-dẫn-setup-nhanh-dành-cho-người-mới) trước tiên.

---

## Mục lục

0. [Hướng dẫn setup nhanh (dành cho người mới)](#0-hướng-dẫn-setup-nhanh-dành-cho-người-mới)
   - [Bước 1 — Tạo tài khoản GitHub & Fork repo](#bước-1--tạo-tài-khoản-github--fork-repo)
   - [Bước 2 — Lấy Telegram Bot Token & Chat ID](#bước-2--lấy-telegram-bot-token--chat-id)
   - [Bước 3 — Lấy Resend API Key (gửi email)](#bước-3--lấy-resend-api-key-gửi-email)
   - [Bước 4 — Deploy Backend trên Render.com](#bước-4--deploy-backend-trên-rendercom)
   - [Bước 5 — Deploy Frontend trên Cloudflare Pages](#bước-5--deploy-frontend-trên-cloudflare-pages)
   - [Bước 6 — Kiểm tra hệ thống](#bước-6--kiểm-tra-hệ-thống)
   - [Bước 7 — Tuỳ chỉnh thông tin showroom](#bước-7--tuỳ-chỉnh-thông-tin-showroom)
1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Frontend — byd-eu](#3-frontend--byd-eu)
4. [Backend — api-server](#4-backend--api-server)
5. [Danh sách xe (13 models)](#5-danh-sách-xe-13-models)
6. [Hệ thống đặt lịch lái thử](#6-hệ-thống-đặt-lịch-lái-thử)
7. [Trang Admin](#7-trang-admin)
8. [Tuỳ chỉnh nội dung chi tiết](#8-tuỳ-chỉnh-nội-dung-chi-tiết)
9. [Chạy local (Development)](#9-chạy-local-development)
10. [Thông tin liên kết hiện tại](#10-thông-tin-liên-kết-hiện-tại)

---

## 0. Hướng dẫn setup nhanh (dành cho người mới)

> Làm theo đúng thứ tự từ Bước 1 đến Bước 7. Toàn bộ quá trình mất khoảng **30–45 phút**.

---

### Bước 1 — Tạo tài khoản GitHub & Fork repo

**GitHub** là nơi chứa toàn bộ code của website. Bạn cần fork (sao chép) repo về tài khoản của mình.

1. Vào **[github.com](https://github.com)** → Đăng ký tài khoản miễn phí (nếu chưa có)
2. Sau khi đăng nhập, vào link repo gốc:
   ```
   https://github.com/wfign16zy3elx78p-ship-it/HoangHai
   ```
3. Nhấn nút **"Fork"** (góc trên bên phải)
4. Chọn tài khoản của bạn làm owner → Nhấn **"Create fork"**
5. Chờ vài giây → bạn sẽ có repo riêng tại:
   ```
   https://github.com/TEN_GITHUB_CUA_BAN/Jimmy
   ```

> ✅ Từ đây về sau, mọi thay đổi bạn làm đều nằm trong repo của bạn, không ảnh hưởng bản gốc.

---

### Bước 2 — Lấy Telegram Bot Token & Chat ID

Telegram Bot sẽ nhắn tin cho bạn mỗi khi có người đặt lịch lái thử.

> **Bước này là tuỳ chọn.** Nếu không muốn nhận thông báo Telegram, bỏ qua và để trống env `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID`.

#### 2a. Tạo Bot Telegram

1. Mở app **Telegram** trên điện thoại hoặc máy tính
2. Tìm kiếm **`@BotFather`** → nhấn vào và chọn **"Start"**
3. Gõ lệnh: `/newbot`
4. BotFather hỏi **"Alright, a new bot. How are we going to call it?"** → Nhập tên bot (vd: `BYD Showroom Bot`)
5. BotFather hỏi username → Nhập username kết thúc bằng `bot` (vd: `byd_showroom_xyz_bot`)
6. BotFather trả về thông báo thành công kèm **Token** dạng:
   ```
   1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ123456789
   ```
7. **Lưu lại Token này** — đây là `TELEGRAM_BOT_TOKEN`

#### 2b. Lấy Chat ID

1. Tìm kiếm username bot vừa tạo (vd: `@byd_showroom_xyz_bot`) → nhấn **"Start"**
2. Gõ bất kỳ tin nhắn gì (vd: `hello`)
3. Mở trình duyệt, truy cập URL sau (thay `TOKEN` bằng token của bạn):
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```
   Ví dụ:
   ```
   https://api.telegram.org/bot1234567890:ABCdef.../getUpdates
   ```
4. Trang web trả về JSON — tìm dòng `"chat":{"id":` → số phía sau là **Chat ID**:
   ```json
   "chat": { "id": 987654321, ... }
   ```
5. **Lưu lại số này** — đây là `TELEGRAM_CHAT_ID`

> **Lưu ý:** Nếu muốn nhận thông báo vào **group Telegram** thay vì chat riêng:
> - Thêm bot vào group
> - Gửi tin nhắn trong group
> - Chat ID của group sẽ là số âm (vd: `-987654321`)

---

### Bước 3 — Lấy Resend API Key (gửi email)

Resend dùng để gửi email thông báo booking. Miễn phí tới 3.000 email/tháng.

> **Bước này là tuỳ chọn.** Nếu không muốn nhận email, bỏ qua và để trống env `RESEND_API_KEY` và `NOTIFY_EMAIL`.

1. Vào **[resend.com](https://resend.com)** → Đăng ký tài khoản (có thể dùng Google/GitHub)
2. Sau khi đăng nhập, vào **"API Keys"** (menu bên trái)
3. Nhấn **"Create API Key"**
4. Đặt tên (vd: `BYD Showroom`) → Nhấn **"Add"**
5. Copy API Key hiện ra (chỉ hiện **một lần duy nhất**!):
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
6. **Lưu lại ngay** — đây là `RESEND_API_KEY`

> **Lưu ý về email người gửi:** Mặc định email gửi từ `onboarding@resend.dev` (không cần domain riêng). Nếu muốn gửi từ domain của bạn (vd: `no-reply@yourdomain.com`), cần verify domain trong Resend và đặt env `NOTIFY_FROM`.

---

### Bước 4 — Deploy Backend trên Render.com

Backend là server nhận booking và gửi thông báo.

1. Vào **[render.com](https://render.com)** → Đăng ký tài khoản (dùng GitHub để tiện)

2. Sau khi đăng nhập, nhấn **"New +"** → chọn **"Web Service"**

3. Chọn **"Build and deploy from a Git repository"** → Nhấn **"Next"**

4. Nhấn **"Connect GitHub"** → Authorize Render → Tìm và chọn repo **`Jimmy`** của bạn → Nhấn **"Connect"**

5. Điền thông tin cấu hình:

   | Trường | Giá trị cần điền |
   |--------|-----------------|
   | **Name** | Đặt tên tuỳ ý (vd: `byd-api`) |
   | **Region** | Chọn gần Việt Nam nhất: `Singapore (Southeast Asia)` |
   | **Branch** | `main` |
   | **Root Directory** | `artifacts/api-server` |
   | **Runtime** | `Node` |
   | **Build Command** | `pnpm install && pnpm run build` |
   | **Start Command** | `pnpm run start` |
   | **Instance Type** | `Free` |

6. Cuộn xuống phần **"Environment Variables"** → Nhấn **"Add Environment Variable"** và thêm từng biến:

   | Key | Value | Ghi chú |
   |-----|-------|---------|
   | `TELEGRAM_BOT_TOKEN` | Token từ Bước 2a | Để trống nếu không dùng |
   | `TELEGRAM_CHAT_ID` | Chat ID từ Bước 2b | Để trống nếu không dùng |
   | `RESEND_API_KEY` | API Key từ Bước 3 | Để trống nếu không dùng |
   | `NOTIFY_EMAIL` | Email của bạn (vd: `ban@gmail.com`) | Để trống nếu không dùng |
   | `ADMIN_PASSWORD` | Mật khẩu tự đặt (vd: `Matkhau@123`) | **Bắt buộc đổi!** |

7. Nhấn **"Create Web Service"**

8. Chờ **3–5 phút** cho Render build xong (xem log để theo dõi)

9. Khi status chuyển thành **"Live"**, copy URL của service:
   ```
   https://ten-service-ban-dat.onrender.com
   ```
   **Lưu lại URL này** — cần dùng ở Bước 5.

---

### Bước 5 — Deploy Frontend trên Cloudflare Pages

Frontend là giao diện website mà người dùng thấy.

1. Vào **[pages.cloudflare.com](https://pages.cloudflare.com)** → Đăng ký tài khoản Cloudflare (miễn phí)

2. Sau khi đăng nhập, nhấn **"Create a project"**

3. Chọn **"Connect to Git"** → Nhấn **"Connect GitHub"**

4. Authorize Cloudflare truy cập GitHub → Chọn repo **`Jimmy`** của bạn

5. Nhấn **"Begin setup"**

6. Điền thông tin cấu hình:

   | Trường | Giá trị cần điền |
   |--------|-----------------|
   | **Project name** | Tên tuỳ ý (vd: `byd-vietnam`) — sẽ thành `byd-vietnam.pages.dev` |
   | **Production branch** | `main` |
   | **Framework preset** | `None` (không chọn gì) |
   | **Build command** | `pnpm --filter @workspace/byd-eu run build` |
   | **Build output directory** | `artifacts/byd-eu/dist/public` |
   | **Root directory (advanced)** | *(để trống hoàn toàn)* |

7. Cuộn xuống **"Environment variables (advanced)"** → Nhấn **"Add variable"**:

   | Variable name | Value |
   |---------------|-------|
   | `VITE_API_URL` | URL Render từ Bước 4 (vd: `https://byd-api.onrender.com`) |

8. Nhấn **"Save and Deploy"**

9. Chờ **2–3 phút** → Website live tại:
   ```
   https://ten-project-ban-dat.pages.dev
   ```

> ✅ Mỗi lần bạn push code lên GitHub, Cloudflare sẽ tự động build và deploy lại. **Hoàn toàn miễn phí, không giới hạn số lần build.**

#### Gắn domain riêng (tuỳ chọn)

Nếu bạn có domain riêng (vd: `byd.vn`):
1. Vào project Cloudflare Pages → tab **"Custom domains"**
2. Nhấn **"Set up a custom domain"**
3. Nhập domain của bạn → Làm theo hướng dẫn thêm DNS record
4. Chờ vài phút để DNS propagate

---

### Bước 6 — Kiểm tra hệ thống

Sau khi deploy xong, kiểm tra từng phần:

#### ✅ Kiểm tra website

1. Mở URL Cloudflare Pages của bạn
2. Xác nhận trang chủ hiển thị đúng
3. Click vào một xe → xem trang chi tiết
4. Click "LÁI THỬ" từ hero → xem form đặt lịch

#### ✅ Kiểm tra booking + thông báo

1. Vào trang `/test-drive` trên website của bạn
2. Điền đầy đủ form với thông tin test (dùng email/SĐT giả)
3. Nhấn **"Xác Nhận Đặt Lịch"**
4. Nếu Telegram đã cấu hình → kiểm tra bot có nhắn tin không
5. Nếu Resend đã cấu hình → kiểm tra email trong hộp thư

#### ✅ Kiểm tra trang Admin

1. Vào `https://website-cua-ban.pages.dev/admin`
2. Nhập mật khẩu đã đặt ở `ADMIN_PASSWORD`
3. Xác nhận thấy booking vừa test

#### ❌ Xử lý khi gặp lỗi

| Triệu chứng | Nguyên nhân | Giải pháp |
|-------------|-------------|-----------|
| Trang trắng hoàn toàn | Build output sai | Kiểm tra lại "Build output directory" trong Cloudflare |
| Trang 404 khi refresh | SPA routing chưa cấu hình | File `public/_redirects` phải tồn tại trong repo |
| Form gửi được nhưng không nhận Telegram | Token/Chat ID sai | Kiểm tra lại env trên Render |
| Trang Admin không đăng nhập được | Password sai | Kiểm tra `ADMIN_PASSWORD` env trên Render |
| Render mất 30 giây mới phản hồi | Free tier đang ngủ | Bình thường — request đầu tiên sau 15 phút không dùng sẽ chậm |

---

### Bước 7 — Tuỳ chỉnh thông tin showroom

Sau khi hệ thống chạy ổn, cần đổi thông tin showroom trong code:

1. Trên GitHub, mở repo của bạn
2. Điều hướng đến file:
   ```
   artifacts/byd-eu/src/pages/TestDrivePage.tsx
   ```
3. Nhấn icon bút chì (Edit) góc phải
4. Tìm đoạn code đầu file (dòng 7–13):
   ```typescript
   const SHOWROOM = {
     name: "BYD Showroom",
     address: "123 Showroom Street",
     city: "Your City",
     hours: "Thứ Hai – Thứ Bảy: 8:00 – 18:00",
     phone: "+XX XXX XXX XXXX",
   };
   ```
5. Đổi thành thông tin thật của showroom:
   ```typescript
   const SHOWROOM = {
     name: "BYD Sài Gòn",
     address: "123 Nguyễn Văn Linh, Quận 7",
     city: "TP. Hồ Chí Minh",
     hours: "Thứ Hai – Thứ Bảy: 8:00 – 18:00",
     phone: "+84 901 234 567",
   };
   ```
6. Nhấn **"Commit changes"** → Cloudflare sẽ tự động build lại trong 2–3 phút

---

## 1. Tổng quan kiến trúc

```
┌─────────────────────────────────────────────────────┐
│                  Người dùng (Browser)                │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────▼─────────────┐
          │   Cloudflare Pages       │
          │   (Frontend — React SPA) │
          │   Miễn phí, không giới   │
          │   hạn build              │
          └────────────┬─────────────┘
                       │ API calls (HTTPS)
          ┌────────────▼─────────────┐
          │   Render.com             │
          │   (Backend — Express)    │
          │   Free tier (sleep 15ph) │
          └────┬──────────┬──────────┘
               │          │
    ┌──────────▼──┐  ┌────▼────────┐
    │  Telegram   │  │   Resend    │
    │  Bot Alert  │  │  Email API  │
    │  (optional) │  │  (optional) │
    └─────────────┘  └─────────────┘
```

- **Frontend**: React SPA deploy miễn phí trên Cloudflare Pages
- **Backend**: Node.js/Express deploy trên Render.com free tier
- **Thông báo**: Telegram Bot + Resend Email khi có booking (đều optional)
- **GitHub Repo gốc**: `https://github.com/wfign16zy3elx78p-ship-it/Jimmy`

---

## 2. Cấu trúc thư mục

```
/
├── artifacts/
│   ├── byd-eu/                         # Frontend React app
│   │   ├── src/
│   │   │   ├── App.tsx                 # Root component, routing
│   │   │   ├── main.tsx                # Entry point
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx          # Navigation bar + mega menu
│   │   │   │   ├── Hero.tsx            # Hero slider (video + image)
│   │   │   │   ├── Models.tsx          # Grid danh sách xe (tab điện/hybrid)
│   │   │   │   ├── Technology.tsx      # Công nghệ BYD
│   │   │   │   ├── ContactSection.tsx  # Section liên hệ (ảnh showroom)
│   │   │   │   ├── Footer.tsx          # Footer
│   │   │   │   └── ui/                 # Shadcn/Radix UI components
│   │   │   ├── pages/
│   │   │   │   ├── GenericCarPage.tsx  # Trang chi tiết xe dùng chung (12 xe)
│   │   │   │   ├── Sealion7Page.tsx    # Trang riêng cho SEALION 7
│   │   │   │   ├── TestDrivePage.tsx   # Form đặt lịch lái thử ← SỬA Ở ĐÂY
│   │   │   │   ├── AdminPanelPage.tsx  # Trang quản trị booking
│   │   │   │   └── not-found.tsx       # Trang 404
│   │   │   ├── data/
│   │   │   │   ├── carDetails.json     # Data chi tiết 13 xe ← SỬA ĐỂ THÊM/ĐỔI XE
│   │   │   │   ├── models.json         # Danh sách xe grid ← SỬA ĐỂ THÊM/ĐỔI XE
│   │   │   │   ├── heroSlides.json     # Slides hero ← SỬA ĐỂ ĐỔI HERO
│   │   │   │   └── technology.json     # Data công nghệ
│   │   │   └── lib/
│   │   │       └── router.ts           # Custom router (wouter)
│   │   ├── public/
│   │   │   ├── _redirects              # SPA routing (Cloudflare/Netlify)
│   │   │   └── images/                 # Tất cả ảnh + video xe
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── api-server/                     # Backend Express API
│       ├── src/
│       │   ├── index.ts                # Server entry point
│       │   ├── app.ts                  # Express setup, CORS
│       │   └── routes/
│       │       ├── index.ts            # Route aggregator
│       │       └── booking.ts          # Booking API + Admin API ← LOGIC CHÍNH
│       └── package.json
│
├── pnpm-workspace.yaml                 # pnpm monorepo config
└── README.md                           # File này
```

---

## 3. Frontend — byd-eu

### Công nghệ sử dụng

| Thư viện | Phiên bản | Mục đích |
|----------|-----------|----------|
| React | 18+ | UI framework |
| Vite | Latest | Build tool, dev server |
| TailwindCSS | 4.x | Styling |
| Framer Motion | Latest | Animations |
| Wouter | 3.x | Client-side routing |
| Lucide React | Latest | Icons |
| React Icons | 5.x | Icon set bổ sung |
| Shadcn/Radix UI | Latest | UI components |
| Embla Carousel | 8.x | Carousel |

### Các trang (Pages)

| URL | Component | Mô tả |
|-----|-----------|-------|
| `/` | `HomePage` | Trang chủ: Hero slider, danh sách xe, công nghệ, liên hệ |
| `/car/sealion-7` | `Sealion7Page` | Trang chi tiết SEALION 7 (trang riêng) |
| `/car/:slug` | `GenericCarPage` | Trang chi tiết 12 xe còn lại (đọc từ carDetails.json) |
| `/test-drive` | `TestDrivePage` | Form đặt lịch lái thử |
| `/admin` | `AdminPanelPage` | Quản trị — xem danh sách booking |
| `*` | `NotFound` | Trang 404 |

### Environment variables (Frontend)

Đặt trong **Cloudflare Pages → Settings → Environment variables**:

| Biến | Bắt buộc | Mặc định | Mô tả |
|------|----------|----------|-------|
| `VITE_API_URL` | Không | `https://jimmy-tebm.onrender.com` | URL backend API |

---

## 4. Backend — api-server

### API Endpoints

#### `POST /api/booking/notify` — Nhận booking mới

```json
// Request body
{
  "ref": "BYD-AB12-3456",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "email": "example@email.com",
  "phone": "0901234567",
  "model": "sealion-7",
  "modelName": "BYD SEALION 7",
  "date": "2025-07-15",
  "timeSlot": "10:00 SA",
  "showroom": "BYD Showroom — 123 Showroom Street",
  "notes": "Ghi chú"
}

// Response
{ "ok": true, "results": { "telegram": "sent", "email": "sent" } }
```

#### `GET /api/admin/bookings` — Xem danh sách booking

```
Header: Authorization: Bearer <ADMIN_PASSWORD>
```

### Environment variables (Backend)

Đặt trong **Render.com → Service → Environment**:

| Biến | Bắt buộc | Mặc định | Mô tả |
|------|----------|----------|-------|
| `TELEGRAM_BOT_TOKEN` | Không | — | Token bot Telegram (từ @BotFather) |
| `TELEGRAM_CHAT_ID` | Không | — | Chat ID nhận thông báo |
| `RESEND_API_KEY` | Không | — | API key từ resend.com |
| `NOTIFY_EMAIL` | Không | — | Email nhận thông báo booking |
| `NOTIFY_FROM` | Không | `BYD Showroom <onboarding@resend.dev>` | Email người gửi |
| `ADMIN_PASSWORD` | **Nên đặt** | `byd-admin-2024` | Mật khẩu trang admin |
| `PORT` | Không | `3000` | Render tự set, không cần đặt |

> **Lưu ý quan trọng:** Nếu để `ADMIN_PASSWORD` mặc định là `byd-admin-2024`, bất kỳ ai biết mật khẩu này đều vào được trang admin. **Hãy đổi ngay sau khi deploy!**

### Hệ thống thông báo

Khi có booking mới, server gửi đồng thời 2 kênh (một cái lỗi không ảnh hưởng cái kia):

```
Booking đến → Lưu vào bộ nhớ → Gửi Telegram (nếu có env)
                                → Gửi Email (nếu có env)
                              → Trả về { ok: true }
```

> **Quan trọng:** Booking lưu **in-memory** — **mất khi Render restart server** (khi deploy lại hoặc server tự restart). Để lưu vĩnh viễn cần thêm database (PostgreSQL).

---

## 5. Danh sách xe (13 models)

### Xe Điện Thuần (BEV) — 8 xe

| Slug URL | Tên xe | Loại xe |
|----------|--------|---------|
| `/car/atto-3-evo` | BYD ATTO 3 EVO | SUV Cỡ Nhỏ |
| `/car/seal` | BYD SEAL | Sedan Hiệu Suất Cao |
| `/car/seal-u` | BYD SEAL U | SUV Đa Dụng |
| `/car/sealion-7` | BYD SEALION 7 | SUV Hiệu Suất Cao |
| `/car/han` | BYD HAN | Sedan Hạng Sang |
| `/car/tang` | BYD TANG | SUV 7 Chỗ |
| `/car/dolphin` | BYD DOLPHIN | Hatchback |
| `/car/dolphin-surf` | BYD DOLPHIN SURF | Xe Điện Phiêu Lưu |

### Xe Hybrid Sạc Điện (PHEV/DM-i) — 5 xe

| Slug URL | Tên xe | Loại xe |
|----------|--------|---------|
| `/car/sealion-5-dm-i` | BYD SEALION 5 DM-i | SUV Hybrid |
| `/car/seal-u-dm-i` | BYD SEAL U DM-i | SUV Hybrid |
| `/car/seal-6-dm-i` | BYD SEAL 6 DM-i | Sedan Hybrid |
| `/car/seal-6-dm-i-touring` | BYD SEAL 6 DM-i TOURING | Sedan Touring |
| `/car/atto-2-dm-i` | BYD ATTO 2 DM-i | Compact Hybrid |

---

## 6. Hệ thống đặt lịch lái thử

### Form `/test-drive`

- **Chọn xe**: dropdown 13 xe
- **Họ**: bắt buộc
- **Tên**: bắt buộc
- **Email**: bắt buộc, validate format
- **Số điện thoại**: bắt buộc
- **Ngày**: tối thiểu 2 ngày từ hôm nay, tối đa 90 ngày tới
- **Khung giờ**: 8 slot từ 9:00 SA đến 17:00 CH
- **Ghi chú**: tuỳ chọn

### Mã booking

Tự sinh theo format `BYD-XXXX-NNNN`:
```
BYD-AB12-5678
```

---

## 7. Trang Admin

**URL:** `https://website-cua-ban.pages.dev/admin`

- Đăng nhập bằng `ADMIN_PASSWORD` đã đặt trên Render
- Xem toàn bộ booking: mã ref, tên, SĐT, email, xe, ngày giờ, showroom, ghi chú
- Token lưu `sessionStorage` — tự đăng xuất khi đóng tab
- Nhắc nhở: booking **mất khi Render restart**

---

## 8. Tuỳ chỉnh nội dung chi tiết

### Đổi thông tin showroom

File: `artifacts/byd-eu/src/pages/TestDrivePage.tsx`

```typescript
const SHOWROOM = {
  name: "Tên Showroom Của Bạn",      // Hiển thị trên form
  address: "Địa chỉ đường phố",
  city: "Tên thành phố",
  hours: "Thứ Hai – Thứ Bảy: 8:00 – 18:00",
  phone: "+84 XXX XXX XXXX",
};
```

### Đổi slides hero trang chủ

File: `artifacts/byd-eu/src/data/heroSlides.json`

```json
[
  {
    "id": 1,
    "imgPc": "/images/TEN_ANH.webp",
    "video": "/images/TEN_VIDEO.mp4",
    "title": "BYD TÊN XE",
    "subtitle": "Tagline xe",
    "btnList": [
      { "text": "KHÁM PHÁ", "link": "/car/slug-xe", "type": 1 },
      { "text": "LÁI THỬ", "link": "/test-drive", "type": 2 }
    ]
  }
]
```

### Thêm xe mới

**Bước 1** — Thêm ảnh xe vào `artifacts/byd-eu/public/images/`

**Bước 2** — Thêm vào `artifacts/byd-eu/src/data/models.json`:
```json
{
  "electric": [
    { "name": "BYD TÊN XE", "desc": "Mô tả ngắn", "img": "/images/ten-xe.webp", "link": "/car/ten-xe-slug" }
  ]
}
```

**Bước 3** — Thêm vào `artifacts/byd-eu/src/data/carDetails.json`:
```json
{
  "ten-xe-slug": {
    "slug": "ten-xe-slug",
    "name": "BYD TÊN XE",
    "tagline": "Tagline tiếng Anh",
    "description": "Mô tả chi tiết...",
    "heroImg": "/images/ten-xe.webp",
    "heroVideo": null,
    "color": "#1a4f9e",
    "stats": [
      { "label": "Range", "value": 456, "unit": "km" },
      { "label": "0–100 km/h", "value": 4.5, "unit": "s" },
      { "label": "Max Power", "value": 390, "unit": "kW" },
      { "label": "Battery", "value": 82.56, "unit": "kWh" }
    ],
    "features": [
      {
        "title": "Tiêu đề tính năng",
        "subtitle": "Subtitle",
        "desc": "Mô tả chi tiết tính năng...",
        "img": "/images/ten-xe-feature-1.png",
        "imgRight": false
      }
    ],
    "specs": {
      "Performance": [
        { "label": "Drive Type", "value": "AWD" }
      ],
      "Battery & Range": [
        { "label": "Battery Capacity", "value": "82.56 kWh" }
      ]
    }
  }
}
```

### Đổi mật khẩu admin

Trong Render → Service → Environment → đổi giá trị `ADMIN_PASSWORD`

---

## 9. Chạy local (Development)

### Yêu cầu hệ thống

- **Node.js** 18 trở lên: [nodejs.org](https://nodejs.org)
- **pnpm** 8 trở lên: `npm install -g pnpm`
- **Git**: [git-scm.com](https://git-scm.com)

### Cài đặt

```bash
# Clone repo về máy
git clone https://github.com/TEN_GITHUB_CUA_BAN/Jimmy.git
cd Jimmy

# Cài dependencies
pnpm install
```

### Cấu hình môi trường local

Tạo file `artifacts/api-server/.env`:
```env
TELEGRAM_BOT_TOKEN=token_telegram_cua_ban
TELEGRAM_CHAT_ID=chat_id_cua_ban
RESEND_API_KEY=re_xxxxxxxxxxxxxx
NOTIFY_EMAIL=email_cua_ban@gmail.com
ADMIN_PASSWORD=matkhau_admin
PORT=3000
```

### Chạy development

**Terminal 1 — Backend:**
```bash
pnpm --filter @workspace/api-server run dev
# API chạy tại http://localhost:3000
```

**Terminal 2 — Frontend:**
```bash
pnpm --filter @workspace/byd-eu run dev
# Website chạy tại http://localhost:5173
```

### Build production

```bash
# Build frontend
pnpm --filter @workspace/byd-eu run build
# Output: artifacts/byd-eu/dist/public/

# Build backend
pnpm --filter @workspace/api-server run build
# Output: artifacts/api-server/dist/
```

---

## 10. Thông tin liên kết hiện tại

| Dịch vụ | URL |
|---------|-----|
| 🌐 Frontend | https://tophbeifong.pages.dev |
| ⚙️ Backend API | https://jimmy-tebm.onrender.com |
| 📦 GitHub Repo | https://github.com/wfign16zy3elx78p-ship-it/Jimmy |

### Checklist khi bàn giao

- [ ] Khách hàng đã fork repo GitHub
- [ ] Render deploy xong, status = Live
- [ ] Cloudflare Pages deploy xong, website mở được
- [ ] `VITE_API_URL` trên Cloudflare trỏ đúng URL Render mới
- [ ] `ADMIN_PASSWORD` đã đổi khỏi mặc định
- [ ] Test đặt lịch → nhận thông báo thành công
- [ ] Test đăng nhập admin → thấy booking
- [ ] Đổi thông tin showroom trong `TestDrivePage.tsx`

---

*Cập nhật lần cuối: Tháng 6, 2025*
