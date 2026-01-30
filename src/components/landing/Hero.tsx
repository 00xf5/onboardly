import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/5 rounded-full blur-[100px]" />

      <div className="container relative z-10 mx-auto py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Automate your client onboarding
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
            Client onboarding,{" "}
            <span className="text-gradient">simplified</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Create beautiful onboarding workflows, send automated emails, and track progress — all from one intuitive dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group min-w-[200px]">
                Get started free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="xl" className="min-w-[200px]">
                View demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground mt-1">Active users</p>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">10k+</p>
              <p className="text-sm text-muted-foreground mt-1">Clients onboarded</p>
            </div>
            <div className="hidden sm:block w-px bg-border" />
            <div>
              <p className="text-3xl sm:text-4xl font-display font-bold text-foreground">98%</p>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction rate</p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="relative">
            {/* Browser mockup */}
            <div className="bg-card border border-border rounded-2xl shadow-float overflow-hidden">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                  <div className="w-3 h-3 rounded-full bg-border" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full max-w-md mx-auto h-7 bg-muted rounded-md" />
                </div>
              </div>
              {/* Dashboard preview content */}
              <div className="p-6 bg-gradient-to-b from-muted/20 to-muted/5">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4">
                      <div className="w-10 h-10 rounded-lg bg-muted mb-3" />
                      <div className="h-6 w-16 bg-muted rounded mb-2" />
                      <div className="h-4 w-24 bg-muted/60 rounded" />
                    </div>
                  ))}
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-32 bg-muted rounded" />
                    <div className="h-8 w-24 bg-muted rounded-lg" />
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                        <div className="w-10 h-10 rounded-full bg-muted" />
                        <div className="flex-1">
                          <div className="h-4 w-32 bg-muted rounded mb-2" />
                          <div className="h-3 w-48 bg-muted/60 rounded" />
                        </div>
                        <div className="h-2 w-24 bg-accent/30 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 -right-4 h-32 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
