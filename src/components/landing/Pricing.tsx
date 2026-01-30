import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "For getting started",
      features: [
        "1 onboarding template",
        "Up to 5 clients/month",
        "Basic email templates",
        "Task tracking",
      ],
      cta: "Get started",
      variant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$10",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Unlimited templates",
        "Unlimited clients",
        "Custom branding",
        "Scheduled reminders",
        "Analytics dashboard",
        "Priority support",
      ],
      cta: "Start free trial",
      variant: "accent" as const,
      popular: true,
    },
    {
      name: "Agency",
      price: "$49",
      period: "/month",
      description: "For teams & agencies",
      features: [
        "Everything in Pro",
        "White-label branding",
        "Team collaboration",
        "API access",
        "Dedicated support",
      ],
      cta: "Contact sales",
      variant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
            Simple, honest pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free and upgrade as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-primary text-primary-foreground border-primary shadow-float scale-[1.02]"
                  : "bg-card border-border hover:border-accent/30 hover:shadow-soft"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1.5 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className={`font-display text-xl font-semibold mb-2 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-5xl font-display font-bold ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-sm ${plan.popular ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? 'text-accent' : 'text-accent'}`} />
                    <span className={`text-sm ${plan.popular ? 'text-primary-foreground/90' : 'text-foreground'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to="/signup">
                <Button
                  variant={plan.popular ? "hero" : plan.variant}
                  className={`w-full ${plan.popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''}`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
