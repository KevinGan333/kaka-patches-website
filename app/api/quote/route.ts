import { Resend } from "resend";
import { createQuoteRequest, updateQuoteEmailStatus } from "@/lib/admin/quote-db";

export const runtime = "nodejs";

/* ── Helpers ── */
function safeText(value: FormDataEntryValue | null) {
  if (!value) return "";
  return String(value).trim();
}

function safeFileName(fileName: string) {
  return fileName
    .replaceAll("\\", "-").replaceAll("/", "-").replaceAll(":", "-")
    .replaceAll("*", "-").replaceAll("?", "-").replaceAll('"', "-")
    .replaceAll("<", "-").replaceAll(">", "-").replaceAll("|", "-");
}

function buildEmailHtml(data: {
  name: string; email: string; company: string; quantity: string;
  delivery: string; patchType: string; patchSize: string;
  backing: string; border: string; message: string;
  artworkFileName: string | null; artworkUrl: string | null;
  submittedAt: string; quoteNumber: string;
}) {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#1e293b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#334155">${value}</td></tr>` : "";

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#f8fafc;margin:0;padding:24px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
<div style="background:#0f172a;padding:28px 32px">
<h1 style="margin:0;font-size:20px;color:#fff">KaKa Patches</h1>
<p style="margin:6px 0 0;font-size:14px;color:#94a3b8">New Quote Request — ${data.quoteNumber}</p>
<p style="margin:4px 0 0;font-size:11px;color:#64748b">Storage: Neon Postgres + Vercel Blob</p>
</div>
<div style="padding:28px 32px">
<table style="width:100%;border-collapse:collapse;font-size:14px">
${row("Name", data.name)}${row("Email", data.email)}${row("Company", data.company)}
${row("Quantity", data.quantity)}${row("Delivery", data.delivery)}
${row("Patch Type", data.patchType)}${row("Patch Size", data.patchSize)}
${row("Backing", data.backing)}${row("Border", data.border)}
${row("Message", data.message)}
${row("Artwork File", data.artworkFileName ?? "—")}
${row("Artwork URL", data.artworkUrl ?? "—")}
${row("Submitted", data.submittedAt)}
</table></div></div></body></html>`;
}

/* ── POST Handler ── */
export async function POST(request: Request) {
  console.log("[Quote API] Request received.");

  try {
    const formData = await request.formData();
    const artwork = formData.get("artwork");

    const name = safeText(formData.get("name"));
    const email = safeText(formData.get("email"));
    const company = safeText(formData.get("company"));
    const quantity = safeText(formData.get("quantity"));
    const delivery = safeText(formData.get("delivery"));
    const patchType = safeText(formData.get("patchType"));
    const patchSize = safeText(formData.get("patchSize"));
    const backing = safeText(formData.get("backing"));
    const border = safeText(formData.get("border"));
    const message = safeText(formData.get("message"));

    /* ── Validation ── */
    if (!name || !email || !quantity) {
      return Response.json(
        { success: false, error: "Name, email and quantity are required." },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();

    /* ── Blob upload (best-effort) ── */
    let artworkUrl: string | null = null;
    let artworkInfo: {
      originalFileName?: string;
      fileType?: string;
      fileSize?: number;
    } = {};

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (artwork instanceof File && artwork.size > 0 && artwork.size <= 10 * 1024 * 1024 && blobToken) {
      try {
        const { put } = await import("@vercel/blob");
        const originalFileName = safeFileName(artwork.name || "artwork");
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const blobPath = `quote-artwork/${year}/${month}/${originalFileName}`;

        const blob = await put(blobPath, artwork, {
          access: "public",
          token: blobToken,
        });

        artworkUrl = blob.url;
        artworkInfo = {
          originalFileName,
          fileType: artwork.type,
          fileSize: artwork.size,
        };
        console.log("Blob upload:", blobPath, "->", blob.url);
      } catch (e: any) {
        console.warn("Blob upload failed (non-fatal):", e.message);
      }
    } else if (artwork instanceof File && artwork.size > 0 && !blobToken) {
      console.log("Blob upload: BLOB_READ_WRITE_TOKEN not set, skipping artwork upload.");
    }

    /* ── Save to Postgres ── */
    let quoteId: string;
    let quoteNumber: string;

    try {
      const quote = await createQuoteRequest({
        name,
        email,
        company: company || undefined,
        quantity: quantity || undefined,
        delivery: delivery || undefined,
        patch_type: patchType || undefined,
        patch_size: patchSize || undefined,
        backing: backing || undefined,
        border_option: border || undefined,
        message: message || undefined,
        artwork_filename: artworkInfo.originalFileName || undefined,
        artwork_url: artworkUrl || undefined,
        artwork_size: artworkInfo.fileSize || undefined,
        artwork_type: artworkInfo.fileType || undefined,
        status: "new",
      });

      quoteId = quote.id;
      quoteNumber = quote.quote_number;
      console.log("Quote saved to DB:", quoteNumber, "(id:", quoteId, ")");
    } catch (e: any) {
      console.error("Quote save to DB failed:", e.message);
      return Response.json(
        { success: false, error: "Failed to save quote request.", detail: e.message },
        { status: 500 }
      );
    }

    /* ── Send email via Resend ── */
    let emailSent = false;
    let emailError: string | null = null;

    const resendApiKey = process.env.RESEND_API_KEY;
    const quoteToEmail = process.env.QUOTE_TO_EMAIL;
    const quoteFromEmail = process.env.QUOTE_FROM_EMAIL;

    if (!resendApiKey || !quoteToEmail || !quoteFromEmail) {
      console.warn("[Quote API] Email skipped: missing env vars.");
    } else {
      console.log("[Quote API] Sending email...");
      try {
        const resend = new Resend(resendApiKey);
        const emailHtml = buildEmailHtml({
          name, email, company, quantity, delivery, patchType, patchSize, backing, border, message,
          artworkFileName: artworkInfo.originalFileName ?? null,
          artworkUrl,
          submittedAt,
          quoteNumber,
        });

        let attachments: Array<{ filename: string; content: Buffer }> | undefined;

        if (!artworkUrl && artwork instanceof File && artwork.size > 0 && artwork.size <= 10 * 1024 * 1024) {
          const arrayBuffer = await artwork.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          attachments = [{ filename: artworkInfo.originalFileName || "artwork", content: buffer }];
        }

        const { data, error } = await resend.emails.send({
          from: quoteFromEmail,
          to: [quoteToEmail],
          subject: `New Quote Request from ${name} — KaKa Patches [${quoteNumber}]`,
          html: emailHtml,
          replyTo: email,
          attachments,
        });

        if (error) {
          console.error("[Quote API] Resend error:", error);
          emailError = error.message;
        } else {
          console.log("Email sent:", data?.id);
          emailSent = true;
        }
      } catch (e: any) {
        console.error("[Quote API] Resend exception:", e.message);
        emailError = e.message || "Email send failed";
      }
    }

    /* ── Record email status ── */
    if (emailSent || emailError) {
      try {
        await updateQuoteEmailStatus(quoteId, emailSent, emailError || undefined);
        console.log("Email status recorded in DB for:", quoteNumber);
      } catch (e: any) {
        console.warn("Failed to record email status (non-fatal):", e.message);
      }
    }

    /* ── Response ── */
    return Response.json({
      success: true,
      saved: true,
      emailSent,
      quoteNumber,
      artworkUrl,
    });
  } catch (error: any) {
    console.error("[Quote API] Fatal error:", error.message);
    return Response.json(
      { success: false, error: "Submission failed.", detail: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
