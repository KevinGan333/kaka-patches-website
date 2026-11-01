import B2BProductPage from "@/components/B2BProductPage";
import EmbroideredKeychainsPage from "@/components/EmbroideredKeychainsPage";
import type { ProductPage } from "@/lib/admin/products";

export default function ProductPageRenderer({ product }: { product: ProductPage }) {
  if (product.slug === "custom-keychains" && product.guideSections?.length) {
    return <EmbroideredKeychainsPage product={product} />;
  }
  return <B2BProductPage product={product} />;
}
