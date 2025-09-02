import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="font-serif text-4xl lg:text-5xl font-bold text-foreground">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Privacy Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                At Omaima, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, share, and protect information about you when you use our 
                website, mobile applications, and services.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Secure Data</h4>
                  <p className="text-sm text-muted-foreground">Your information is encrypted and protected</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">No Selling</h4>
                  <p className="text-sm text-muted-foreground">We never sell your personal data to third parties</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Your Control</h4>
                  <p className="text-sm text-muted-foreground">You can access, update, or delete your data anytime</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Information You Provide to Us</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Account Information:</strong> Name, email address, phone number, and account preferences</li>
                  <li>• <strong>Profile Information:</strong> Size preferences, style preferences, and professional needs</li>
                  <li>• <strong>Payment Information:</strong> Billing address, shipping address, and payment method details</li>
                  <li>• <strong>Order Information:</strong> Purchase history, returns, and communication with customer service</li>
                  <li>• <strong>Communication:</strong> Messages you send us, reviews, and feedback</li>
                  <li>• <strong>Custom Orders:</strong> Measurements, style preferences, and special requirements</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Information We Collect Automatically</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Usage Data:</strong> Pages visited, time spent, search queries, and interaction patterns</li>
                  <li>• <strong>Device Information:</strong> Device type, operating system, browser type, and IP address</li>
                  <li>• <strong>Location Data:</strong> General location based on IP address for shipping and taxation</li>
                  <li>• <strong>Cookies and Tracking:</strong> Website functionality, preferences, and analytics data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Information from Third Parties</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Social Media:</strong> Profile information if you connect social media accounts</li>
                  <li>• <strong>Payment Processors:</strong> Transaction data and fraud prevention information</li>
                  <li>• <strong>Marketing Partners:</strong> Demographic and interest data for targeted advertising</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Core Services</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Process and fulfill your orders</li>
                    <li>• Provide customer support and assistance</li>
                    <li>• Manage your account and preferences</li>
                    <li>• Process payments and prevent fraud</li>
                    <li>• Handle returns and exchanges</li>
                    <li>• Deliver products to your address</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Improvements & Marketing</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Personalize your shopping experience</li>
                    <li>• Send you promotional offers and updates</li>
                    <li>• Improve our website and services</li>
                    <li>• Conduct market research and analytics</li>
                    <li>• Recommend products based on your preferences</li>
                    <li>• Communicate about new collections and sales</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>3. How We Share Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
                <h4 className="font-semibold text-red-800 mb-2">We Do Not Sell Your Data</h4>
                <p className="text-sm text-red-700">
                  We never sell, rent, or trade your personal information to third parties for their marketing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">When We Share Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Service Providers</h4>
                    <p className="text-sm text-muted-foreground">
                      We share information with trusted partners who help us operate our business, such as payment processors, 
                      shipping companies, and customer service platforms.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Legal Requirements</h4>
                    <p className="text-sm text-muted-foreground">
                      We may disclose information when required by law, to enforce our terms, or to protect our rights, 
                      property, or safety.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Business Transfers</h4>
                    <p className="text-sm text-muted-foreground">
                      In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                      as part of the business transaction.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">With Your Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      We may share information for other purposes with your explicit consent or at your direction.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>4. Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• SSL encryption for data transmission</li>
                    <li>• Secure cloud storage with encryption</li>
                    <li>• Regular security audits and testing</li>
                    <li>• Access controls and authentication</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Operational Safeguards</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Employee training on data protection</li>
                    <li>• Limited access to personal data</li>
                    <li>• Regular backup and recovery procedures</li>
                    <li>• Incident response protocols</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>5. Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Access Your Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Request a copy of the personal information we have about you.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Update Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Correct or update your personal information in your account settings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Delete Your Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Request deletion of your personal information, subject to legal requirements.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Opt-Out of Marketing</h4>
                    <p className="text-sm text-muted-foreground">
                      Unsubscribe from promotional emails and marketing communications.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Data Portability</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive your data in a structured, machine-readable format.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Restrict Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Limit how we use your information in certain circumstances.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies and Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>6. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                and for advertising purposes.
              </p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Types of Cookies We Use</h4>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h5 className="font-medium">Essential Cookies</h5>
                      <p className="text-sm text-muted-foreground">Required for basic website functionality</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Analytics Cookies</h5>
                      <p className="text-sm text-muted-foreground">Help us understand how you use our site</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Marketing Cookies</h5>
                      <p className="text-sm text-muted-foreground">Used to deliver relevant advertisements</p>
                    </div>
                    <div>
                      <h5 className="font-medium">Preference Cookies</h5>
                      <p className="text-sm text-muted-foreground">Remember your settings and preferences</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Users */}
          <Card>
            <CardHeader>
              <CardTitle>7. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you are located outside of our primary operating region, your information may be transferred to 
                and processed in countries with different data protection laws. We ensure appropriate safeguards 
                are in place to protect your information.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Standard contractual clauses for EU data transfers</li>
                <li>• Adequacy decisions where applicable</li>
                <li>• Additional safeguards for sensitive information</li>
                <li>• Compliance with local data protection laws</li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information from 
                a child under 13, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>9. Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time to reflect changes in our practices or 
                for legal, operational, or regulatory reasons. We will notify you of any material changes 
                by posting the new policy on our website and updating the "Last Updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>10. Contact Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Privacy Officer</h4>
                  <p className="text-sm text-muted-foreground">
                    Email: privacy@omaima.com<br />
                    Phone: +1 (555) 123-4567<br />
                    Hours: Monday-Friday, 9 AM - 6 PM EST
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mailing Address</h4>
                  <p className="text-sm text-muted-foreground">
                    Omaima Privacy Department<br />
                    123 Fashion District<br />
                    New York, NY 10001<br />
                    United States
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link href="/contact">Contact Privacy Team</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/terms">Terms of Service</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}