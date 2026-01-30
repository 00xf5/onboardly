const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create your template",
      description: "Build your onboarding workflow with tasks, forms, and email templates. Customize everything to match your brand.",
    },
    {
      number: "02",
      title: "Share with clients",
      description: "Send a personalized link or embed the form on your website. Clients complete it in minutes.",
    },
    {
      number: "03",
      title: "Automate & track",
      description: "Emails send automatically. Track progress, get reminders, and see everything in your dashboard.",
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-secondary/50">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            How it works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
            Get started in minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            From setup to automated onboarding — it's that simple.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-border" />
          
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center lg:text-left">
                {/* Step number */}
                <div className="inline-flex lg:flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-display font-bold text-lg mb-6 relative z-10">
                  {step.number}
                </div>
                
                <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mx-0">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
