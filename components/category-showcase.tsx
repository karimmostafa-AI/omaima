import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CategoryShowcase() {
  const categories = [
    {
      title: "Business Suits",
      description: "Professional attire for the modern workplace",
      image: "/elegant-business-suit-on-mannequin.png",
      href: "/suits",
      price: "From $299",
    },
    {
      title: "Custom Uniforms",
      description: "Tailored uniforms for your organization",
      image: "/professional-uniform-collection-display.png",
      href: "/uniforms",
      price: "From $199",
    },
    {
      title: "Mix & Match",
      description: "Create your perfect professional wardrobe",
      image: "/mix-and-match-professional-clothing-pieces.png",
      href: "/mix-match",
      price: "Build Your Set",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Our Collections</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections designed to meet every professional need
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="group cursor-pointer">
              <Link href={category.href}>
                <div className="space-y-4">
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{category.price}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Explore →
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
