import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-[1440px] px-8 py-16">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">KP</div>
              <span className="text-xl font-bold">KaKa<span className="text-blue-400">Patches</span></span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
              Custom patch manufacturer for clothing brands, sports teams, uniform suppliers, events and promotional products. Factory-direct production with artwork support and flexible customization.
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-slate-500">Factory-direct custom patch support for B2B buyers worldwide.</p>
            <p className="mt-3 text-sm text-slate-400">
              Email: <a href="mailto:sales@kakapatches.com" className="text-blue-400 hover:text-blue-300 transition">sales@kakapatches.com</a>
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-300">Products</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/products/custom-embroidered-patches" className="hover:text-white transition">Custom Embroidered Patches</Link></li>
              <li><Link href="/products/custom-woven-patches" className="hover:text-white transition">Custom Woven Patches</Link></li>
              <li><Link href="/products/custom-pvc-patches" className="hover:text-white transition">Custom PVC Patches</Link></li>
              <li><Link href="/products/custom-chenille-patches" className="hover:text-white transition">Custom Chenille Patches</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-300">Applications</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/applications/custom-patches-for-clothing-brands" className="hover:text-white transition">Clothing Brands</Link></li>
              <li><Link href="/applications/custom-patches-for-sports-teams" className="hover:text-white transition">Sports Teams</Link></li>
              <li><Link href="/applications/custom-patches-for-uniforms" className="hover:text-white transition">Uniform Suppliers</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-300">Company</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link href="/custom-process" className="hover:text-white transition">Custom Process</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/resources" className="hover:text-white transition">Resources</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
            <Link
              href="/request-a-quote"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-500"
            >
              Request a Quote
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} KaKa Patches. Factory-direct custom patch manufacturer for B2B buyers worldwide.
        </div>
      </div>
    </footer>
  );
}
