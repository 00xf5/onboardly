import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Message */}
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Your users signed up.
              <br />
              <span className="text-accent">They never activated.</span>
              <br />
              Fix that.
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Onboardly is a checklist-driven onboarding and activation engine that shows you exactly where users drop off — and what to fix.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button variant="accent" size="lg" className="text-base px-8 py-3 min-w-[160px]">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-base px-8 py-3 min-w-[160px]">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Right Side - Dashboard Mock */}
          <div className="relative">
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full h-6 bg-muted rounded" />
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6 bg-gradient-to-b from-muted/10 to-muted/5">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">42%</div>
                    <div className="text-sm text-muted-foreground">Activation Rate</div>
                    <div className="text-xs text-red-400 mt-1">↓ 12% this week</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">68%</div>
                    <div className="text-sm text-muted-foreground">Drop-off Step 3</div>
                    <div className="text-xs text-yellow-400 mt-1">Critical</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-2xl font-bold text-foreground">127</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                    <div className="text-xs text-green-400 mt-1">↑ 8% today</div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-sm font-medium text-foreground mb-3">Failing Steps</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Step 3: Connect API</span>
                      <span className="text-sm text-red-400">68% fail</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Step 5: Import Data</span>
                      <span className="text-sm text-yellow-400">42% fail</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Step 7: Complete Setup</span>
                      <span className="text-sm text-yellow-400">31% fail</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
