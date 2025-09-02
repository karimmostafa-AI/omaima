import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// Removed tabs import - using simple section layout instead
import { Ruler, Shirt, Package, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Ruler className="h-8 w-8 text-primary" />
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Size Guide
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find your perfect fit with our comprehensive sizing guide. Professional attire should feel comfortable and look impeccable.
            </p>
            <Badge variant="secondary" className="text-sm">
              Need help? Contact our fit specialists
            </Badge>
          </div>
        </div>
      </div>

      {/* Size Guide Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {/* Navigation Pills */}
          <div className="flex justify-center">
            <div className="flex space-x-1 p-1 bg-muted rounded-lg">
              <div className="px-4 py-2 bg-background text-foreground rounded-md text-sm font-medium">Suits & Blazers</div>
              <div className="px-4 py-2 text-muted-foreground rounded-md text-sm font-medium cursor-pointer hover:text-foreground">Shirts & Blouses</div>
              <div className="px-4 py-2 text-muted-foreground rounded-md text-sm font-medium cursor-pointer hover:text-foreground">Pants & Skirts</div>
              <div className="px-4 py-2 text-muted-foreground rounded-md text-sm font-medium cursor-pointer hover:text-foreground">Accessories</div>
            </div>
          </div>

          {/* Suits & Blazers Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shirt className="h-5 w-5" />
                  <span>Suits & Blazers Size Chart</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left font-semibold">Size</th>
                        <th className="border border-border p-3 text-left font-semibold">UK</th>
                        <th className="border border-border p-3 text-left font-semibold">US</th>
                        <th className="border border-border p-3 text-left font-semibold">EU</th>
                        <th className="border border-border p-3 text-left font-semibold">Bust (cm)</th>
                        <th className="border border-border p-3 text-left font-semibold">Waist (cm)</th>
                        <th className="border border-border p-3 text-left font-semibold">Hips (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium">XS</td>
                        <td className="border border-border p-3">6</td>
                        <td className="border border-border p-3">2</td>
                        <td className="border border-border p-3">32</td>
                        <td className="border border-border p-3">82-86</td>
                        <td className="border border-border p-3">62-66</td>
                        <td className="border border-border p-3">88-92</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">S</td>
                        <td className="border border-border p-3">8</td>
                        <td className="border border-border p-3">4</td>
                        <td className="border border-border p-3">34</td>
                        <td className="border border-border p-3">86-90</td>
                        <td className="border border-border p-3">66-70</td>
                        <td className="border border-border p-3">92-96</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">M</td>
                        <td className="border border-border p-3">10</td>
                        <td className="border border-border p-3">6</td>
                        <td className="border border-border p-3">36</td>
                        <td className="border border-border p-3">90-94</td>
                        <td className="border border-border p-3">70-74</td>
                        <td className="border border-border p-3">96-100</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">L</td>
                        <td className="border border-border p-3">12</td>
                        <td className="border border-border p-3">8</td>
                        <td className="border border-border p-3">38</td>
                        <td className="border border-border p-3">94-98</td>
                        <td className="border border-border p-3">74-78</td>
                        <td className="border border-border p-3">100-104</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">XL</td>
                        <td className="border border-border p-3">14</td>
                        <td className="border border-border p-3">10</td>
                        <td className="border border-border p-3">40</td>
                        <td className="border border-border p-3">98-102</td>
                        <td className="border border-border p-3">78-82</td>
                        <td className="border border-border p-3">104-108</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">XXL</td>
                        <td className="border border-border p-3">16</td>
                        <td className="border border-border p-3">12</td>
                        <td className="border border-border p-3">42</td>
                        <td className="border border-border p-3">102-106</td>
                        <td className="border border-border p-3">82-86</td>
                        <td className="border border-border p-3">108-112</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How to Measure for Suits & Blazers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Bust Measurement</h4>
                    <p className="text-sm text-muted-foreground">
                      Measure around the fullest part of your bust, keeping the tape measure level and comfortable.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Waist Measurement</h4>
                    <p className="text-sm text-muted-foreground">
                      Measure around your natural waistline, usually the narrowest part of your torso.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Hip Measurement</h4>
                    <p className="text-sm text-muted-foreground">
                      Measure around the fullest part of your hips, about 7-9 inches below your waist.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shirts & Blouses Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shirts & Blouses Size Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left font-semibold">Size</th>
                        <th className="border border-border p-3 text-left font-semibold">UK</th>
                        <th className="border border-border p-3 text-left font-semibold">EU</th>
                        <th className="border border-border p-3 text-left font-semibold">Bust (cm)</th>
                        <th className="border border-border p-3 text-left font-semibold">Waist (cm)</th>
                        <th className="border border-border p-3 text-left font-semibold">Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium">XS</td>
                        <td className="border border-border p-3">6</td>
                        <td className="border border-border p-3">32</td>
                        <td className="border border-border p-3">84</td>
                        <td className="border border-border p-3">64</td>
                        <td className="border border-border p-3">61</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">S</td>
                        <td className="border border-border p-3">8</td>
                        <td className="border border-border p-3">34</td>
                        <td className="border border-border p-3">88</td>
                        <td className="border border-border p-3">68</td>
                        <td className="border border-border p-3">62</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">M</td>
                        <td className="border border-border p-3">10</td>
                        <td className="border border-border p-3">36</td>
                        <td className="border border-border p-3">92</td>
                        <td className="border border-border p-3">72</td>
                        <td className="border border-border p-3">63</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">L</td>
                        <td className="border border-border p-3">12</td>
                        <td className="border border-border p-3">38</td>
                        <td className="border border-border p-3">96</td>
                        <td className="border border-border p-3">76</td>
                        <td className="border border-border p-3">64</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">XL</td>
                        <td className="border border-border p-3">14</td>
                        <td className="border border-border p-3">40</td>
                        <td className="border border-border p-3">100</td>
                        <td className="border border-border p-3">80</td>
                        <td className="border border-border p-3">65</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pants & Skirts Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Pants & Skirts Size Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left font-semibold">Size</th>
                        <th className="border border-border p-3 text-left font-semibold">UK</th>
                        <th className="border border-border p-3 text-left font-semibold">Waist (cm)</th>
                        <th className="border border-border p-3 text-left font-semibold">Hips (cm)</th>
                        <th className="border border-border p-3 text-left font-semibold">Inside Leg (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3 font-medium">XS</td>
                        <td className="border border-border p-3">6</td>
                        <td className="border border-border p-3">64</td>
                        <td className="border border-border p-3">90</td>
                        <td className="border border-border p-3">81</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">S</td>
                        <td className="border border-border p-3">8</td>
                        <td className="border border-border p-3">68</td>
                        <td className="border border-border p-3">94</td>
                        <td className="border border-border p-3">81</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">M</td>
                        <td className="border border-border p-3">10</td>
                        <td className="border border-border p-3">72</td>
                        <td className="border border-border p-3">98</td>
                        <td className="border border-border p-3">81</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="border border-border p-3 font-medium">L</td>
                        <td className="border border-border p-3">12</td>
                        <td className="border border-border p-3">76</td>
                        <td className="border border-border p-3">102</td>
                        <td className="border border-border p-3">81</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3 font-medium">XL</td>
                        <td className="border border-border p-3">14</td>
                        <td className="border border-border p-3">80</td>
                        <td className="border border-border p-3">106</td>
                        <td className="border border-border p-3">81</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Accessories Section */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Belt Size Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-left font-semibold">Size</th>
                          <th className="border border-border p-3 text-left font-semibold">Waist (cm)</th>
                          <th className="border border-border p-3 text-left font-semibold">Belt Length (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-border p-3 font-medium">S</td>
                          <td className="border border-border p-3">60-70</td>
                          <td className="border border-border p-3">85</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border p-3 font-medium">M</td>
                          <td className="border border-border p-3">70-80</td>
                          <td className="border border-border p-3">95</td>
                        </tr>
                        <tr>
                          <td className="border border-border p-3 font-medium">L</td>
                          <td className="border border-border p-3">80-90</td>
                          <td className="border border-border p-3">105</td>
                        </tr>
                        <tr className="bg-muted/50">
                          <td className="border border-border p-3 font-medium">XL</td>
                          <td className="border border-border p-3">90-100</td>
                          <td className="border border-border p-3">115</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jewelry & Watches</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Necklace Lengths</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>Choker: 35-40cm</li>
                      <li>Princess: 45-50cm</li>
                      <li>Matinee: 55-60cm</li>
                      <li>Opera: 75-90cm</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Watch Sizes</h4>
                    <p className="text-sm text-muted-foreground">
                      Our watches feature adjustable straps to fit wrist sizes from 14cm to 20cm comfortably.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Fit Tips */}
        <Card className="mt-16">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <HelpCircle className="h-5 w-5" />
              <span>Professional Fit Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Perfect Suit Fit</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Blazer should close comfortably without pulling</li>
                  <li>• Sleeves should end at your wrist bone</li>
                  <li>• Shoulder seam should align with your shoulder</li>
                  <li>• Blazer length should cover your seat</li>
                  <li>• No visible pulling across the back or chest</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Measuring Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use a soft measuring tape</li>
                  <li>• Wear well-fitting undergarments</li>
                  <li>• Keep the tape snug but not tight</li>
                  <li>• Have someone help for accurate measurements</li>
                  <li>• Measure over lightweight clothing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4">Still Need Help?</h3>
          <p className="text-muted-foreground mb-6">
            Our fit specialists are here to help you find the perfect size.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Fit Specialist</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/returns">Return Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}