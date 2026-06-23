"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const patchSizes = ['2"', '3"', '4"', '5"', "Custom Size"];
const patchTypes = ["Custom Embroidered Patches", "Custom Woven Patches", "Custom PVC Patches", "Custom Chenille Patches", "Not Sure Yet"];
const backingOptions = ["Sew-on Backing", "Iron-on Backing", "Velcro Backing", "Adhesive Backing", "No Backing"];
const borderOptions = ["Merrowed Border", "Heat Cut Border", "Laser Cut Border", "Not Sure Yet"];

export default function QuoteForm() {
  const router = useRouter();
  const [artwork, setArtwork] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [patchSize, setPatchSize] = useState('3"');
  const [patchType, setPatchType] = useState("Custom Embroidered Patches");
  const [backing, setBacking] = useState("Sew-on Backing");
  const [border, setBorder] = useState("Merrowed Border");
  const [submitStatus, setSubmitStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const optionsVisible = showForm || (artwork && uploadProgress === 100);

  function handleArtworkChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setArtwork(file); setUploadProgress(0); setSubmitStatus("");
    setPreviewUrl(URL.createObjectURL(file));
    let progress = 0;
    const timer = window.setInterval(() => { progress += 10; setUploadProgress(progress); if (progress >= 100) window.clearInterval(timer); }, 120);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true); setSubmitStatus("Submitting your quote request...");
    const formData = new FormData(event.currentTarget);
    formData.set("patchSize", patchSize); formData.set("patchType", patchType);
    formData.set("backing", backing); formData.set("border", border);
    if (artwork && artwork.size > 0) { formData.set("artwork", artwork); }
    try {
      const response = await fetch("/api/quote", { method: "POST", body: formData });
      const result = await response.json();
      console.log("Quote API response:", result);
      if (result.success) {
        if (result.email?.sent) { console.log("Email sent:", result.email.id); }
        else if (result.email?.error) { console.warn("Email not sent:", result.email.error); }
        setSubmitStatus("Your quote request has been submitted successfully. Redirecting...");
        router.push("/thank-you");
        return;
      }
      console.error("Submit failed:", JSON.stringify(result, null, 2));
      setSubmitStatus(`Submit failed: ${result?.error?.message || result?.message || "Submit failed. Please try again."}`);
    } catch (error) {
      console.error("Submit error:", error);
      setSubmitStatus("Something went wrong. Please check your information and try again.");
    } finally { setIsSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step 1</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-950">Upload Your Artwork</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Upload your logo, patch design, sketch or reference image — or continue without artwork to receive a quote first.</p>
            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center hover:border-blue-500 hover:bg-blue-50">
              <span className="text-sm font-semibold text-slate-900">Click to upload artwork</span>
              <span className="mt-2 text-xs text-slate-500">PNG, JPG, PDF, AI or design reference file</span>
              <input type="file" name="artwork" className="hidden" accept=".png,.jpg,.jpeg,.pdf,.ai,.svg" onChange={handleArtworkChange} />
            </label>
            {!showForm && (
              <button
                type="button"
                onClick={() => { setShowForm(true); setUploadProgress(0); }}
                className="mt-4 w-full rounded-xl border-2 border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 hover:border-blue-300"
              >
                Continue without artwork →
              </button>
            )}
            {!showForm && (
              <p className="mt-2 text-xs text-slate-400 text-center">You can still request a quote now and send artwork later by email.</p>
            )}
          </div>
          <div className="rounded-3xl bg-slate-100 p-5">
            {previewUrl ? (
              <div>
                <div className="overflow-hidden rounded-2xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Artwork preview" className="h-64 w-full object-contain p-4" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">{artwork?.name}</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} /></div>
                <p className="mt-2 text-sm text-slate-600">Upload progress: {uploadProgress}%</p>
              </div>
            ) : <div className="flex h-80 items-center justify-center rounded-2xl bg-white text-center text-sm text-slate-500">Artwork preview will appear here after upload.</div>}
          </div>
        </div>
      </section>

      {optionsVisible && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step 2</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Select Your Patch Size</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">Choose a common patch size or select Custom Size if you already have a specific size requirement.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {patchSizes.map((size) => (
              <button key={size} type="button" onClick={() => setPatchSize(size)} className={`rounded-2xl border px-5 py-5 text-center font-semibold transition ${patchSize === size ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-slate-50 text-slate-800 hover:border-blue-400"}`}>{size}</button>
            ))}
          </div>
        </section>
      )}

      {optionsVisible && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step 3</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Select Your Options Below</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Patch Type</label>
              <select name="patchType" value={patchType} onChange={(e) => setPatchType(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
                {patchTypes.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Quantity</label>
              <input name="quantity" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Example: 500 pcs" />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Backing Option</label>
              <div className="mt-3 grid gap-3">
                {backingOptions.map((item) => (
                  <button key={item} type="button" onClick={() => setBacking(item)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${backing === item ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"}`}>{item}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Border Option</label>
              <div className="mt-3 grid gap-3">
                {borderOptions.map((item) => (
                  <button key={item} type="button" onClick={() => setBorder(item)} className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${border === item ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:border-blue-400"}`}>{item}</button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {optionsVisible && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Step 4</p>
          <h2 className="mt-3 text-2xl font-bold text-slate-950">Tell Us Where to Send the Quote</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div><label className="text-sm font-semibold text-slate-700">Your Name</label><input name="name" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Your name" /></div>
            <div><label className="text-sm font-semibold text-slate-700">Business Email</label><input name="email" type="email" required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="you@example.com" /></div>
            <div><label className="text-sm font-semibold text-slate-700">Company Name</label><input name="company" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Company name" /></div>
            <div><label className="text-sm font-semibold text-slate-700">Delivery Requirement</label><input name="delivery" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Example: Need before July 20" /></div>
            <div className="md:col-span-2"><label className="text-sm font-semibold text-slate-700">Project Requirements</label><textarea name="message" className="mt-2 min-h-36 w-full rounded-xl border border-slate-300 px-4 py-3" placeholder="Tell us patch size, colors, backing, border, packaging, usage scenario and other details." /></div>
          </div>
          <input type="hidden" name="patchSize" value={patchSize} /><input type="hidden" name="backing" value={backing} /><input type="hidden" name="border" value={border} />
          <button type="submit" disabled={isSubmitting} className="mt-8 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400">{isSubmitting ? "Submitting..." : "Submit Quote Request"}</button>
          {submitStatus && <p className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">{submitStatus}</p>}
        </section>
      )}
    </form>
  );
}
