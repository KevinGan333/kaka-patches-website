import { withPageMetadata } from "@/lib/page-metadata";
import type { Metadata } from 'next';
import HomeContent from '@/components/home/HomeContent';
import { homeFaqs } from '@/lib/home-catalog';
export const metadata: Metadata = withPageMetadata({
  title: 'Custom Patches for Brands & Teams | KaKa Patches',
  description: 'Create custom embroidered, woven, PVC, chenille, leather and printed patches. Factory-direct support, artwork review and sampling. From 200 pieces per design.',
  robots: { index: true, follow: true },
}, "/", "/images/home/pvc.webp");
export default function Home() {
  return <><HomeContent/><script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:homeFaqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}}))})}}/></>;
}
