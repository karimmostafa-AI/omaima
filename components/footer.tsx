import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground text-primary rounded-sm flex items-center justify-center">
                <span className="font-bold text-lg">O</span>
              </div>
              <span className="font-serif text-2xl font-semibold">Omaima</span>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Elevating professional style with sophisticated suits and customizable uniforms for the modern woman.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Shop</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/suits"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Business Suits
              </Link>
              <Link
                href="/uniforms"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Custom Uniforms
              </Link>
              <Link
                href="/mix-match"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Mix & Match
              </Link>
              <Link
                href="/accessories"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Accessories
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/size-guide"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Size Guide
              </Link>
              <Link
                href="/shipping"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Shipping Info
              </Link>
              <Link
                href="/returns"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Returns
              </Link>
              <Link
                href="/contact"
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-primary-foreground/80 text-sm">Get the latest collections and exclusive offers.</p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-primary-foreground/60 text-sm">© 2024 Omaima. All rights reserved.</p>
          <div className="flex space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
