import { Router, type IRouter } from "express";

const router: IRouter = Router();

/* ── helpers ────────────────────────────────────────── */

async function sendTelegram(text: string) {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];
  if (!token || !chatId) return;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!res.ok) throw new Error(`Telegram error: ${await res.text()}`);
}

async function sendEmail(subject: string, html: string) {
  const apiKey = process.env["RESEND_API_KEY"];
  const to     = process.env["NOTIFY_EMAIL"];
  const from   = process.env["NOTIFY_FROM"] ?? "BYD Showroom <onboarding@resend.dev>";

  if (!apiKey || !to) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend error: ${await res.text()}`);
}

/* ── booking email template ─────────────────────────── */

function buildEmailHtml(b: BookingPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 24px; }
    .card { background: #fff; max-width: 520px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #0f0f0f; color: #fff; padding: 28px 32px; }
    .header h1 { margin: 0; font-size: 20px; letter-spacing: 2px; text-transform: uppercase; }
    .header p  { margin: 6px 0 0; font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 1px; }
    .body { padding: 28px 32px; }
    .ref { background: #f9f9f9; border: 1px solid #eee; border-radius: 6px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #444; }
    .ref strong { color: #000; font-size: 15px; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    td { padding: 9px 0; border-bottom: 1px solid #f0f0f0; color: #555; }
    td:first-child { color: #999; text-transform: uppercase; font-size: 11px; letter-spacing: 0.8px; width: 38%; }
    td:last-child { color: #111; font-weight: 600; }
    .notes { margin-top: 16px; font-size: 12px; color: #888; background: #fafafa; padding: 10px 14px; border-left: 3px solid #ddd; }
    .footer { padding: 16px 32px; background: #f9f9f9; font-size: 11px; color: #aaa; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>BYD — New Test Drive</h1>
      <p>Booking notification</p>
    </div>
    <div class="body">
      <div class="ref">
        Booking reference: <strong>${b.ref}</strong>
      </div>
      <table>
        <tr><td>Customer</td><td>${b.firstName} ${b.lastName}</td></tr>
        <tr><td>Email</td><td>${b.email}</td></tr>
        <tr><td>Phone</td><td>${b.phone}</td></tr>
        <tr><td>Model</td><td>${b.modelName}</td></tr>
        <tr><td>Date</td><td>${b.date}</td></tr>
        <tr><td>Time</td><td>${b.timeSlot}</td></tr>
        <tr><td>Showroom</td><td>${b.showroom}</td></tr>
      </table>
      ${b.notes ? `<div class="notes"><strong>Notes:</strong> ${b.notes}</div>` : ""}
    </div>
    <div class="footer">BYD Showroom Booking System</div>
  </div>
</body>
</html>
  `.trim();
}

/* ── Telegram message ───────────────────────────────── */

function buildTelegramText(b: BookingPayload): string {
  return [
    `🚗 <b>New Test Drive Booking</b>`,
    ``,
    `<b>Ref:</b> ${b.ref}`,
    `<b>Customer:</b> ${b.firstName} ${b.lastName}`,
    `<b>Phone:</b> ${b.phone}`,
    `<b>Email:</b> ${b.email}`,
    `<b>Model:</b> ${b.modelName}`,
    `<b>Date:</b> ${b.date}`,
    `<b>Time:</b> ${b.timeSlot}`,
    `<b>Showroom:</b> ${b.showroom}`,
    b.notes ? `<b>Notes:</b> ${b.notes}` : "",
  ].filter(Boolean).join("\n");
}

/* ── types ──────────────────────────────────────────── */

interface BookingPayload {
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  model: string;
  modelName: string;
  date: string;
  timeSlot: string;
  showroom: string;
  notes?: string;
}

/* ── route ──────────────────────────────────────────── */

router.post("/booking/notify", async (req, res): Promise<void> => {
  const b = req.body as BookingPayload;

  if (!b.ref || !b.firstName || !b.email || !b.model) {
    res.status(400).json({ error: "Missing required booking fields" });
    return;
  }

  const results: { telegram?: string; email?: string } = {};

  await Promise.allSettled([
    sendTelegram(buildTelegramText(b)).then(() => {
      results.telegram = "sent";
    }).catch(err => {
      results.telegram = `failed: ${err.message}`;
    }),

    sendEmail(
      `🚗 New Test Drive — ${b.modelName} — ${b.firstName} ${b.lastName}`,
      buildEmailHtml(b)
    ).then(() => {
      results.email = "sent";
    }).catch(err => {
      results.email = `failed: ${err.message}`;
    }),
  ]);

  res.json({ ok: true, results });
});

export default router;
