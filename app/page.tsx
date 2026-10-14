import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { homeFaqs } from '@/lib/home-catalog';
export const metadata: Metadata = {
  title: 'Custom Patches for Brands, Teams & Uniforms | KaKa Patches',
  description: 'Create custom embroidered, woven, PVC, chenille, leather and printed patches. Factory-direct support, artwork review and sampling. From 200 pieces per design.',
  alternates: { canonical: 'https://www.kakapatches.com/' },
  openGraph: { title: 'Custom Patches, Made for Your Brand | KaKa Patches', description: 'Find your patch type, choose your backing and request a custom quote. Factory-direct support from 200 pieces per design.', url: 'https://www.kakapatches.com/', siteName: 'KaKa Patches', type: 'website' },
  robots: { index: true, follow: true },
};
export default function Home() {
  return <><HomeContent/><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:homeFaqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))})}}/></>;
}
