import { Zap, Sparkles, AlertTriangle, Target } from "lucide-react";

const Solution = () => {
  const solutions = [
    {
      icon: Zap,
      title: "Ghost Recovery",
      description: "Automated 'nudge' signals drag users back the second they stagnate.",
    },
    {
      icon: Sparkles,
      title: "Zero-Thinking AI",
      description: "The AI Forge builds your entire blueprint in seconds. No thinking required.",
    },
    {
      icon: AlertTriangle,
      title: "Friction Detection",
      description: "See the exact step where your revenue is leaking and fix it instantly.",
    },
    {
      icon: Target,
      title: "One Version of Truth",
      description: "No more guessing. Every user accounted for in one central workspace.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center">
            The Activation Arsenal
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
                  <solution.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {solution.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
