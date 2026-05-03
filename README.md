# 🚗 BYD Web-Launch-Kit

Giải pháp website giới thiệu xe và đặt lịch lái thử chuyên nghiệp dành cho các Showroom BYD. Tích hợp hệ thống thông báo tự động, tối ưu hóa cho nền tảng Vercel.

---

## 🚀 1. Hướng dẫn triển khai (Deploy)

Dự án được thiết kế để chạy trên **Vercel** với cấu hình tối ưu sẵn:

1. **Đăng nhập Vercel**: Truy cập [vercel.com](https://vercel.com) và kết nối tài khoản GitHub.
2. **Import Repo**: Chọn repository `Web-Launch-Kit`.
3. **Cấu hình Build (Quan trọng)**:
   - **Root Directory**: `artifacts/byd-eu`
   - **Framework Preset**: `Vite`
   - **Build Command**: `pnpm install && pnpm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: (Để trống)
4. **Deploy**: Nhấn nút `Deploy` và đợi ~2 phút để nhận domain `.vercel.app`.

---

## ⚙️ 2. Cấu hình biến môi trường (Secrets)

Vào **Settings -> Environment Variables** trên Vercel để thêm 4 biến nhận thông báo:


| Biến | Giá trị | Cách lấy |
| :--- | :--- | :--- |
| `TELEGRAM_BOT_TOKEN` | Token Bot | Nhắn `/newbot` cho `@BotFather` |
| `TELEGRAM_CHAT_ID` | ID chat | Nhắn tin cho bot -> check `api.telegram.org/bot<TOKEN>/getUpdates` |
| `RESEND_API_KEY` | API Key | Đăng ký miễn phí tại `resend.com` |
| `NOTIFY_EMAIL` | Email nhận | Nhập email của khách hàng muốn nhận thông báo |

---

## 🛠 3. Tùy chỉnh thông tin Showroom

Sửa thông tin thực tế tại file `artifacts/byd-eu/src/pages/TestDrivePage.tsx` (Dòng 7–13):

```javascript
const SHOWROOM = {
  name: "BYD Showroom Hà Nội",        // Tên showroom
  address: "123 Đường Láng, Đống Đa", // Địa chỉ thật
  city: "Hà Nội",                      // Thành phố
  hours: "Thứ Hai – Thứ Bảy: 8:00 – 18:00",
  phone: "+84 912 345 678",            // SĐT thật
};
```

---

## 🖼️ 4. Bảng tra cứu đường dẫn ảnh (Assets)

Bạn chỉ cần upload ảnh mới vào `artifacts/byd-eu/public/images/` trùng tên file dưới đây để cập nhật giao diện.

### 🔵 Dòng xe Thuần Điện (EV)

| Dòng xe | Hero Banner | Ảnh tính năng (Features) |
| :--- | :--- | :--- |
| **BYD HAN** | `BYD-HAN.webp` | `han-design-v2.png`, `han-interior-v2.png`, `han-battery-v2.png`, `han-performance-v2.png`, `han-cockpit-v2.png` |
| **ATTO 3 EVO** | `BYD-ATTO3-EVO.webp` | `atto3-evo-design-v2.png`, `atto3-evo-interior-v2.png`, `atto3-evo-range-v2.png`, `atto3-evo-performance-v2.png`, `atto3-evo-cockpit-v2.png` |
| **SEAL** | `seal-hero-new.png` | `seal-design-01.png`, `seal-interior-new.png`, `seal-battery-01.png`, `seal-performance-01.png`, `seal-dilink-01.png` |
| **SEAL U** | `BYD-SEAL-U.webp` | `sealu.webp`, `seal-u-interior-01.png`, `seal-u-tech-01.png`, `seal-u-performance-01.png`, `seal-u-range-01.png` |
| **SEALION 7** | `BYD-SEALION-7.webp` | `sealion-7-exterior-01.png`, `sealion-7-interior-01.png`, `sealion-7-battery-01.png`, `sealion-7-performance-01.png`, `sealion-7-tech-01.png` |
| **TANG** | `BYD-TANG.webp` | `tang-interior-01.png`, `tang-tech-01.png`, `tang-performance-new.png`, `tang-cockpit-new.png` |
| **DOLPHIN** | `BYD-DOLPIN.webp` | `dolphin-interior-01.png`, `dolphin-performance-new.png`, `dolphin-cockpit-new.png` |
| **DOLPHIN SURF**| `BYD-DOLPHIN-SURF.webp`| `dolphin-surf-lifestyle-01.png`, `dolphin-surf-performance-01.png` |

### 🟢 Dòng xe Hybrid (DM-i)

| Dòng xe | Hero Banner | Ảnh tính năng (Features) |
| :--- | :--- | :--- |
| **SEALION 5 DM-i**| `BYD-SEALION5-DM-i.webp`| `sealion5-interior-01.png`, `sealion5-performance-01.png`, `sealion5-tech-01.png` |
| **SEAL U DM-i** | `BYD-SEAL-U-DM-i.webp` | `seal-u-dmi-interior-01.png`, `seal-u-dmi-tech-01.png`, `seal-u-dmi-performance-01.png` |
| **SEAL 6 DM-i** | `BYD-SEAL-6-DMi.webp` | `seal6-dm-i.webp`, `seal-6-dmi-interior-01.png`, `seal-6-dmi-tech-01.png`, `seal6-dmi-performance-01.png` |
| **SEAL 6 Touring**| `TOURING.webp` | `seal6-dm-i-touring.webp`, `seal-6-touring-interior-01.png`, `seal-6-touring-tech-01.png`, `seal6-touring-performance-01.png` |
| **ATTO 2 DM-i** | `Atto2dmi.webp` | `atto2-interior-01.png`, `atto2-tech-01.png`, `atto2-dmi-performance-01.png` |

---

## 📝 Lưu ý kỹ thuật
- **SPA Routing**: Đã được cấu hình qua `vercel.json` để không lỗi khi reload trang con.
- **Auto-Update**: Mọi thay đổi khi `push` lên GitHub sẽ được Vercel tự động cập nhật sau 1-2 phút.
- **API**: Serverless Function đảm nhận việc gửi thông báo, không tốn chi phí duy trì server.
