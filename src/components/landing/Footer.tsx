import { Link } from "react-router-dom";
import { Github, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-orange-500 p-1 flex items-center justify-center shadow-glow">
                <img
                  src="/assets/brand/logo.png"
                  alt="Onboardly"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-display font-black tracking-tight text-foreground uppercase italic">
                Onboardly{" "}
                <span className="text-accent underline decoration-accent/20">
                  Nexus
                </span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Professional user onboarding and activation for modern software teams.
              Turn signups into activated users with data-driven insights.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/00xf5/onboardly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/onboardly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#how-it-works" className="footer-link">How It Works</a></li>
              <li><a href="#pricing" className="footer-link">Pricing</a></li>
              <li><Link to="/dashboard" className="footer-link">Dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><a href="mailto:hello@onboardly.app" className="footer-link">Contact</a></li>
              <li><Link to="/terms" className="footer-link">Terms</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Onboardly. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/terms" className="footer-link">Terms</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
