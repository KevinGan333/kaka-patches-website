export const homeProducts = [
  { name: 'Embroidered', slug: 'custom-embroidered-patches', label: 'The timeless classic', description: 'Raised stitching for bold logos, uniforms and everyday branding.', image: '/images/home/embroidered.webp', alt: 'Embroidered logo patches for uniform and jacket branding', color: 'blue' },
  { name: 'Woven', slug: 'custom-woven-patches', label: 'Made for the details', description: 'A smooth finish that keeps small lettering and intricate artwork clear.', image: '/images/home/woven-detail.webp', alt: 'Woven labels and patches for clothing and apparel branding', color: 'pink' },
  { name: 'PVC', slug: 'custom-pvc-patches', label: 'Ready for the outdoors', description: 'Flexible, water-resistant patches for bags, gear and bold 3D designs.', image: '/images/home/pvc.webp', alt: 'Dimensional PVC logo patches for outdoor bags and equipment', color: 'green' },
  { name: 'Chenille', slug: 'custom-chenille-patches', label: 'Big on texture', description: 'Soft, dimensional texture for varsity jackets and statement pieces.', image: '/images/home/chenille.webp', alt: 'Textured mushroom chenille patches for jackets and canvas bags', color: 'yellow' },
  { name: 'Leather', slug: 'custom-leather-patches', label: 'A premium finishing touch', description: 'Distinctive brand labels for caps, denim and accessories.', image: '/images/home/leather.webp', alt: 'Custom leather logo patches for hats and premium apparel', color: 'tan' },
  { name: 'Printed', slug: 'custom-printed-patches', label: 'Every color. Every detail.', description: 'Full-color artwork for gradients and image-rich designs.', image: '/images/home/printed.webp', alt: 'Printed full-color patches for merchandise and promotional products', color: 'lilac' },
];
export const homeBackings = [
  { name: 'Sew-on', icon: '✂', title: 'Made to stay', text: 'A lasting choice for uniforms, jackets and frequently washed garments. Confirm care requirements for your fabric.', query: 'Sew-on Backing' },
  { name: 'Iron-on', icon: '▱', title: 'Press. Attach. Go.', text: 'Heat-applied backing for compatible fabrics. Check temperature and garment suitability before application.', query: 'Iron-on Backing' },
  { name: 'Hook & loop', icon: '⇄', title: 'Switch it up', text: 'Removable patches for tactical gear, uniforms and interchangeable designs. Choose hook-only or paired hook and loop.', query: 'Velcro Backing' },
  { name: 'Adhesive', icon: '▧', title: 'Peel and place', text: 'A convenient option for temporary displays and suitable surfaces. Tell us your application so we can assess adhesion.', query: 'Adhesive Backing' },
];
export const homeFaqs = [
  { q: 'What is your minimum order quantity?', a: 'Our standard minimum is 200 pieces per design. Share your design, size and quantity so we can confirm the most suitable construction and quote.' },
  { q: 'Can I get a quote without finished artwork?', a: 'Yes. Send a logo, sketch, reference image or your basic requirements. We can review your idea and recommend a patch type. Final pricing depends on the confirmed specifications.' },
  { q: 'Can I approve a physical sample before a bulk order?', a: 'Yes, sampling is available. Sample costs, production time and any credit toward a bulk order are confirmed for your specific project before sampling starts.' },
  { q: 'How do I choose between embroidered and woven patches?', a: 'Embroidered patches have a raised stitched texture and suit bold designs. Woven patches have a flatter surface and are often better for fine details and small lettering. We will review your artwork before recommending a construction.' },
  { q: 'How long will my order take?', a: 'Timing depends on patch type, quantity, sample approval and shipping destination. Include your required delivery date in your inquiry so we can confirm a realistic schedule.' },
];
export function quoteHref(product: string, message?: string) {
  const params = new URLSearchParams({ product });
  if (message) params.set('message', message);
  return '/request-a-quote?' + params.toString();
}
