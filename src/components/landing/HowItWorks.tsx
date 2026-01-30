const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Define your activation checklist",
      description: "What does it mean for a user to be activated? Define the steps that matter.",
    },
    {
      number: "2",
      title: "Trigger onboarding contextually",
      description: "Show help when users need it, not when they don't.",
    },
    {
      number: "3",
      title: "See where users fail — fix it",
      description: "Get real data on where users drop off and what to fix.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center">
            How it works
          </h2>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-8 items-center">
                <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xl text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center text-muted-foreground mt-16 text-lg">
            That's it. If it takes more steps, your product is lying.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
