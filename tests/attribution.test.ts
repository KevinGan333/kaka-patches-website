import { describe, it, expect, vi, afterEach } from "vitest";
import { captureTouch, normalizeAttribution, safePage, safeReferrer, touchLabel } from "@/lib/attribution";
import { nextAttribution, recordVisit, SESSION_TTL } from "@/lib/attribution-client";
const now = Date.parse("2026-10-08T13:00:00Z");
const touch = (url: string, ref = "", time = now) => captureTouch(url, ref, time);
afterEach(() => vi.unstubAllGlobals());
describe("inquiry channel attribution", () => {
  it("recognizes Google organic and discards search query data", () => {
    const t = touch("https://www.kakapatches.com/products/custom-velcro-patches", "https://www.google.com/search?q=private");
    expect(t).toMatchObject({ source: "google", medium: "organic", channel: "Organic search", landingPage: "/products/custom-velcro-patches", referrer: "https://www.google.com/search" });
  });
  it.each(["chatgpt.com", "perplexity.ai", "claude.ai"])("recognizes %s referrals", host => {
    expect(touch("https://www.kakapatches.com/", `https://${host}/`).channel).toBe("AI referral");
  });
  it("preserves UTM through product → quote navigation", () => {
    const first = touch("https://www.kakapatches.com/products?utm_source=linkedin&utm_medium=social&utm_campaign=oct");
    const state = nextAttribution(null, first, now, false);
    const moved = nextAttribution(state, touch("https://www.kakapatches.com/request-a-quote", "", now + 1000), now + 1000, false);
    expect(moved.first).toEqual(first);
    expect(moved.session).toEqual(first);
  });
  it("keeps first acquisition while marking a later direct session", () => {
    const first = touch("https://www.kakapatches.com/", "https://www.google.com/");
    const state = nextAttribution(null, first, now, false);
    const time = now + SESSION_TTL + 1;
    const moved = nextAttribution(state, touch("https://www.kakapatches.com/", "", time), time, false);
    expect(moved.first.source).toBe("google");
    expect(moved.session.channel).toBe("Direct / Unknown");
  });
  it("records a new external campaign without overwriting first source", () => {
    const first = touch("https://www.kakapatches.com/", "https://www.google.com/");
    const state = nextAttribution(null, first, now, false);
    const second = touch("https://www.kakapatches.com/?utm_source=newsletter&utm_medium=email");
    const moved = nextAttribution(state, second, now + 1000, true);
    expect(moved.first.source).toBe("google");
    expect(moved.session.channel).toBe("Email");
  });
  it("does not classify own-domain navigation as a referral", () => {
    expect(touch("https://www.kakapatches.com/request-a-quote", "https://kakapatches.com/products").referrer).toBe("");
  });
  it("uses click IDs as paid evidence", () => {
    expect(touch("https://www.kakapatches.com/?gclid=123")).toMatchObject({ source: "google", medium: "cpc", channel: "Paid advertising" });
    expect(touch("https://www.kakapatches.com/?msclkid=123").source).toBe("bing");
  });
  it("expires first attribution after 90 days", () => {
    const first = touch("https://www.kakapatches.com/", "https://www.google.com/");
    const time = now + 91 * 86400000;
    expect(nextAttribution(nextAttribution(null, first, now, false), touch("https://www.kakapatches.com/", "", time), time, false).first.source).toBe("direct");
  });
  it("validates payload and recalculates untrusted channel labels", () => {
    const first = touch("https://www.kakapatches.com/");
    const result = normalizeAttribution({ version: 1, first: { ...first, channel: "Fake" }, session: first, submissionPage: "/request-a-quote?email=private" });
    expect(result?.first.channel).toBe("Direct / Unknown");
    expect(result?.submissionPage).toBe("/request-a-quote");
    expect(normalizeAttribution('{bad')).toBeNull();
    expect(normalizeAttribution({version:1})).toBeNull();
    expect(touchLabel(null)).toBe("Unknown (not recorded)");
    expect(safePage("//evil.example/")).toBe("");
    expect(safeReferrer("javascript:alert(1)")).toBe("");
  });
  it("continues recording when browser storage throws", () => {
    vi.stubGlobal("window", { location: new URL("https://www.kakapatches.com/products?utm_source=linkedin&utm_medium=social"), localStorage: { getItem() { throw Error(); }, setItem() { throw Error(); } } });
    vi.stubGlobal("document", { referrer: "" });
    expect(recordVisit()?.first.source).toBe("linkedin");
    window.location.href = "https://www.kakapatches.com/request-a-quote";
    expect(recordVisit()?.session.source).toBe("linkedin");
  });
});
