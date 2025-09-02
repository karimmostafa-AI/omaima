import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/supabase/products"
import Link from "next/link"
import { FeaturedProductsCarousel } from "@/components/featured-products-carousel"

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8) // Get more products for carousel

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Featured Products</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular pieces, loved by professional women worldwide
          </p>
        </div>

        <FeaturedProductsCarousel products={products} />

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
