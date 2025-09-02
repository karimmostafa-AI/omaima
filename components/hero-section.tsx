import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-background to-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Elevate Your
                <span className="text-primary block">Professional Style</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Discover our curated collection of sophisticated suits and customizable uniforms, designed for the
                modern professional woman who values elegance and quality.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-medium">
                <Link href="/suits">Shop Suits</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-medium bg-transparent">
                <Link href="/mix-match">Create Your Look</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Premium Fabrics</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Custom Tailoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Fast Delivery</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
              <img
                src="/elegant-professional-woman-in-formal-business-suit.png"
                alt="Professional woman in elegant business suit"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-background border border-border rounded-lg p-4 shadow-lg">
              <div className="text-sm text-muted-foreground">Starting from</div>
              <div className="text-2xl font-bold text-foreground">$299</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
