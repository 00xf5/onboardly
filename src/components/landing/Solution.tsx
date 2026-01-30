import { CheckSquare, Target, AlertTriangle, Monitor } from "lucide-react";

const Solution = () => {
  const solutions = [
    {
      icon: CheckSquare,
      title: "Checklist-Driven Activation",
      description: "Activation is defined, tracked, and enforced.",
    },
    {
      icon: Target,
      title: "Contextual Onboarding",
      description: "Tooltips appear only when they matter.",
    },
    {
      icon: AlertTriangle,
      title: "Failing Step Detection",
      description: "See exactly where users quit.",
    },
    {
      icon: Monitor,
      title: "Single-Screen Dashboard",
      description: "One place to understand activation health.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center">
            What Onboardly actually does
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
