export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "KaKa Patches",
          url: "https://www.kakapatches.com",
          description:
            "B2B custom patch manufacturer producing embroidered, woven, PVC and chenille patches for apparel brands, sports teams, uniforms and promotional buyers.",
          sameAs: [],
        }),
      }}
    />
  );
}

export function WebsiteSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "KaKa Patches",
          url: "https://www.kakapatches.com",
        }),
      }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  image,
  category,
}: {
  name: string;
  description: string;
  image?: string;
  category?: string;
}) {
  const baseUrl = "https://www.kakapatches.com";
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: { "@type": "Brand", name: "KaKa Patches" },
    manufacturer: { "@type": "Organization", name: "KaKa Patches" },
  };
  // Deliberately omit offers/price/availability/reviews — those are not
  // published and must not be fabricated.
  if (image) data.image = image.startsWith("http") ? image : `${baseUrl}${image}`;
  if (category) data.category = category;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQSchema({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }),
      }}
    />
  );
}

export function BreadcrumbListSchema({ items }: { items: { name: string; href: string }[] }) {
  const baseUrl = "https://www.kakapatches.com";
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${baseUrl}${item.href}`,
          })),
        }),
      }}
    />
  );
}
