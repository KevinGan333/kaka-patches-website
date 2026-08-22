"use client";

import { useState } from "react";
import Link from "next/link";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Families", href: "/product-families" },
  { name: "Accessories", href: "/custom-accessories" },
  { name: "Applications", href: "/applications" },
  { name: "Custom Process", href: "/custom-process" },
  { name: "About Us", href: "/about-us" },
  { name: "Resources", href: "/resources" },
  { name: "Blog", href: "/blog" },
];

function QuoteButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/request-a-quote"
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30 ${className}`}
    >
      Request a Quote
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
    </Link>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3.5 sm:px-8 sm:py-3">
        <Link href="/" className="group flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/kaka-patches-logo.svg" alt="KaKa Patches logo" className="h-14 w-auto sm:h-[68px]" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 xl:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-blue-600">
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <QuoteButton className="hidden sm:inline-flex" />

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 xl:hidden"
          >
            {open ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 xl:hidden">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <QuoteButton className="mt-3 w-full justify-center sm:hidden" />
        </div>
      )}
    </header>
  );
}
