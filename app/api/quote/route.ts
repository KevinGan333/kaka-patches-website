import { Resend } from "resend";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

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
  artworkFileName: string | null; artworkSavedPath: string | null;
  submittedAt: string; storageMode: string;
}) {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#1e293b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#334155">${value}</td></tr>` : "";

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;background:#f8fafc;margin:0;padding:24px">
<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
<div style="background:#0f172a;padding:28px 32px">
<h1 style="margin:0;font-size:20px;color:#fff">KaKa Patches</h1>
<p style="margin:6px 0 0;font-size:14px;color:#94a3b8">New Quote Request</p>
<p style="margin:4px 0 0;font-size:11px;color:#64748b">Storage: ${data.storageMode}</p>
</div>
<div style="padding:28px 32px">
<table style="width:100%;border-collapse:collapse;font-size:14px">
${row("Name", data.name)}${row("Email", data.email)}${row("Company", data.company)}
${row("Quantity", data.quantity)}${row("Delivery", data.delivery)}
${row("Patch Type", data.patchType)}${row("Patch Size", data.patchSize)}
${row("Backing", data.backing)}${row("Border", data.border)}
${row("Message", data.message)}
${row("Artwork File", data.artworkFileName ?? "—")}
${row("Saved Path", data.artworkSavedPath ?? "—")}
${row("Submitted", data.submittedAt)}
</table></div></div></body></html>`;
}

/* ── POST Handler ── */
export async function POST(request: Request) {
  const isVercel = process.env.VERCEL === "1";

  console.log("[Quote API] Request received. Vercel:", isVercel);

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

    if (!name || !email || !quantity) {
      return Response.json({ success: false, message: "Name, email and quantity are required." }, { status: 400 });
    }

    const submittedAt = new Date().toISOString();
    const requestId = `quote-${Date.now()}`;

    /* ── Best-effort local file persistence (development only) ── */
    let saved = false;
    let saveError: string | null = null;
    let artworkInfo: any = null;
    let artworkBuffer: Buffer | null = null;
    let quoteFilePath: string | null = null;

    if (!isVercel) {
      try {
        const dataDir = path.join(process.cwd(), "data");
        const quoteDir = path.join(dataDir, "quote-requests");
        const uploadDir = path.join(dataDir, "quote-uploads");
        await mkdir(quoteDir, { recursive: true });
        await mkdir(uploadDir, { recursive: true });

        if (artwork instanceof File && artwork.size > 0 && artwork.size <= 10 * 1024 * 1024) {
          const arrayBuffer = await artwork.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          artworkBuffer = buffer;
          const originalFileName = safeFileName(artwork.name || "artwork");
          const savedFileName = `${requestId}-${originalFileName}`;
          const savedFilePath = path.join(uploadDir, savedFileName);
          await writeFile(savedFilePath, buffer);
          artworkInfo = { originalFileName, savedFileName, savedFilePath, fileType: artwork.type, fileSize: artwork.size };
        }

        quoteFilePath = path.join(quoteDir, `${requestId}.json`);
        await writeFile(quoteFilePath, JSON.stringify({
          id: requestId, submittedAt,
          customer: { name, email, company },
          requirements: { quantity, delivery, patchType, patchSize, backing, border, message },
          artwork: artworkInfo,
        }, null, 2), "utf-8");

        saved = true;
        console.log("[Quote API] Local save OK:", requestId);
      } catch (e: any) {
        saveError = e.message || "Local save failed";
        console.warn("[Quote API] Local save failed (non-fatal):", saveError);
      }
    } else {
      console.log("[Quote API] Vercel detected — skipping local file persistence.");
    }

    /* ── Send email via Resend ── */
    let emailSent = false;
    let emailError: string | null = null;
    let emailId: string | null = null;

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
          artworkFileName: artworkInfo?.originalFileName ?? null,
          artworkSavedPath: artworkInfo?.savedFilePath ?? null,
          submittedAt, storageMode: isVercel ? "email-only (Vercel)" : "local + email",
        });

        const attachments = artworkBuffer
          ? [{ filename: artworkInfo?.originalFileName || "artwork", content: artworkBuffer }]
          : undefined;

        const { data, error } = await resend.emails.send({
          from: quoteFromEmail,
          to: [quoteToEmail],
          subject: `New Quote Request from ${name} - KaKa Patches`,
          html: emailHtml,
          replyTo: email,
          attachments,
        });

        if (error) {
          console.error("[Quote API] Resend error:", error);
          emailError = error.message;
        } else {
          console.log("[Quote API] Email sent:", data?.id);
          emailSent = true;
          emailId = data?.id ?? null;
        }
      } catch (e: any) {
        console.error("[Quote API] Resend exception:", e.message);
        emailError = e.message || "Email send failed";
      }
    }

    /* ── Response ── */
    if (emailSent) {
      return Response.json({
        success: true,
        emailSent: true,
        emailId,
        saved,
        saveError,
        storageMode: isVercel ? "email_only_vercel" : "local_file",
        message: saveError
          ? `Quote email sent. Local save note: ${saveError}`
          : "Quote submitted successfully.",
        data: { id: requestId, quoteFilePath, artwork: artworkInfo },
      });
    }

    // Email failed — return error
    return Response.json({
      success: false,
      emailSent: false,
      error: "Email sending failed.",
      detail: emailError || "Unknown email error",
      saved,
      saveError,
    }, { status: 500 });
  } catch (error: any) {
    console.error("[Quote API] Fatal error:", error.message);
    return Response.json({
      success: false,
      error: "Submission failed.",
      detail: error.message || "Unknown error",
    }, { status: 500 });
  }
}
