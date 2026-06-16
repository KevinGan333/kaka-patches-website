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
