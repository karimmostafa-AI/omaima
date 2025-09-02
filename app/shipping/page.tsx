import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, Package, MapPin, Shield, Gift } from "lucide-react"
import Link from "next/link"

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Truck className="h-8 w-8 text-primary" />
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Shipping Information
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fast, reliable delivery for your professional wardrobe. We ensure your orders arrive safely and on time.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Free Shipping on $150+</Badge>
              <Badge variant="secondary">Express Options Available</Badge>
              <Badge variant="secondary">International Delivery</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {/* Domestic Shipping */}
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Domestic Shipping Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Standard Delivery</CardTitle>
                  <Badge variant="outline">Most Popular</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold text-primary">FREE</div>
                  <p className="text-sm text-muted-foreground">on orders over $150</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">5-7 business days</span>
                    </div>
                    <p className="text-sm text-muted-foreground">$8.99 for orders under $150</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Express Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold text-orange-600">$19.99</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">2-3 business days</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Tracking included</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Next Day Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-3xl font-bold text-red-600">$39.99</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Next business day</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Order by 2 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* International Shipping */}
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">International Shipping</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-6 w-6 text-primary" />
                      <h3 className="text-xl font-semibold">Global Delivery</h3>
                    </div>
                    <p className="text-muted-foreground">
                      We ship to over 50 countries worldwide. Professional attire delivered to your doorstep, 
                      no matter where you are.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Europe & UK:</span>
                        <span>$25.99 (7-12 days)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">North America:</span>
                        <span>$29.99 (10-15 days)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Asia Pacific:</span>
                        <span>$35.99 (12-18 days)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Rest of World:</span>
                        <span>$45.99 (15-25 days)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold">Important Notes</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Customs duties and taxes may apply</li>
                      <li>• Delivery times exclude customs processing</li>
                      <li>• Express international options available</li>
                      <li>• Free shipping on orders over $300</li>
                      <li>• Signature required for delivery</li>
                    </ul>
                    <Button asChild className="w-full">
                      <Link href="/contact">Contact for Quote</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Delivery Details</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Order Processing</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Processing Time:</span>
                      <span>1-2 business days</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Cut-off Time:</span>
                      <span>2:00 PM same day</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium">Business Days:</span>
                      <span>Monday - Friday</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tracking:</span>
                      <span>Email confirmation sent</span>
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Orders placed after 2 PM on Friday will be processed on Monday.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Secure Packaging</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm">Professional garment bags for suits and blazers</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm">Eco-friendly packaging materials</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm">Moisture protection for all items</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm">Signature required for valuable orders</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm">Insurance included on all shipments</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Special Services */}
          <div>
            <h2 className="text-3xl font-semibold text-foreground mb-8 text-center">Special Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Gift Wrapping</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Elegant gift wrapping available for special occasions
                  </p>
                  <div className="text-lg font-semibold">$9.99</div>
                  <p className="text-xs text-muted-foreground">Includes premium box and ribbon</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Scheduled Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred delivery date and time slot
                  </p>
                  <div className="text-lg font-semibold">$14.99</div>
                  <p className="text-xs text-muted-foreground">Subject to availability</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>White Glove Delivery</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Premium delivery service for high-value orders
                  </p>
                  <div className="text-lg font-semibold">$49.99</div>
                  <p className="text-xs text-muted-foreground">Orders over $500</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Can I change my shipping address?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can change your shipping address within 24 hours of placing your order. 
                      Please contact our customer service team immediately.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you offer PO Box delivery?</h4>
                    <p className="text-sm text-muted-foreground">
                      PO Box delivery is available for standard shipping only. Express and next-day 
                      delivery require a physical address.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if I'm not home for delivery?</h4>
                    <p className="text-sm text-muted-foreground">
                      We'll leave a delivery notice and attempt redelivery. You can also arrange 
                      to collect from a local pickup point.
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">How do I track my order?</h4>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a tracking number via email once your order ships. Use this 
                      to monitor your delivery progress online.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Are shipping costs refundable?</h4>
                    <p className="text-sm text-muted-foreground">
                      Shipping costs are refundable only if the return is due to our error 
                      (wrong item, damaged goods, etc.).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I expedite an existing order?</h4>
                    <p className="text-sm text-muted-foreground">
                      Orders can be expedited within 24 hours of placement, subject to additional 
                      charges and availability.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Need Help with Shipping?</h3>
            <p className="text-muted-foreground mb-6">
              Our customer service team is here to assist with any shipping questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/returns">Return Policy</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}