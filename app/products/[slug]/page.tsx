import { getProductBySlug } from "@/lib/supabase/products";
import { notFound } from "next/navigation";
import { ProductColorSelector } from "@/components/product-color-selector";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        <ProductColorSelector product={product} />
      </div>
    </div>
  );
}
