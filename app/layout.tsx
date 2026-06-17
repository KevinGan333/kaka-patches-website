import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { OrganizationSchema, WebsiteSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: {
    default: "KaKa Patches | Custom Patch Manufacturer",
    template: "%s",
  },
  description:
    "KaKa Patches is a B2B custom patch manufacturer producing embroidered, woven, PVC and chenille patches for apparel brands, sports teams, uniforms and promotional buyers.",
  openGraph: {
    title: "KaKa Patches | Custom Patch Manufacturer",
    description:
      "KaKa Patches is a B2B custom patch manufacturer producing embroidered, woven, PVC and chenille patches for apparel brands, sports teams, uniforms and promotional buyers.",
    url: "https://www.kakapatches.com",
    siteName: "KaKa Patches",
    type: "website",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "MwETn_-YyFwWTK3g_vXxwL-H5_lRctfBMPIGbqlHwso",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="MwETn_-YyFwWTK3g_vXxwL-H5_lRctfBMPIGbqlHwso" />
      </head>
      <body>
        <OrganizationSchema />
        <WebsiteSchema />
        {!isAdmin && <SiteHeader />}
        {children}
        {!isAdmin && <SiteFooter />}
      </body>
    </html>
  );
}
