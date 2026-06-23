const colors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-slate-100 text-slate-700 border-slate-200",
  quoted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  waiting_for_customer: "bg-amber-50 text-amber-700 border-amber-200",
  in_production: "bg-violet-50 text-violet-700 border-violet-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

function normalize(s: string): string {
  // Handle old format with spaces/camelCase
  const lower = s.toLowerCase().replace(/\s+/g, "_");
  return colors[lower] ? lower : s;
}

export default function StatusBadge({ status }: { status?: string }) {
  const s = status || "new";
  const key = normalize(s);
  const c = colors[key] || colors["new"];
  const label = s.replace(/_/g, " ");
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${c}`}>{label}</span>;
}
