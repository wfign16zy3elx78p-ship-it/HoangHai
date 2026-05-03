import express from "express";
import cors from "cors";
import { Router, type Request, type Response } from "express";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Health ─────────────────────────────────────────── */
const health = Router();
health.get("/healthz", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

/* ── Helpers ─────────────────────────────────────────── */
async function sendTelegram(text: string) {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  const chatId = process.env["TELEGRAM_CHAT_ID"];
  if (!token || !chatId) return;
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  });
  if (!r.ok) throw new Error(`Telegram error: ${await r.text()}`);
}

async function sendEmail(subject: string, html: string) {
  const apiKey = process.env["RESEND_API_KEY"];
  const to     = process.env["NOTIFY_EMAIL"];
  const from   = process.env["NOTIFY_FROM"] ?? "BYD Showroom <onboarding@resend.dev>";
  if (!apiKey || !to) return;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ from, to, subject, html }),
  });
  if (!r.ok) throw new Error(`Resend error: ${await r.text()}`);
}

/* ── Types ───────────────────────────────────────────── */
interface BookingPayload {
  ref: string; firstName: string; lastName: string;
  email: string; phone: string; model: string; modelName: string;
  date: string; timeSlot: string; showroom: string; notes?: string;
}

function buildEmailHtml(b: BookingPayload): string {
  return `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:24px">
<div style="background:#fff;max-width:520px;margin:0 auto;border-radius:8px;overflow:hidden">
<div style="background:#0f0f0f;color:#fff;padding:28px 32px"><h1 style="margin:0;font-size:20px;letter-spacing:2px;text-transform:uppercase">BYD — New Test Drive</h1></div>
<div style="padding:28px 32px">
<p><strong>Ref:</strong> ${b.ref}</p>
<p><strong>Customer:</strong> ${b.firstName} ${b.lastName}</p>
<p><strong>Email:</strong> ${b.email}</p>
<p><strong>Phone:</strong> ${b.phone}</p>
<p><strong>Model:</strong> ${b.modelName}</p>
<p><strong>Date:</strong> ${b.date} — ${b.timeSlot}</p>
<p><strong>Showroom:</strong> ${b.showroom}</p>
${b.notes ? `<p><strong>Notes:</strong> ${b.notes}</p>` : ""}
</div></div></body></html>`;
}

function buildTelegramText(b: BookingPayload): string {
  return [
    `🚗 <b>New Test Drive Booking</b>`, ``,
    `<b>Ref:</b> ${b.ref}`,
    `<b>Customer:</b> ${b.firstName} ${b.lastName}`,
    `<b>Phone:</b> ${b.phone}`, `<b>Email:</b> ${b.email}`,
    `<b>Model:</b> ${b.modelName}`,
    `<b>Date:</b> ${b.date} — ${b.timeSlot}`,
    `<b>Showroom:</b> ${b.showroom}`,
    b.notes ? `<b>Notes:</b> ${b.notes}` : "",
  ].filter(Boolean).join("\n");
}

/* ── Booking route ───────────────────────────────────── */
const booking = Router();
booking.post("/booking/notify", async (req: Request, res: Response): Promise<void> => {
  const b = req.body as BookingPayload;
  if (!b.ref || !b.firstName || !b.email || !b.model) {
    res.status(400).json({ error: "Missing required booking fields" });
    return;
  }
  const results: { telegram?: string; email?: string } = {};
  await Promise.allSettled([
    sendTelegram(buildTelegramText(b)).then(() => { results.telegram = "sent"; })
      .catch((err: Error) => { results.telegram = `failed: ${err.message}`; }),
    sendEmail(`🚗 New Test Drive — ${b.modelName} — ${b.firstName} ${b.lastName}`, buildEmailHtml(b))
      .then(() => { results.email = "sent"; })
      .catch((err: Error) => { results.email = `failed: ${err.message}`; }),
  ]);
  console.log("[booking]", JSON.stringify(results));
  res.json({ ok: true, results });
});

app.use("/api", health);
app.use("/api", booking);

export default app;
