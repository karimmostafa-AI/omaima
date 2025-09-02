import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Scale, Shield, AlertTriangle, Users, Mail } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Terms of Service
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our website or services.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Agreement Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5" />
                <span>Agreement Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                These Terms of Service ("Terms") govern your use of the Omaima website, mobile applications, 
                and services (collectively, the "Services"). By accessing or using our Services, you agree 
                to be bound by these Terms.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Important Notice</h4>
                    <p className="text-sm text-amber-700">
                      If you do not agree to these Terms, you may not access or use our Services. 
                      Please read them carefully before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                By using our Services, you confirm that:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• You are at least 18 years old or have parental/guardian consent</li>
                <li>• You have the legal capacity to enter into these Terms</li>
                <li>• You will comply with all applicable laws and regulations</li>
                <li>• You will use our Services only for lawful purposes</li>
                <li>• All information you provide is accurate and current</li>
              </ul>
            </CardContent>
          </Card>

          {/* Use of Services */}
          <Card>
            <CardHeader>
              <CardTitle>2. Use of Our Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Permitted Uses</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Browse and purchase products for personal or business use</li>
                  <li>• Create an account to manage orders and preferences</li>
                  <li>• Contact customer service for support</li>
                  <li>• Leave reviews and feedback on products</li>
                  <li>• Use size guides and fit assistance tools</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Prohibited Uses</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Violate any applicable laws or regulations</li>
                  <li>• Infringe on intellectual property rights</li>
                  <li>• Use automated systems to access our Services</li>
                  <li>• Attempt to gain unauthorized access to our systems</li>
                  <li>• Post false, misleading, or inappropriate content</li>
                  <li>• Interfere with other users' use of our Services</li>
                  <li>• Resell products for commercial purposes without authorization</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Account Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>3. Account Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Security</h3>
                <p className="text-muted-foreground mb-3">
                  You are responsible for maintaining the confidentiality of your account credentials and 
                  for all activities that occur under your account.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Choose a strong, unique password</li>
                  <li>• Do not share your account credentials</li>
                  <li>• Notify us immediately of any unauthorized use</li>
                  <li>• Keep your contact information current</li>
                  <li>• Log out from shared devices</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Account Termination</h3>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to suspend or terminate your account if you violate these Terms. 
                  You may also close your account at any time by contacting customer service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Orders and Payments */}
          <Card>
            <CardHeader>
              <CardTitle>4. Orders and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Process</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• All orders are subject to acceptance and availability</li>
                  <li>• We reserve the right to refuse or cancel orders</li>
                  <li>• Prices are subject to change without notice</li>
                  <li>• You will receive order confirmation via email</li>
                  <li>• Custom orders may have different terms and timelines</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Terms</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Payment is due at the time of order placement</li>
                  <li>• We accept major credit cards, PayPal, and other payment methods</li>
                  <li>• All payments are processed securely through encrypted channels</li>
                  <li>• You authorize us to charge your payment method for orders</li>
                  <li>• Additional fees may apply for international orders</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Pricing and Taxes</h3>
                <p className="text-sm text-muted-foreground">
                  All prices are listed in USD and exclude applicable taxes, duties, and shipping charges 
                  unless otherwise stated. Final pricing will be displayed at checkout.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping and Returns */}
          <Card>
            <CardHeader>
              <CardTitle>5. Shipping and Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Our shipping and return policies are detailed in separate documents. By placing an order, 
                you agree to these policies:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Shipping Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    Delivery timeframes, shipping costs, and international shipping terms.
                  </p>
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href="/shipping">View Shipping Policy</Link>
                  </Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Return Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    30-day return window, return process, and exchange options.
                  </p>
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href="/returns">View Return Policy</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>6. Intellectual Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Our Rights</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  All content on our Services, including but not limited to text, images, logos, designs, 
                  and software, is owned by Omaima or our licensors and is protected by intellectual property laws.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Trademarks: "Omaima" and related marks are our property</li>
                  <li>• Copyrights: All original content and designs</li>
                  <li>• Patents: Proprietary technologies and processes</li>
                  <li>• Trade secrets: Confidential business information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  You may use our Services for personal, non-commercial purposes. You may not reproduce, 
                  distribute, modify, or create derivative works without our written permission.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Content */}
          <Card>
            <CardHeader>
              <CardTitle>7. User-Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Content You Provide</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You may submit reviews, photos, comments, and other content. By submitting content, you grant us 
                  a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You retain ownership of your original content</li>
                  <li>• You warrant that your content does not infringe on others' rights</li>
                  <li>• We may remove content that violates our community guidelines</li>
                  <li>• You are responsible for the accuracy of your content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Content Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Content must be appropriate, accurate, and not violate any laws or rights. 
                  We reserve the right to moderate and remove content at our discretion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers and Limitations */}
          <Card>
            <CardHeader>
              <CardTitle>8. Disclaimers and Limitations of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Important Legal Notice</h4>
                <p className="text-sm text-red-700">
                  Our services are provided "as is" without warranties of any kind. 
                  Please read these limitations carefully as they may affect your legal rights.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Service Disclaimer</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• We do not guarantee uninterrupted or error-free service</li>
                  <li>• Product colors may vary due to display settings</li>
                  <li>• Sizing may vary between products and brands</li>
                  <li>• We are not responsible for third-party content or services</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Limitation of Liability</h3>
                <p className="text-sm text-muted-foreground">
                  To the fullest extent permitted by law, our liability for any damages arising from your use 
                  of our Services is limited to the amount you paid for the specific product or service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Indemnification */}
          <Card>
            <CardHeader>
              <CardTitle>9. Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Omaima, its officers, directors, employees, and agents 
                from any claims, damages, or expenses arising from your use of our Services or violation of these Terms.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card>
            <CardHeader>
              <CardTitle>10. Governing Law and Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Governing Law</h3>
                <p className="text-sm text-muted-foreground">
                  These Terms are governed by the laws of New York, United States, without regard to 
                  conflict of law provisions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Dispute Resolution</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We encourage you to contact us first to resolve any disputes. If we cannot resolve 
                  a dispute informally, disputes will be resolved through binding arbitration.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Arbitration will be conducted under AAA rules</li>
                  <li>• Arbitration will take place in New York, NY</li>
                  <li>• Class action waiver applies</li>
                  <li>• Right to jury trial is waived</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>11. Changes to These Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update these Terms from time to time. We will notify you of material changes by 
                posting the updated Terms on our website and updating the "Last Updated" date. 
                Your continued use of our Services after changes take effect constitutes acceptance of the new Terms.
              </p>
            </CardContent>
          </Card>

          {/* Severability */}
          <Card>
            <CardHeader>
              <CardTitle>12. Severability and Entire Agreement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If any provision of these Terms is found to be unenforceable, the remaining provisions 
                will remain in full force and effect. These Terms, along with our Privacy Policy and 
                other referenced policies, constitute the entire agreement between you and Omaima.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>13. Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Legal Department</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: legal@omaima.com<br />
                    Phone: +1 (555) 123-4567<br />
                    Hours: Monday-Friday, 9 AM - 6 PM EST
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    Omaima Legal Department<br />
                    123 Fashion District<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/contact">Contact Legal Team</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/privacy">Privacy Policy</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}