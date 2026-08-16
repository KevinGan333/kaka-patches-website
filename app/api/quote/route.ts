import { Resend } from "resend";
import { createQuoteRequest, updateQuoteEmailStatus } from "@/lib/admin/quote-db";

export const runtime = "nodejs";

/* ── Rate Limiting (simple in-memory) ── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;      // max submissions per window
const RATE_LIMIT_WINDOW = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Parse comma-separated per-design quantities. Returns validated integer array. */
function parsePerDesignQuantities(raw: string): number[] {
  const parts = raw.split(",");
  const result: number[] = [];
  for (const s of parts) {
    const trimmed = s.trim();
    // Reject non-numeric, decimal, zero, and negative values
    if (!/^\d+$/.test(trimmed)) continue;
    const n = parseInt(trimmed, 10);
    if (n >= 1) result.push(n);
  }
  return result;
}

function buildEmailHtml(data: {
  name: string; email: string; company: string;
  productCategory: string; numberOfDesigns: string; quantityPerDesign: string;
  patchSize: string; backing: string; border: string; designNotes: string;
  projectType: string; packaging: string; delivery: string; message: string;
  artworkFileName: string | null; artworkUrl: string | null;
  submittedAt: string; quoteNumber: string;
  utmSource: string; utmMedium: string; utmCampaign: string;
  utmContent: string; utmTerm: string;
  styleReference: string;
}) {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#1e293b;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#334155">${value}</td></tr>` : "";

  const section = (title: string, rows: string) =>
    rows ? `<div style="margin-bottom:20px"><h3 style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em">${title}</h3><table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table></div>` : "";

  // Parse per-design quantities — variable: "100,200,500" or uniform: "50"
  const perDesignQtys = parsePerDesignQuantities(data.quantityPerDesign);
  const hasVariable = perDesignQtys.length > 1;
  const totalQty = perDesignQtys.reduce((sum, n) => sum + n, 0);
  const designsCount = perDesignQtys.length || parseInt(data.numberOfDesigns || "1") || 1;

  // Build quantity rows
  let qtyRows = "";
  if (hasVariable) {
    qtyRows = row("No. of Designs", String(designsCount));
    perDesignQtys.forEach((qty, i) => {
      qtyRows += row(`Design ${i + 1} Qty`, `${qty} pcs`);
    });
    qtyRows += row("Total Quantity", `${totalQty} pcs`);
  } else {
    const singleQty = perDesignQtys[0] || parseInt(data.quantityPerDesign) || 0;
    qtyRows =
      row("No. of Designs", data.numberOfDesigns) +
      row("Qty Per Design", data.quantityPerDesign);
    if (data.numberOfDesigns && parseInt(data.numberOfDesigns) > 1) {
      qtyRows += row("Total Estimated", `${singleQty * parseInt(data.numberOfDesigns || "1")} pcs`);
    }
  }

  const productRows =
    row("Product Category", data.productCategory) +
    qtyRows +
    row("Patch / Product Size", data.patchSize) +
    row("Backing", data.backing) +
    row("Border", data.border) +
    row("Style Reference", data.styleReference) +
    row("Design Notes", data.designNotes);

  const projectRows =
    row("Project Type", data.projectType) +
    row("Packaging", data.packaging) +
    row("Delivery Deadline", data.delivery) +
    row("Message", data.message);

  const contactRows =
    row("Name", data.name) +
    row("Email", data.email) +
    row("Company", data.company);

  const assetRows =
    row("Artwork File", data.artworkFileName ?? "—") +
    row("Artwork URL", data.artworkUrl ?? "—");

  const utmRows =
    row("UTM Source", data.utmSource) +
    row("UTM Medium", data.utmMedium) +
    row("UTM Campaign", data.utmCampaign) +
    row("UTM Content", data.utmContent) +
    row("UTM Term", data.utmTerm);

  const hasUtm = data.utmSource || data.utmMedium || data.utmCampaign || data.utmContent || data.utmTerm;

  return `<!DOCTYPE html>
<html><body style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;margin:0;padding:24px">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
<div style="background:#0f172a;padding:28px 32px">
<h1 style="margin:0;font-size:20px;color:#fff">KaKa Patches</h1>
<p style="margin:6px 0 0;font-size:14px;color:#94a3b8">New Quote Request — ${data.quoteNumber}</p>
</div>
<div style="padding:28px 32px">
${section("Contact", contactRows)}
${section("Product Details", productRows)}
${section("Project Info", projectRows)}
${section("Artwork", assetRows)}
${hasUtm ? section("Marketing Attribution", utmRows) : ""}
${row("Submitted", data.submittedAt)}
</div>
<div style="background:#f1f5f9;padding:16px 32px;border-top:1px solid #e2e8f0">
<p style="margin:0;font-size:12px;color:#64748b">View in admin: <a href="https://www.kakapatches.com/admin/quotes" style="color:#2563eb">kakapatches.com/admin/quotes</a></p>
</div></div></body></html>`;
}

/* ── POST Handler ── */
export async function POST(request: Request) {
  console.log("[Quote API] Request received.");

  try {
    /* ── Honeypot check ── */
    const formData = await request.formData();
    const honeypot = safeText(formData.get("website"));
    if (honeypot) {
      console.log("[Quote API] Honeypot triggered — likely bot. Returning fake success.");
      return Response.json({ success: true, saved: true, emailSent: false, quoteNumber: "bot-blocked" });
    }

    /* ── Rate limit ── */
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    if (!checkRateLimit(ip)) {
      console.log("[Quote API] Rate limit exceeded for IP:", ip);
      return Response.json(
        { success: false, error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    /* ── Extract fields ── */
    const artwork = formData.get("artwork");

    const name = safeText(formData.get("name"));
    const email = safeText(formData.get("email"));
    const company = safeText(formData.get("company"));
    const productCategory = safeText(formData.get("productCategory")) || safeText(formData.get("patchType"));
    const rawQuantityPerDesign = safeText(formData.get("quantityPerDesign")) || safeText(formData.get("quantity"));
    const patchSize = safeText(formData.get("patchSize"));
    const backing = safeText(formData.get("backing"));
    const border = safeText(formData.get("border"));
    const designNotes = safeText(formData.get("designNotes"));
    const styleReference = safeText(formData.get("styleReference"));
    const projectType = safeText(formData.get("projectType"));
    const delivery = safeText(formData.get("delivery"));
    const packaging = safeText(formData.get("packaging"));
    const message = safeText(formData.get("message"));

    // UTM + attribution capture
    const utmSource = safeText(formData.get("utm_source"));
    const utmMedium = safeText(formData.get("utm_medium"));
    const utmCampaign = safeText(formData.get("utm_campaign"));
    const utmContent = safeText(formData.get("utm_content"));
    const utmTerm = safeText(formData.get("utm_term"));
    const firstLandingPage = safeText(formData.get("first_landing_page"));
    const referrer = safeText(formData.get("referrer"));

    /* ── Server-side validation ── */
    const errors: string[] = [];

    if (!name) errors.push("Name is required.");
    if (!email) {
      errors.push("Email is required.");
    } else if (!isValidEmail(email)) {
      errors.push("Please provide a valid email address.");
    }
    if (!productCategory) errors.push("Please select a product category.");
    if (!rawQuantityPerDesign) {
      errors.push("Quantity per design is required.");
    } else {
      const qtys = parsePerDesignQuantities(rawQuantityPerDesign);
      if (qtys.length === 0) {
        errors.push("Please enter a valid whole-number quantity (e.g. 50 or 100,200,500).");
      } else {
        for (const q of qtys) {
          if (q < 1) errors.push("Quantity must be at least 1.");
          if (!Number.isInteger(q)) errors.push("Quantity must be a whole number.");
        }
      }
    }

    if (errors.length > 0) {
      return Response.json(
        { success: false, error: "Validation failed.", errors },
        { status: 400 }
      );
    }

    const submittedAt = new Date().toISOString();

    // Server-side total calculation — sum(validatedDesignQuantities)
    const validatedQtys = parsePerDesignQuantities(rawQuantityPerDesign);
    const totalQuantity = validatedQtys.reduce((sum, n) => sum + n, 0).toString();
    const quantityPerDesign = validatedQtys.join(",");
    const designsCount = validatedQtys.length || 1;

    /* ── Blob upload (best-effort with failure tracking) ── */
    let artworkUrl: string | null = null;
    let artworkInfo: {
      originalFileName?: string;
      fileType?: string;
      fileSize?: number;
    } = {};
    let artworkUploadAttempted = false;
    let artworkUploadFailed = false;

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (artwork instanceof File && artwork.size > 0 && artwork.size <= 10 * 1024 * 1024 && blobToken) {
      artworkUploadAttempted = true;
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
      } catch (e: unknown) {
        artworkUploadFailed = true;
        console.warn("Blob upload failed:", e instanceof Error ? e.message : String(e));
      }
    } else if (artwork instanceof File && artwork.size > 0 && !blobToken) {
      artworkUploadAttempted = true;
      artworkUploadFailed = true;
      console.log("Blob upload: BLOB_READ_WRITE_TOKEN not set, artwork upload skipped.");
    }

    // If artwork was attempted but failed, return an explicit error so the buyer
    // knows their upload didn't succeed and can retry or contact support.
    if (artworkUploadAttempted && artworkUploadFailed) {
      return Response.json(
        {
          success: false,
          error: "Artwork upload failed. Please try again or contact us directly to submit your artwork.",
          artworkUploadFailed: true,
        },
        { status: 500 }
      );
    }

    /* ── Save to Postgres ── */
    let quoteId: string;
    let quoteNumber: string;

    try {
      const quote = await createQuoteRequest({
        name,
        email,
        company: company || undefined,
        quantity: totalQuantity || undefined,
        quantity_per_design: quantityPerDesign || undefined,
        number_of_designs: String(designsCount) || undefined,
        delivery: delivery || undefined,
        product_category: productCategory || undefined,
        patch_type: productCategory || undefined,   // backward compat
        patch_size: patchSize || undefined,
        backing: backing || undefined,
        border_option: border || undefined,
        design_notes: designNotes || undefined,
        style_reference: styleReference || undefined,
        project_type: projectType || undefined,
        packaging_preference: packaging || undefined,
        message: message || undefined,
        artwork_filename: artworkInfo.originalFileName || undefined,
        artwork_url: artworkUrl || undefined,
        artwork_size: artworkInfo.fileSize || undefined,
        artwork_type: artworkInfo.fileType || undefined,
        utm_source: utmSource || undefined,
        utm_medium: utmMedium || undefined,
        utm_campaign: utmCampaign || undefined,
        utm_content: utmContent || undefined,
        utm_term: utmTerm || undefined,
        first_landing_page: firstLandingPage || undefined,
        referrer: referrer || undefined,
        status: "new",
      });

      quoteId = quote.id;
      quoteNumber = quote.quote_number;
      console.log("Quote saved to DB:", quoteNumber, "(id:", quoteId, ")");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown database error";
      console.error("Quote save to DB failed:", message);
      return Response.json(
        { success: false, error: "Failed to save quote request.", detail: message },
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
          name, email, company,
          productCategory, numberOfDesigns: String(designsCount), quantityPerDesign,
          patchSize, backing, border, designNotes,
          projectType, packaging, delivery, message,
          artworkFileName: artworkInfo.originalFileName ?? null,
          artworkUrl,
          submittedAt,
          quoteNumber,
          utmSource, utmMedium, utmCampaign,
          utmContent, utmTerm,
          styleReference,
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
          subject: `New Quote Request — ${productCategory || "Custom Products"} — KaKa Patches [${quoteNumber}]`,
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
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Email send failed";
        console.error("[Quote API] Resend exception:", message);
        emailError = message;
      }
    }

    /* ── Record email status ── */
    if (emailSent || emailError) {
      try {
        await updateQuoteEmailStatus(quoteId, emailSent, emailError || undefined);
        console.log("Email status recorded in DB for:", quoteNumber);
      } catch (e: unknown) {
        console.warn("Failed to record email status (non-fatal):", e instanceof Error ? e.message : String(e));
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Quote API] Fatal error:", message);
    return Response.json(
      { success: false, error: "Submission failed.", detail: message },
      { status: 500 }
    );
  }
}
