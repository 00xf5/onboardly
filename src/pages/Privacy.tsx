import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <Link to="/dashboard">
              <Button variant="outline" className="mt-6">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
              <p className="text-muted-foreground">
                Onboardly ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we 
                collect, use, share, and protect your information when you use our user onboarding and activation platform.
              </p>
              <p className="text-muted-foreground">
                By using Onboardly, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">1. Account Information</h3>
                  <p className="text-muted-foreground">
                    When you create an account, we collect:
                  </p>
                  <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                    <li>Name and email address</li>
                    <li>Company name (if provided)</li>
                    <li>Password (encrypted and securely stored)</li>
                    <li>Account preferences and settings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">2. Usage Data</h3>
                  <p className="text-muted-foreground">
                    We automatically collect information about your use of our service:
                  </p>
                  <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                    <li>Pages visited and time spent on pages</li>
                    <li>Features used and interactions</li>
                    <li>Performance and error data</li>
                    <li>Device and browser information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">3. Client Data</h3>
                  <p className="text-muted-foreground">
                    Information you provide about your clients and users:
                  </p>
                  <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                    <li>Client names and email addresses</li>
                    <li>Onboarding progress and status</li>
                    <li>Task completion data</li>
                    <li>Custom workflow configurations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use your information to:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>Provide and maintain our service</li>
                <li>Process transactions and send related information</li>
                <li>Communicate with you about your account</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Detect, prevent, and address technical issues</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your information:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>SSL/TLS encryption for data in transit</li>
                <li>Encryption at rest for sensitive data</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Secure data centers and infrastructure</li>
              </ul>
              <p className="text-muted-foreground">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your data, 
                we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data Retention</h2>
              <p className="text-muted-foreground mb-4">
                We retain your information for as long as necessary to:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>Fulfill the purposes for which it was collected</li>
                <li>Comply with legal, regulatory, or accounting requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="text-muted-foreground">
                When you delete your account, we will delete or anonymize your personal information within 30 days, 
                except where we are required by law to retain certain data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Third-Party Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Service Providers</h3>
                  <p className="text-muted-foreground">
                    We use third-party service providers to help operate our service:
                  </p>
                  <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                    <li>Firebase for database and authentication</li>
                    <li>SendGrid for email delivery</li>
                    <li>NowPayments for payment processing</li>
                    <li>Vercel for hosting and infrastructure</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Analytics and Monitoring</h3>
                  <p className="text-muted-foreground">
                    We may use analytics tools to understand how our service is used. These tools may collect information 
                    about your interactions with our service.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
              </ul>
              <p className="text-muted-foreground">
                To exercise these rights, please contact us at hello@onboardly.app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>Remember your preferences and settings</li>
                <li>Authenticate your access to our service</li>
                <li>Analyze service usage and performance</li>
                <li>Provide personalized content and features</li>
              </ul>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings, but disabling cookies may affect your ability 
                to use certain features of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your own. We ensure that 
                appropriate safeguards are in place to protect your information in accordance with applicable data 
                protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If we become aware that we have collected personal information from 
                a child under 13, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
                new policy on this page and updating the "Last updated" date. Changes become effective immediately upon posting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>Email: hello@onboardly.app</li>
                <li>Website: https://onboardly.app</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 Onboardly. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <span className="text-sm text-muted-foreground">
                •
              </span>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
