import type { Metadata } from "next";
import Link from "next/link";
import { siteContact, socialLinks } from "@/lib/site-contact";

export const metadata: Metadata = {
  title: "Contact KaKa Patches | Phone, WhatsApp & Email",
  description: "Contact KaKa Patches for custom patch designs, samples and bulk orders. Call or WhatsApp +1 646 739 1609, or email sales@kakapatches.com.",
  alternates: { canonical: "https://www.kakapatches.com/contact-us" },
};

export default function Page() {
  return (
    <main className="kk-editorial">
      <section className="kk-page-hero"><div className="kh-container">
        <p className="kk-eyebrow">Contact KaKa Patches</p>
        <h1>Let’s make<br /><span>something yours.</span></h1>
        <p className="kk-hero-intro">Have a design in mind? Talk to us about artwork, samples, patch types, or your next bulk order.</p>
      </div></section>
      <section className="kk-contact-section"><div className="kh-container">
        <h2>Get in touch</h2>
        <div className="kk-contact-grid">
          <div className="kk-contact-card"><h3>Email</h3><p>Send your artwork or project details.</p><a href={`mailto:${siteContact.email}`}>{siteContact.email} ↗</a></div>
          <div className="kk-contact-card"><h3>Phone</h3><p>Call us to discuss your project.</p><a href={`tel:${siteContact.telephone}`}>{siteContact.phone} ↗</a></div>
          <div className="kk-contact-card"><h3>WhatsApp</h3><p>Share your ideas and reference images.</p><a href={siteContact.whatsapp} target="_blank" rel="noopener noreferrer">{siteContact.phone} ↗<span className="sr-only"> (opens WhatsApp in a new tab)</span></a></div>
        </div>
        <div className="kk-contact-social"><h2>Connect with us</h2><nav aria-label="KaKa Patches social media"><ul>{socialLinks.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul></nav></div>
      </div></section>
      <section className="kk-story-cta"><div className="kh-container"><h2>Ready to start?</h2><p>Send your design, size, quantity, and preferred patch type so we can review your project.</p><div className="kk-page-actions"><Link className="kh-button" href="/request-a-quote">Request a custom quote ↗</Link><Link className="kh-button kh-button-outline" href="/about-us">Read our story ↗</Link></div></div></section>
    </main>
  );
}
