import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Mail, Shield, Users, Zap } from "lucide-react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">About Onboardly</h1>
            <p className="text-lg text-muted-foreground">
              Professional user onboarding and activation for modern software teams
            </p>
            <Link to="/dashboard">
              <Button variant="accent" className="mt-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Onboardly exists to solve a fundamental problem in software: the gap between user signup and activation. 
              We provide engineering teams with the tools to understand exactly where users drop off in their onboarding journey 
              and the data-driven insights needed to fix those friction points.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that great software deserves great onboarding. Our platform is built by engineers who have 
              experienced the pain of watching users sign up, explore briefly, and disappear. We're committed to changing that reality.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-accent" />
                  User Activation Analytics
                </h3>
                <p className="text-muted-foreground">
                  Real-time visibility into your user activation funnel. See exactly where users drop off, 
                  which steps are failing, and what's causing friction in your onboarding process.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-accent" />
                  Checklist-Driven Workflows
                </h3>
                <p className="text-muted-foreground">
                  Define what activation means for your product, create step-by-step onboarding flows, 
                  and track progress automatically. No more guessing about user activation status.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-accent" />
                  Developer-First Integration
                </h3>
                <p className="text-muted-foreground">
                  Drop-in JavaScript snippet, React/Next.js support, and no heavy SDKs. 
                  Get up and running in minutes without compromising your codebase.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-accent" />
                  Real-Time Insights
                </h3>
                <p className="text-muted-foreground">
                  Live dashboard showing activation rates, failing steps, and user segments. 
                  Make data-driven decisions about your onboarding strategy.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                Onboardly was born from frustration. As engineers building SaaS products, we repeatedly faced the same challenge: 
                users would sign up, explore briefly, and never reach their "aha moment." Traditional analytics told us what happened, 
                but not why it happened or how to fix it.
              </p>
              <p className="text-lg leading-relaxed">
                We tried existing solutions - complex analytics platforms, user onboarding tools, product tour systems - but they all 
                missed the point. They were designed for marketers, not for engineers who understand that activation is a technical problem 
                requiring a technical solution.
              </p>
              <p className="text-lg leading-relaxed">
                So we built Onboardly. A platform that speaks the language of engineers: precise, data-driven, and focused on the one metric 
                that matters - activation rate. No fluff, no marketing buzzwords, just tools that help you get users from signup to value.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Onboardly helps software teams of all sizes understand their user activation challenges and 
                implement data-driven solutions. We're proud to be the tool that engineers turn to when they need to fix their 
                onboarding problems.
              </p>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Team</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We're a distributed team of engineers and product builders who are passionate about user activation. 
              Our team has experience building and scaling products at companies ranging from early-stage startups to 
              enterprise organizations.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe in building tools that we would want to use ourselves. That means focusing on developer experience, 
              data accuracy, and solving real problems rather than chasing features.
            </p>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions about Onboardly? Want to see how we can help improve your activation rates? 
              We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Try Onboardly
                </Button>
              </Link>
              <a href="mailto:hello@onboardly.app">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Email Us
                </Button>
              </a>
            </div>
          </section>
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
              <a 
                href="https://github.com/00xf5/onboardly" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/onboardly" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
