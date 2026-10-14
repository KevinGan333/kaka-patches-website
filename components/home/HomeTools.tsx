"use client";
import { useState } from 'react';
import type { FormEvent } from 'react';
import { homeProducts, homeBackings, quoteHref } from '@/lib/home-catalog';

export function PatchFinder() {
  const [use, setUse] = useState('Apparel & uniforms');
  const [detail, setDetail] = useState('Classic stitched texture');
  const index = detail === 'Fine lettering & small details' ? 1 : detail === 'Full-color artwork & gradients' ? 5 : detail === 'Soft, raised texture' ? 3 : use === 'Outdoor & tactical gear' ? 2 : detail === 'Premium label finish' ? 4 : 0;
  const product = homeProducts[index];
  return <div className="kh-finder">
    <div className="kh-finder-inputs"><label htmlFor="patch-use">01 / Where will you use it?</label><select id="patch-use" value={use} onChange={e => setUse(e.target.value)}>{['Apparel & uniforms','Hats & accessories','Outdoor & tactical gear','Teams & merchandise'].map(v => <option key={v}>{v}</option>)}</select><label htmlFor="patch-detail">02 / What matters most?</label><select id="patch-detail" value={detail} onChange={e => setDetail(e.target.value)}>{['Classic stitched texture','Fine lettering & small details','Full-color artwork & gradients','Soft, raised texture','Premium label finish'].map(v => <option key={v}>{v}</option>)}</select><a href="/resources/embroidered-vs-woven-patches" className="kh-text-link">Read the embroidered vs. woven guide ↗</a></div>
    <div className="kh-finder-result" aria-live="polite" aria-atomic="true"><img src={product.image} alt={product.alt} width="240" height="240" loading="lazy"/><div><span className="kh-eyebrow">A good place to start</span><h3>{product.name} patches</h3><p>{product.description}</p><a className="kh-text-link" href={'/products/'+product.slug}>Explore this patch type ↗</a><p className="kh-fine">Final suitability depends on your artwork, size and application.</p></div></div>
  </div>;
}
export function BackingSelector() {
  const [selected, setSelected] = useState(0);
  const backing = homeBackings[selected];
  return <div className="kh-backing-tool"><div className="kh-backing-tabs" role="tablist" aria-label="Patch backing options">{homeBackings.map((item, i) => <button key={item.name} id={'backing-tab-'+i} type="button" role="tab" aria-selected={selected===i} aria-controls={'backing-panel-'+i} tabIndex={selected===i?0:-1} onClick={()=>setSelected(i)} onKeyDown={e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?3:(i+(e.key==='ArrowRight'?1:3))%4;setSelected(next);document.getElementById('backing-tab-'+next)?.focus();}}}><span aria-hidden="true">{item.icon}</span>{item.name}</button>)}</div><div id={'backing-panel-'+selected} role="tabpanel" aria-labelledby={'backing-tab-'+selected} className="kh-backing-panel"><h3>{backing.title}</h3><p>{backing.text}</p><a className="kh-text-link" href={quoteHref('custom-embroidered-patches','I would like '+backing.query+'. Please confirm suitability for my application.')}>Ask about {backing.name.toLowerCase()} backing ↗</a></div></div>;
}
export function QuoteStarter() {
  const [product, setProduct] = useState('custom-embroidered-patches');
  const [quantity, setQuantity] = useState('200');
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const href = quoteHref(product, 'Homepage quote request: '+quantity+' pieces per design.'); window.location.assign(href + (quantity !== '5000+' ? '&quantity=' + quantity : '')); }
  return <form className="kh-quote-starter" onSubmit={submit}><div><label htmlFor="quote-product">Patch type</label><select id="quote-product" value={product} onChange={e=>setProduct(e.target.value)}>{homeProducts.map(p=><option key={p.slug} value={p.slug}>{p.name} patches</option>)}<option value="custom-velcro-patches">Velcro patches</option></select></div><div><label htmlFor="quote-quantity">Pieces per design</label><select id="quote-quantity" value={quantity} onChange={e=>setQuantity(e.target.value)}>{['200','300','500','1000','2000','5000+'].map(q=><option key={q}>{q}</option>)}</select></div><button className="kh-button kh-button-yellow" type="submit">Start my quote <span aria-hidden="true">↗</span></button><p>Next: add your artwork, size and contact details.</p></form>;
}
