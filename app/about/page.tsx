import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-foreground mb-6">
              About Omaima
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Empowering professional women through elegant, high-quality formal wear 
              and customizable uniforms that embody confidence, sophistication, and success.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a vision to redefine professional women's fashion, Omaima began as a passion project 
                  to create clothing that truly understands the modern working woman's needs. We recognized that 
                  professional attire should never compromise on style, comfort, or quality.
                </p>
                <p>
                  Our journey started with a simple belief: every woman deserves to feel confident and empowered 
                  in her professional environment. From boardrooms to hospitals, from schools to corporate offices, 
                  we design pieces that help women make their mark with elegance and authority.
                </p>
                <p>
                  Today, Omaima has evolved into a trusted partner for individual professionals and organizations 
                  seeking premium formal wear and custom uniform solutions that reflect their values and standards.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/about-story-image.jpg"
                  alt="Professional women in Omaima attire"
                  width={600}
                  height={750}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do, from design to customer service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold text-xl mb-4">Excellence</h3>
              <p className="text-muted-foreground">
                We pursue perfection in every stitch, every cut, and every detail to deliver 
                exceptional quality that lasts.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💪</span>
              </div>
              <h3 className="font-semibold text-xl mb-4">Empowerment</h3>
              <p className="text-muted-foreground">
                Our designs are created to help women feel confident, powerful, and ready 
                to conquer any professional challenge.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-semibold text-xl mb-4">Sustainability</h3>
              <p className="text-muted-foreground">
                We're committed to responsible practices, using sustainable materials and 
                ethical manufacturing processes.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="font-semibold text-xl mb-4">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously evolve our designs and processes to meet the changing 
                needs of modern professional women.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-semibold text-xl mb-4">Partnership</h3>
              <p className="text-muted-foreground">
                We build lasting relationships with our clients, understanding their unique 
                needs and exceeding their expectations.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="font-semibold text-xl mb-4">Inclusivity</h3>
              <p className="text-muted-foreground">
                We celebrate diversity and create designs that cater to women of all 
                backgrounds, sizes, and professional paths.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive solutions for all your professional wardrobe needs
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-xl mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">
                  1
                </span>
                Ready-to-Wear Collection
              </h3>
              <p className="text-muted-foreground mb-4">
                Curated selection of professional suits, blazers, and formal wear 
                available in multiple sizes and colors.
              </p>
              <Button variant="outline" asChild>
                <Link href="/suits">Shop Collection</Link>
              </Button>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-xl mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">
                  2
                </span>
                Custom Uniforms
              </h3>
              <p className="text-muted-foreground mb-4">
                Tailored uniform solutions for organizations, with custom design, 
                branding, and bulk ordering options.
              </p>
              <Button variant="outline" asChild>
                <Link href="/uniforms">Explore Uniforms</Link>
              </Button>
            </Card>
            
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-xl mb-4 flex items-center">
                <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center mr-3">
                  3
                </span>
                Mix & Match System
              </h3>
              <p className="text-muted-foreground mb-4">
                Versatile pieces designed to work together, creating multiple 
                professional looks from fewer items.
              </p>
              <Button variant="outline" asChild>
                <Link href="/mix-match">Try Mix & Match</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Passionate professionals dedicated to creating exceptional experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                <Image
                  src="/team-designer.jpg"
                  alt="Head Designer"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sarah Mitchell</h3>
              <p className="text-primary font-medium mb-3">Head Designer</p>
              <p className="text-sm text-muted-foreground">
                15+ years creating elegant professional wear with a focus on modern silhouettes.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                <Image
                  src="/team-operations.jpg"
                  alt="Operations Director"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Maria Rodriguez</h3>
              <p className="text-primary font-medium mb-3">Operations Director</p>
              <p className="text-sm text-muted-foreground">
                Expert in supply chain management and quality assurance for luxury fashion.
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg">
              <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                <Image
                  src="/team-customer.jpg"
                  alt="Customer Success Manager"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">Jessica Chen</h3>
              <p className="text-primary font-medium mb-3">Customer Success</p>
              <p className="text-sm text-muted-foreground">
                Dedicated to ensuring every customer has an exceptional experience with us.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Elevate Your Professional Style?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our collections or reach out for custom solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/suits">Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}