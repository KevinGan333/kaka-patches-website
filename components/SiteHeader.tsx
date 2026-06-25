import Link from "next/link";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Applications", href: "/applications" },
  { name: "Custom Process", href: "/custom-process" },
  { name: "About Us", href: "/about-us" },
  { name: "Resources", href: "/resources" },
  { name: "Blog", href: "/blog" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-3.5">
        <Link href="/" className="group flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/kaka-patches-logo.svg" alt="KaKa Patches logo" className="h-14 w-auto" />
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-blue-600">
              {item.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/request-a-quote"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-blue-600/30"
        >
          Request a Quote
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </Link>
      </div>
    </header>
  );
}
