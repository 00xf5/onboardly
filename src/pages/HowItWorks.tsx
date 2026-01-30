import { Link } from "react-router-dom";
import { ArrowLeft, Play, CheckCircle2, ArrowRight, Users, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Sign Up & Configure",
      description: "Create your account and set up your organization profile in minutes.",
      icon: <Users className="w-6 h-6" />
    },
    {
      number: "2", 
      title: "Design Onboarding Flow",
      description: "Use our visual flow editor to create custom onboarding experiences for different partner types.",
      icon: <Settings className="w-6 h-6" />
    },
    {
      number: "3",
      title: "Invite Partners",
      description: "Send personalized invitations to your partners with just a few clicks.",
      icon: <Play className="w-6 h-6" />
    },
    {
      number: "4",
      title: "Track Progress",
      description: "Monitor onboarding completion rates and identify areas for improvement.",
      icon: <BarChart3 className="w-6 h-6" />
    }
  ];

  const benefits = [
    "Reduce onboarding time by 70%",
    "Increase partner satisfaction",
    "Automate repetitive tasks", 
    "Get real-time insights",
    "Scale without additional resources",
    "Maintain brand consistency"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How Onboardly
              <span className="text-accent"> Works</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your partners up and running in 4 simple steps. No technical expertise required.
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="w-6 h-6 text-accent ml-4" />
                    </div>
                  )}
                  <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-4">
                      {step.icon}
                    </div>
                    <div className="text-2xl font-bold text-accent mb-2">{step.number}</div>
                    <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-muted/50 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Why Teams Choose Onboardly</h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your onboarding?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of companies that have transformed their partner onboarding process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="accent" size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default HowItWorks;
