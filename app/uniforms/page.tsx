import { getAllProducts } from "@/lib/supabase/products"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default async function UniformsPage() {
  const products = await getAllProducts()
  const uniformProducts = products.filter(product => 
    product.name.toLowerCase().includes('uniform') ||
    product.description?.toLowerCase().includes('uniform') ||
    product.category?.name.toLowerCase().includes('uniform')
  )

  // If no specific uniform products, show business attire suitable for uniforms
  const displayProducts = uniformProducts.length > 0 ? uniformProducts : products.slice(0, 6)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
          Professional Uniforms
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Elevate your team's professional image with our custom uniform collections. 
          Designed for comfort, durability, and style across various industries and corporate environments.
        </p>
      </div>

      {/* Categories Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏢</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Corporate Uniforms</h3>
          <p className="text-muted-foreground text-sm">
            Professional attire for offices, hotels, and business environments
          </p>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏥</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Healthcare Uniforms</h3>
          <p className="text-muted-foreground text-sm">
            Comfortable and functional uniforms for medical professionals
          </p>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎓</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">School Uniforms</h3>
          <p className="text-muted-foreground text-sm">
            Durable and stylish uniforms for educational institutions
          </p>
        </Card>
      </div>

      {/* Featured Uniform Collections */}
      <div className="mb-12">
        <h2 className="font-serif text-2xl font-bold text-center mb-8">Featured Collections</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <Card key={product.id} className="group border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-t-lg overflow-hidden">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Uniform Ready
                    </div>
                  </div>
                </Link>

                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xl text-foreground">${product.price}</span>
                    <span className="text-sm text-primary">Bulk Pricing Available</span>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/products/${product.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Custom Uniform Service */}
      <div className="bg-primary/5 rounded-lg p-8 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">
            Custom Uniform Solutions
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            We specialize in creating custom uniform programs tailored to your organization's needs. 
            From design consultation to bulk ordering and ongoing support.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Consultation</h4>
              <p className="text-sm text-muted-foreground">Design uniforms that reflect your brand</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Production</h4>
              <p className="text-sm text-muted-foreground">Quality manufacturing with fast turnaround</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Delivery</h4>
              <p className="text-sm text-muted-foreground">Ongoing support and reordering services</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">Request Quote</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/catalog">Download Catalog</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h4 className="font-semibold mb-2">Quality Materials</h4>
          <p className="text-sm text-muted-foreground">Durable fabrics designed for daily wear</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📏</span>
          </div>
          <h4 className="font-semibold mb-2">Perfect Fit</h4>
          <p className="text-sm text-muted-foreground">Extended size ranges and custom tailoring</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚚</span>
          </div>
          <h4 className="font-semibold mb-2">Fast Delivery</h4>
          <p className="text-sm text-muted-foreground">Quick turnaround for urgent orders</p>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <h4 className="font-semibold mb-2">Bulk Pricing</h4>
          <p className="text-sm text-muted-foreground">Competitive rates for large orders</p>
        </div>
      </div>
    </div>
  )
}