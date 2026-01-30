import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="section-padding bg-primary">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Ready to streamline your onboarding?
          </h2>

          <p className="text-lg text-primary-foreground/70 max-w-xl mx-auto mb-10">
            Join hundreds of freelancers and agencies who save hours every week with Onboardly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="hero" size="xl" className="group min-w-[200px]">
                Start free trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/50">
            No credit card required • Free plan available
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
