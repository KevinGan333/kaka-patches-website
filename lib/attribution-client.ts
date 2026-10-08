import { captureTouch, normalizeAttribution, type QuoteAttribution, type TrafficTouch } from "./attribution";
const KEY = "kp_attribution_v1";
const FIRST_TTL = 90 * 24 * 60 * 60 * 1000;
export const SESSION_TTL = 30 * 60 * 1000;
interface Stored { version: 1; first: TrafficTouch; session: TrafficTouch; updatedAt: number }
let memory: Stored | null = null;
let entryCaptured = false;
export function nextAttribution(previous: Stored | null, incoming: TrafficTouch, now: number, externalEntry: boolean): Stored {
  const first = previous && now - Date.parse(previous.first.capturedAt) < FIRST_TTL ? previous.first : incoming;
  const newSession = !previous || now - previous.updatedAt >= SESSION_TTL || externalEntry;
  return { version: 1, first, session: newSession ? incoming : previous.session, updatedAt: now };
}
export function recordVisit(): QuoteAttribution | null {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/admin")) return null;
  const now = Date.now();
  let previous = memory;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || "null");
    if (normalizeAttribution(raw) && Number.isFinite(raw.updatedAt)) previous = raw;
  } catch { /* storage unavailable; retain this page's in-memory attribution */ }
  const incoming = captureTouch(window.location.href, entryCaptured ? "" : document.referrer, now);
  const params = new URLSearchParams(window.location.search);
  const campaignEntry = !entryCaptured && ["utm_source", "utm_medium", "utm_campaign", "gclid", "gbraid", "wbraid", "msclkid"].some(k => params.has(k));
  const externalEntry = !entryCaptured && Boolean(incoming.referrer);
  memory = nextAttribution(previous, incoming, now, campaignEntry || externalEntry);
  entryCaptured = true;
  try { window.localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* attribution never blocks a quote */ }
  return { version: 1, first: memory.first, session: memory.session, submissionPage: window.location.pathname };
}
