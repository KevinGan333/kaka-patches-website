"use client";

import { FormEvent, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PRODUCT_GROUPS, resolveCategory } from "@/lib/product-catalog";

const patchSizes = ['2"', '3"', '4"', '5"', "Custom Size"];
const backingOptions = ["Sew-on Backing", "Iron-on Backing", "Velcro Backing", "Adhesive Backing", "No Backing / Not Sure"];
const borderOptions = ["Merrowed Border", "Heat Cut Border", "Laser Cut Border", "Not Sure"];
const projectTypes = ["New Product Launch", "Reorder / Restock", "Branding / Merchandise", "Uniform Program", "Event / Promotion", "Trial / Sampling", "Other"];
const packagingOptions = ["Individual poly-bag", "Bulk packing", "Retail-ready hang-tag", "Not Sure"];

const STEPS = ["Product Selection", "Design Details", "Contact & Project Info", "Review & Submit"] as const;

function StepIndicator({ currentStep, setStep }: { currentStep: number; setStep: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs font-semibold flex-wrap">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            disabled={i > currentStep}
            onClick={() => setStep(i)}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold transition ${
              currentStep > i
                ? "bg-blue-600 text-white"
                : currentStep === i
                ? "bg-blue-100 text-blue-700 border-2 border-blue-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {currentStep > i ? "✓" : i + 1}
          </button>
          <span
            className={`hidden sm:inline ${
              currentStep > i ? "text-blue-600" : currentStep === i ? "text-slate-800" : "text-slate-400"
            }`}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && <span className="hidden sm:block h-0.5 w-4 sm:w-6 bg-slate-200" />}
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step {step}</p>
      <h2 className="mt-3 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-600">{desc}</p>
    </>
  );
}

function MOQInfo({ numberOfDesigns }: { numberOfDesigns: string }) {
  const designs = parseInt(numberOfDesigns || "1") || 1;
  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <p className="text-sm font-semibold text-amber-800">
        Standard MOQ: <span className="font-bold">200 pcs/design</span>
      </p>
      <p className="mt-1 text-xs text-amber-700">
        Selected constructions may be evaluated at 100–199 pcs/design. Our standard production MOQ is 200 pieces per design, which usually provides better production, packaging and shipping efficiency.
      </p>
      {designs > 1 && (
        <p className="mt-1 text-xs font-semibold text-amber-800">
          MOQ and pricing apply to each design, not to the combined total.
        </p>
      )}
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm";
const labelClass = "text-sm font-semibold text-slate-700";

// ─── Main Component ───────────────────────────────────────────────
export default function QuoteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step tracking
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1: Product Selection — prefilled from `?product=` when present.
  const [productCategory, setProductCategory] = useState(() => {
    const p = searchParams.get("product");
    return p ? (resolveCategory(p) ?? "") : "";
  });
  const [numberOfDesigns, setNumberOfDesigns] = useState("1");
  const [quantityPerDesign, setQuantityPerDesign] = useState("");
  // Per-design quantities for variable mode (indexed by design number)
  const [perDesignQtys, setPerDesignQtys] = useState<string[]>(["", "", ""]);

  // Step 2: Design Details
  const [artwork, setArtwork] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [patchSize, setPatchSize] = useState('3"');
  const [backing, setBacking] = useState("Sew-on Backing");
  const [border, setBorder] = useState("Merrowed Border");
  const [designNotes, setDesignNotes] = useState("");
  const [styleReference, setStyleReference] = useState("");

  // Step 3: Contact & Project Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [delivery, setDelivery] = useState("");
  const [packaging, setPackaging] = useState("");
  const [message, setMessage] = useState(() => searchParams.get("message") || "");

  // Honeypot
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Submission
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────
  function handleArtworkChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setArtwork(file);
    setSubmitStatus("");
    setPreviewUrl(URL.createObjectURL(file));
  }

  function canProceedFromStep1(): boolean {
    if (!productCategory) return false;
    const designsNum = parseInt(numberOfDesigns || "1") || 1;
    if (designsNum > 1) {
      // Check per-design quantities
      const qtys = perDesignQtys.slice(0, designsNum).map((q) => q.trim()).filter(Boolean);
      if (qtys.length === designsNum && qtys.every((q) => parseInt(q) >= 1)) return true;
      // Fall back to uniform quantity
      return !!quantityPerDesign && parseInt(quantityPerDesign) >= 1;
    }
    return !!quantityPerDesign && parseInt(quantityPerDesign) >= 1;
  }

  function canProceedFromStep3(): boolean {
    return !!name.trim() && !!email.trim();
  }

  function setStep(n: number) {
    if (n === 1 && !canProceedFromStep1()) return;
    if (n === 2 && !canProceedFromStep1()) return;
    if (n === 3 && (!canProceedFromStep1() || !canProceedFromStep3())) return;
    setCurrentStep(n);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Honeypot check
    if (honeypotRef.current?.value) return;

    setIsSubmitting(true);
    setSubmitStatus("Submitting your quote request...");

    const formData = new FormData();
    // UTM & attribution capture from URL params
    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const utmSource = searchParams.get("utm_source") || "";
    const utmMedium = searchParams.get("utm_medium") || "";
    const utmCampaign = searchParams.get("utm_campaign") || "";
    const utmContent = searchParams.get("utm_content") || "";
    const utmTerm = searchParams.get("utm_term") || "";
    // First landing page (current pathname)
    const firstLandingPage = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
    // External referrer
    const referrer = typeof window !== "undefined" ? (document.referrer || "") : "";

    // Build quantity string: variable per-design or uniform
    const designsNum = parseInt(numberOfDesigns || "1") || 1;
    let qtyPerDesignValue: string;
    if (designsNum > 1) {
      // Use per-design quantities if provided
      const qtys = perDesignQtys.slice(0, designsNum).map((q) => q.trim()).filter(Boolean);
      if (qtys.length === designsNum && qtys.every((q) => parseInt(q) >= 1)) {
        qtyPerDesignValue = qtys.join(",");
      } else {
        // Fall back to uniform quantity
        qtyPerDesignValue = quantityPerDesign;
      }
    } else {
      qtyPerDesignValue = quantityPerDesign;
    }

    formData.set("productCategory", productCategory);
    formData.set("numberOfDesigns", numberOfDesigns);
    formData.set("quantityPerDesign", qtyPerDesignValue);
    formData.set("quantity", qtyPerDesignValue); // backward compat
    formData.set("patchType", productCategory);   // backward compat
    formData.set("patchSize", patchSize);
    formData.set("backing", backing);
    formData.set("border", border);
    formData.set("designNotes", designNotes);
    formData.set("styleReference", styleReference);
    formData.set("name", name);
    formData.set("email", email);
    formData.set("company", company);
    formData.set("projectType", projectType);
    formData.set("delivery", delivery);
    formData.set("packaging", packaging);
    formData.set("message", message);
    // UTM & attribution
    if (utmSource) formData.set("utm_source", utmSource);
    if (utmMedium) formData.set("utm_medium", utmMedium);
    if (utmCampaign) formData.set("utm_campaign", utmCampaign);
    if (utmContent) formData.set("utm_content", utmContent);
    if (utmTerm) formData.set("utm_term", utmTerm);
    if (firstLandingPage) formData.set("first_landing_page", firstLandingPage);
    if (referrer) formData.set("referrer", referrer);
    if (artwork && artwork.size > 0) formData.set("artwork", artwork);

    try {
      const response = await fetch("/api/quote", { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) {
        setSubmitStatus("Your quote request has been submitted successfully. Redirecting...");
        router.push("/thank-you");
        return;
      }
      console.error("Submit failed:", JSON.stringify(result, null, 2));
      setSubmitStatus(`Submit failed: ${result?.error || result?.message || "Submit failed. Please try again."}`);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("Something went wrong. Please check your information and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const totalEstimated = parseInt(quantityPerDesign) * parseInt(numberOfDesigns || "1") || 0;

  // ── Render ────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      {/* Honeypot */}
      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
        <input ref={honeypotRef} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <StepIndicator currentStep={currentStep} setStep={setStep} />

      {/* ═══ STEP 1: PRODUCT SELECTION ═══ */}
      {currentStep === 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <SectionHeader step={1} title="Choose Your Product & Quantity" desc="Select the product category and tell us how many designs and pieces per design you need." />
          <MOQInfo numberOfDesigns={numberOfDesigns} />

          {/* Product Category Groups */}
          <div className="mt-8 space-y-8">
            {PRODUCT_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500 mb-3">{group.label}</p>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setProductCategory(item)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        productCategory === item
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {productCategory && (
            <p className="mt-6 text-sm text-blue-700 font-semibold">
              Selected: {productCategory}
            </p>
          )}

          {/* Design & Quantity */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Number of Designs</label>
              <p className="text-xs text-slate-500 mt-1">How many different patch/label/accessory designs do you need?</p>
              <select
                value={numberOfDesigns}
                onChange={(e) => {
                  setNumberOfDesigns(e.target.value);
                  // Reset per-design quantities when designs change
                  const n = parseInt(e.target.value) || 1;
                  setPerDesignQtys(Array(Math.min(n, 10)).fill(""));
                }}
                className={inputClass}
              >
                {["1","2","3","4","5","6","7","8","9","10","10+"].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            {parseInt(numberOfDesigns || "1") <= 1 ? (
              <div>
                <label className={labelClass}>Quantity Per Design (pcs)</label>
                <p className="text-xs text-slate-500 mt-1">MOQ 200 pcs/design standard. Enter quantity per single design.</p>
                <input
                  type="number"
                  min="1"
                  step="50"
                  value={quantityPerDesign}
                  onChange={(e) => setQuantityPerDesign(e.target.value)}
                  placeholder="Example: 500"
                  className={inputClass}
                />
                {quantityPerDesign && parseInt(quantityPerDesign) > 0 && (
                  <p className="mt-2 text-xs font-medium">
                    {parseInt(quantityPerDesign) >= 200 ? (
                      <span className="text-green-700">✓ Meets standard production MOQ (200 pcs/design)</span>
                    ) : parseInt(quantityPerDesign) >= 100 ? (
                      <span className="text-amber-700">Selected constructions may be evaluated at this quantity. Our standard production MOQ is 200 pieces per design, which usually provides better production, packaging and shipping efficiency.</span>
                    ) : (
                      <span className="text-amber-700">This quantity is below our usual production range. You may still submit your project for sample or custom evaluation, but production availability and pricing must be reviewed individually.</span>
                    )}
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* Variable per-design quantities */}
          {parseInt(numberOfDesigns || "1") > 1 && (
            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/30 p-5">
              <label className={labelClass}>Quantity Per Design</label>
              <p className="text-xs text-slate-500 mt-1">Enter quantity for each design. Total will be calculated as the sum.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: Math.min(parseInt(numberOfDesigns || "1") || 1, 10) }, (_, i) => (
                  <div key={i}>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Design {i + 1} Qty (pcs)</label>
                    <input
                      type="number"
                      min="1"
                      step="50"
                      value={perDesignQtys[i] || ""}
                      onChange={(e) => {
                        const next = [...perDesignQtys];
                        next[i] = e.target.value;
                        setPerDesignQtys(next);
                      }}
                      placeholder="200"
                      className={inputClass + " mt-0"}
                    />
                  </div>
                ))}
              </div>
              {perDesignQtys.some((q) => parseInt(q) >= 1) && (
                <p className="mt-3 text-sm font-semibold text-blue-700">
                  Total: {perDesignQtys.reduce((sum, q) => sum + (parseInt(q) || 0), 0)} pcs
                </p>
              )}
            </div>
          )}

          <div className="mt-10 flex justify-end">
            <button
              type="button"
              onClick={() => { if (canProceedFromStep1()) setCurrentStep(1); }}
              disabled={!canProceedFromStep1()}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 transition"
            >
              Continue to Design Details →
            </button>
          </div>
        </section>
      )}

      {/* ═══ STEP 2: DESIGN DETAILS ═══ */}
      {currentStep === 1 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <SectionHeader step={2} title="Design Details & Artwork" desc="Upload artwork and specify size, backing and border preferences." />

          <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
            {/* Artwork Upload */}
            <div>
              <label className={labelClass}>Upload Artwork (Optional)</label>
              <p className="mt-1 text-xs text-slate-500">PNG, JPG, PDF, AI, SVG — you can also send artwork later by email.</p>
              <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-blue-500 hover:bg-blue-50 transition">
                <span className="text-sm font-semibold text-slate-900">Click to upload artwork</span>
                <span className="mt-2 text-xs text-slate-500">PNG, JPG, PDF, AI, SVG or design reference file</span>
                <input
                  type="file"
                  name="artwork"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf,.ai,.svg"
                  onChange={handleArtworkChange}
                />
              </label>
              {previewUrl && (
                <div className="mt-4">
                  <div className="overflow-hidden rounded-2xl bg-white border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Artwork preview" className="h-48 w-full object-contain p-4" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{artwork?.name}</p>
                </div>
              )}
            </div>

            {/* Size / Backing / Border */}
            <div className="space-y-6">
              {/* Patch Size */}
              <div>
                <label className={labelClass}>Patch / Product Size</label>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {patchSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPatchSize(size)}
                      className={`rounded-xl border px-4 py-3 text-center text-sm font-semibold transition ${
                        patchSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backing */}
              <div>
                <label className={labelClass}>Backing Option</label>
                <div className="mt-3 grid gap-2">
                  {backingOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBacking(item)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        backing === item
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border */}
              <div>
                <label className={labelClass}>Border Option</label>
                <div className="mt-3 grid gap-2">
                  {borderOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBorder(item)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                        border === item
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style Reference */}
              <div>
                <label className={labelClass}>Style Reference (Optional)</label>
                <input
                  value={styleReference}
                  onChange={(e) => setStyleReference(e.target.value)}
                  className={inputClass}
                  placeholder="Your internal style code or SKU"
                />
              </div>

              {/* Design Notes */}
              <div>
                <label className={labelClass}>Design Notes (Optional)</label>
                <textarea
                  value={designNotes}
                  onChange={(e) => setDesignNotes(e.target.value)}
                  rows={2}
                  className={inputClass}
                  placeholder="Specific color requirements, special shapes, material preferences..."
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(0)}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 transition"
            >
              Continue to Contact Info →
            </button>
          </div>
        </section>
      )}

      {/* ═══ STEP 3: CONTACT & PROJECT INFO ═══ */}
      {currentStep === 2 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <SectionHeader step={3} title="Contact & Project Information" desc="Tell us where to send the quote and share project details." />

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Your Name *</label>
              <input
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className={labelClass}>Business Email *</label>
              <input
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className={labelClass}>Company Name</label>
              <input
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputClass}
                placeholder="Your company"
              />
            </div>
            <div>
              <label className={labelClass}>Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className={inputClass}
              >
                <option value="">Select project type</option>
                {projectTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Delivery Deadline</label>
              <input
                name="delivery"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className={inputClass}
                placeholder="Example: Need before July 20"
              />
            </div>
            <div>
              <label className={labelClass}>Packaging Preference</label>
              <select
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                className={inputClass}
              >
                <option value="">Select packaging</option>
                {packagingOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Additional Message</label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className={inputClass}
                placeholder="Tell us about your project: usage scenario, material preferences, target budget, or any other details that help us prepare an accurate quote."
              />
            </div>
          </div>

          <div className="mt-10 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => { if (canProceedFromStep3()) setCurrentStep(3); }}
              disabled={!canProceedFromStep3()}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 transition"
            >
              Review Quote Request →
            </button>
          </div>
        </section>
      )}

      {/* ═══ STEP 4: REVIEW & SUBMIT ═══ */}
      {currentStep === 3 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step 4</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Review & Submit</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Confirm your details below, then submit your quote request. We typically reply within 1 business day.</p>

          <div className="mt-8 space-y-6">
            {/* Product Summary */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-blue-700 mb-3">Product Selection</h3>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <Row label="Product Category" value={productCategory} />
                <Row label="Number of Designs" value={numberOfDesigns} />
                {parseInt(numberOfDesigns || "1") > 1 && perDesignQtys.some((q) => parseInt(q) >= 1) ? (
                  <>
                    {perDesignQtys.slice(0, parseInt(numberOfDesigns || "1") || 1).map((q, i) => (
                      q && parseInt(q) >= 1 ? <Row key={i} label={`Design ${i + 1} Qty`} value={`${q} pcs`} /> : null
                    ))}
                    <Row label="Total Quantity" value={`${perDesignQtys.reduce((sum, q) => sum + (parseInt(q) || 0), 0)} pcs`} />
                  </>
                ) : (
                  <>
                    <Row label="Quantity Per Design" value={`${quantityPerDesign} pcs`} />
                    <Row label="Total Estimated" value={totalEstimated > 0 ? `${totalEstimated} pcs` : "-"} />
                  </>
                )}
              </div>
            </div>

            {/* Design Summary */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-700 mb-3">Design Details</h3>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <Row label="Artwork" value={artwork ? `Uploaded: ${artwork.name}` : "Not uploaded (will send later)"} />
                <Row label="Patch / Product Size" value={patchSize} />
                <Row label="Backing Option" value={backing} />
                <Row label="Border Option" value={border} />
                {styleReference && <Row label="Style Reference" value={styleReference} />}
                {designNotes && <Row label="Design Notes" value={designNotes} />}
              </div>
            </div>

            {/* Contact Summary */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-bold uppercase tracking-[0.1em] text-slate-700 mb-3">Contact & Project Info</h3>
              <div className="grid gap-2 text-sm sm:grid-cols-2">
                <Row label="Name" value={name} />
                <Row label="Email" value={email} />
                {company && <Row label="Company" value={company} />}
                {projectType && <Row label="Project Type" value={projectType} />}
                {delivery && <Row label="Delivery Deadline" value={delivery} />}
                {packaging && <Row label="Packaging" value={packaging} />}
                {message && <Row label="Message" value={message} />}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="rounded-xl border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-blue-600 px-8 py-3.5 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 transition shadow-lg shadow-blue-600/20"
            >
              {isSubmitting ? "Submitting..." : "Submit Quote Request"}
            </button>
          </div>
          {submitStatus && (
            <p className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${submitStatus.includes("failed") || submitStatus.includes("wrong") ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-700"}`}>
              {submitStatus}
            </p>
          )}
        </section>
      )}
    </form>
  );
}

/* ─── Helper ──────────────────────────────────────────────────── */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-slate-500 min-w-[130px]">{label}:</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}
