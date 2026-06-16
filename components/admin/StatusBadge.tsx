const colors: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Reviewed: "bg-slate-100 text-slate-700 border-slate-200",
  Quoted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Waiting for Customer": "bg-amber-50 text-amber-700 border-amber-200",
  "Waiting for customer": "bg-amber-50 text-amber-700 border-amber-200",
  "In Production": "bg-violet-50 text-violet-700 border-violet-200",
  "In production": "bg-violet-50 text-violet-700 border-violet-200",
  Closed: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function StatusBadge({ status }: { status?: string }) {
  const s = status || "New";
  const c = colors[s] || colors["New"];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${c}`}>{s}</span>;
}
