import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
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
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using Onboardly ("the Service"), you accept and agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-4">
                Onboardly is a user onboarding and activation platform that helps software teams:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>Define and track user activation checklists</li>
                <li>Create and manage onboarding workflows</li>
                <li>Analyze user behavior and drop-off points</li>
                <li>Send automated emails and notifications</li>
                <li>Monitor activation rates and funnel performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">3.1 Account Creation</h3>
                  <p className="text-muted-foreground">
                    You must provide accurate information when creating an account. You are responsible for maintaining the 
                    confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">3.2 Account Security</h3>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the security of your account. Onboardly cannot be held responsible for 
                    unauthorized access to your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">3.3 Account Termination</h3>
                  <p className="text-muted-foreground">
                    You may terminate your account at any time by contacting us at hello@onboardly.app. Upon termination, 
                    your access to the Service will be disabled.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Acceptable Use</h2>
              <p className="text-muted-foreground mb-4">
                You may use Onboardly for legitimate business purposes only. You agree not to:
              </p>
              <ul className="text-muted-foreground list-disc list-inside space-y-2 ml-6">
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the Service to transmit malicious code or content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Data and Privacy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">5.1 Data Collection</h3>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, such as when you create an account or use our services. 
                    We also collect data automatically through your use of the Service.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">5.2 Data Usage</h3>
                  <p className="text-muted-foreground">
                    We use your data to provide, maintain, and improve our services. We may also use your data to 
                    communicate with you, analyze usage patterns, and develop new features.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">5.3 Data Security</h3>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal data against 
                    unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are and will remain the exclusive 
                property of Onboardly and its licensors. The Service is protected by copyright, trademark, and other 
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">7. Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. 
                The Service may be temporarily unavailable for maintenance, updates, or other reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">8. Disclaimers</h2>
              <p className="text-muted-foreground">
                The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that 
                the Service will meet your specific requirements or expectations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, Onboardly shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">10. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about these Terms, please contact us at:
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

export default Terms;
