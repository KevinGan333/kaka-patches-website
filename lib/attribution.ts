export interface TrafficTouch {
  source: string;
  medium: string;
  channel: string;
  campaign: string;
  content: string;
  term: string;
  landingPage: string;
  referrer: string;
  capturedAt: string;
}
export interface QuoteAttribution {
  version: 1;
  first: TrafficTouch;
  session: TrafficTouch;
  submissionPage: string;
}
const clean = (v: unknown, max = 200) => typeof v === "string" ? v.trim().slice(0, max) : "";
export function safePage(v: unknown): string {
  const value = clean(v, 2048);
  if (!value.startsWith("/") || value.startsWith("//")) return "";
  return value.split(/[?#]/)[0];
}
export function safeReferrer(v: unknown): string {
  try {
    const url = new URL(clean(v, 2048));
    return /^https?:$/.test(url.protocol) ? url.origin + url.pathname : "";
  } catch { return ""; }
}
const matches = (host: string, domain: string) => host === domain || host.endsWith("." + domain);
export function classify(source: string, medium: string): string {
  const s = source.toLowerCase(), m = medium.toLowerCase();
  if (/^(cpc|ppc|paid|paid_social|paid_search|display|cpm)$/.test(m)) return "Paid advertising";
  if (m === "organic") return "Organic search";
  if (m === "email") return "Email";
  if (m === "ai" || ["chatgpt.com", "chat.openai.com", "perplexity.ai", "claude.ai", "gemini.google.com", "copilot.microsoft.com"].some(d => matches(s, d))) return "AI referral";
  if (/^(social|social-network|social-media)$/.test(m) || ["linkedin", "facebook", "instagram", "pinterest", "youtube", "tiktok", "twitter", "x"].some(d => s === d || matches(s, d + ".com") || matches(s, d + ".co"))) return "Social media";
  if (s === "direct" || !s) return "Direct / Unknown";
  return "Referral";
}
export function captureTouch(href: string, referrer: string, now: number): TrafficTouch {
  const url = new URL(href);
  let source = clean(url.searchParams.get("utm_source"));
  let medium = clean(url.searchParams.get("utm_medium"));
  const external = safeReferrer(referrer);
  let host = "";
  try { host = new URL(external).hostname.replace(/^www\./, ""); } catch { /* no referrer */ }
  const ownHost = url.hostname.replace(/^www\./, "");
  const isExternal = host && host !== ownHost;
  if (url.searchParams.has("gclid") || url.searchParams.has("gbraid") || url.searchParams.has("wbraid")) {
    source = "google"; medium = "cpc";
  } else if (url.searchParams.has("msclkid")) {
    source = "bing"; medium = "cpc";
  } else if (!source && isExternal) {
    const search = host.match(/^(?:[a-z]+\.)?(google\.[a-z.]+|bing\.com|search\.yahoo\.com|duckduckgo\.com|baidu\.com)$/);
    source = search ? (host.includes("google.") ? "google" : host.includes("bing.") ? "bing" : host.includes("yahoo.") ? "yahoo" : host.split(".")[0]) : host;
    medium ||= search ? "organic" : "referral";
  }
  source ||= "direct";
  medium ||= source === "direct" ? "none" : "unknown";
  return {
    source, medium, channel: classify(source, medium),
    campaign: clean(url.searchParams.get("utm_campaign")),
    content: clean(url.searchParams.get("utm_content")), term: clean(url.searchParams.get("utm_term")),
    landingPage: safePage(url.pathname), referrer: isExternal ? external : "",
    capturedAt: new Date(now).toISOString(),
  };
}
function normalizeTouch(raw: unknown): TrafficTouch | null {
  if (!raw || typeof raw !== "object") return null;
  const v = raw as Record<string, unknown>;
  const source = clean(v.source), medium = clean(v.medium);
  const date = clean(v.capturedAt);
  if (!source || !medium || !safePage(v.landingPage) || !date || !Number.isFinite(Date.parse(date))) return null;
  return { source, medium, channel: classify(source, medium), campaign: clean(v.campaign), content: clean(v.content), term: clean(v.term), landingPage: safePage(v.landingPage), referrer: safeReferrer(v.referrer), capturedAt: new Date(date).toISOString() };
}
export function normalizeAttribution(raw: unknown): QuoteAttribution | null {
  try {
    const value = typeof raw === "string" ? JSON.parse(raw.slice(0, 12000)) : raw;
    if (!value || value.version !== 1) return null;
    const first = normalizeTouch(value.first), session = normalizeTouch(value.session);
    if (!first || !session) return null;
    return { version: 1, first, session, submissionPage: safePage(value.submissionPage) };
  } catch { return null; }
}
export function touchLabel(touch?: TrafficTouch | null): string {
  return touch ? `${touch.source} / ${touch.channel}` : "Unknown (not recorded)";
}
