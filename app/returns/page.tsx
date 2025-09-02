import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Removed tabs import - using simple section layout instead
import { RotateCcw, Clock, Package, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <RotateCcw className="h-8 w-8 text-primary" />
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Returns & Exchanges
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We want you to love your professional wardrobe. If something isn't perfect, we're here to make it right.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">30-Day Returns</Badge>
              <Badge variant="secondary">Free Return Shipping</Badge>
              <Badge variant="secondary">Easy Process</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Returns Policy */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {/* Navigation Pills */}
          <div className="flex justify-center">
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
              <div className="px-4 py-2 bg-background text-foreground rounded-md text-sm font-medium">Return Policy</div>
              <div className="px-4 py-2 text-muted-foreground rounded-md text-sm font-medium cursor-pointer hover:text-foreground">How to Return</div>
              <div className="px-4 py-2 text-muted-foreground rounded-md text-sm font-medium cursor-pointer hover:text-foreground">Exchanges</div>
              <div className="px-4 py-2 text-muted-foreground rounded-md text-sm font-medium cursor-pointer hover:text-foreground">FAQ</div>
            </div>
          </div>

          {/* Return Policy Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>30-Day Return Window</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>What Can Be Returned</span>
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• All clothing items in original condition</li>
                        <li>• Items with original tags attached</li>
                        <li>• Unworn and unwashed garments</li>
                        <li>• Items in original packaging</li>
                        <li>• Accessories in unused condition</li>
                        <li>• Custom orders (with 50% restocking fee)</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-800">Free Returns</p>
                      <p className="text-sm text-green-700">
                        We provide a prepaid return label for all domestic returns. International customers 
                        receive a return credit after the first return.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span>What Cannot Be Returned</span>
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Items worn or washed</li>
                        <li>• Items without original tags</li>
                        <li>• Damaged or altered items</li>
                        <li>• Intimate apparel for hygiene reasons</li>
                        <li>• Items returned after 30 days</li>
                        <li>• Final sale items (marked as such)</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <p className="text-sm font-medium text-amber-800">Special Conditions</p>
                      <p className="text-sm text-amber-700">
                        Custom tailored items and made-to-order pieces have special return conditions. 
                        Please review your order confirmation for details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold">Processing Time</h4>
                    <p className="text-sm text-muted-foreground">
                      3-5 business days after we receive your return
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold">Refund Method</h4>
                    <p className="text-sm text-muted-foreground">
                      Original payment method or store credit
                    </p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold">Credit Time</h4>
                    <p className="text-sm text-muted-foreground">
                      5-10 business days to appear on your statement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How to Return Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Return Process - Step by Step</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
                        1
                      </div>
                      <h4 className="font-semibold">Initiate Return</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact us or use your account to start a return request
                      </p>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
                        2
                      </div>
                      <h4 className="font-semibold">Pack Items</h4>
                      <p className="text-sm text-muted-foreground">
                        Place items in original packaging with tags attached
                      </p>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
                        3
                      </div>
                      <h4 className="font-semibold">Ship Back</h4>
                      <p className="text-sm text-muted-foreground">
                        Use our prepaid label and drop off at any courier location
                      </p>
                    </div>
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary font-bold text-xl">
                        4
                      </div>
                      <h4 className="font-semibold">Get Refund</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive your refund within 3-5 business days
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted p-6 rounded-lg">
                    <h4 className="font-semibold mb-4">Return Checklist</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Original tags attached</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Items unworn and unwashed</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Original packaging included</label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Return form completed</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Prepaid label attached</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <label className="text-sm">Tracking number saved</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Return Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-l-4 border-primary pl-4">
                    <h4 className="font-semibold">Online Return Portal</h4>
                    <p className="text-sm text-muted-foreground">
                      Log into your account and select the items you wish to return. 
                      Print your prepaid label instantly.
                    </p>
                  </div>
                  <div className="border-l-4 border-muted-foreground pl-4">
                    <h4 className="font-semibold">Customer Service</h4>
                    <p className="text-sm text-muted-foreground">
                      Call or email our team for assistance with your return. 
                      We'll guide you through the process.
                    </p>
                  </div>
                  <div className="border-l-4 border-muted-foreground pl-4">
                    <h4 className="font-semibold">In-Store Returns</h4>
                    <p className="text-sm text-muted-foreground">
                      Visit our flagship stores for immediate processing and 
                      instant refunds for eligible items.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Custom Orders</h4>
                      <p className="text-sm text-muted-foreground">
                        Custom tailored items have a 50% restocking fee and extended return period.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">International Returns</h4>
                      <p className="text-sm text-muted-foreground">
                        Different processing times may apply. See our international return guide.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Quality Issues</h4>
                      <p className="text-sm text-muted-foreground">
                        Items with manufacturing defects are eligible for full refund plus shipping.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Exchanges Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Size & Style Exchanges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Free Size Exchanges</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We offer complimentary size exchanges for the same item in a different size, 
                        subject to availability.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Same item, different size only</li>
                        <li>• Within 30 days of purchase</li>
                        <li>• Original condition required</li>
                        <li>• Free shipping both ways</li>
                      </ul>
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/contact">Request Size Exchange</Link>
                    </Button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Style Exchanges</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Exchange for a different style or color of equal or greater value 
                        within our exchange program.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Price difference applies if higher value</li>
                        <li>• Refund issued if lower value</li>
                        <li>• Subject to stock availability</li>
                        <li>• One exchange per item</li>
                      </ul>
                    </div>
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/size-guide">Size Guide</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exchange Process</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <RotateCcw className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold">Request Exchange</h4>
                      <p className="text-sm text-muted-foreground">
                        Contact us with your order details and preferred replacement
                      </p>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Package className="h-6 w-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold">Send Original</h4>
                      <p className="text-sm text-muted-foreground">
                        Ship your original item back using our prepaid label
                      </p>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold">Receive New Item</h4>
                      <p className="text-sm text-muted-foreground">
                        Get your replacement item shipped within 2-3 business days
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">How long do I have to return an item?</h4>
                    <p className="text-sm text-muted-foreground">
                      You have 30 days from the delivery date to return items. The return window starts 
                      from when you receive your order, not when it ships.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I return items without the original packaging?</h4>
                    <p className="text-sm text-muted-foreground">
                      We prefer items in original packaging, but it's not always required. However, 
                      items must be in perfect condition with all tags attached.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if I received the wrong item?</h4>
                    <p className="text-sm text-muted-foreground">
                      If you received an incorrect item, we'll provide a prepaid return label and 
                      priority replacement shipping at no cost to you.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I return sale items?</h4>
                    <p className="text-sm text-muted-foreground">
                      Most sale items can be returned within the standard 30-day period. However, 
                      items marked as "Final Sale" cannot be returned or exchanged.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How do I track my return?</h4>
                    <p className="text-sm text-muted-foreground">
                      Use the tracking number provided with your return label. You'll also receive 
                      email updates when we receive and process your return.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if my item was damaged during shipping?</h4>
                    <p className="text-sm text-muted-foreground">
                      Items damaged during shipping are fully covered. Contact us immediately with 
                      photos, and we'll arrange a replacement and full refund of shipping costs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-16">
          <h3 className="text-xl font-semibold mb-4">Need Help with Returns?</h3>
          <p className="text-muted-foreground mb-6">
            Our customer service team is ready to assist you with any return questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/shipping">Shipping Info</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}