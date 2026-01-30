import { 
  FileText, 
  Mail, 
  CheckSquare, 
  BarChart3, 
  Clock,
  Shield
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Custom templates",
      description: "Build reusable onboarding workflows with drag-and-drop simplicity.",
    },
    {
      icon: Mail,
      title: "Automated emails",
      description: "Send personalized welcome emails and reminders automatically.",
    },
    {
      icon: CheckSquare,
      title: "Task tracking",
      description: "Assign tasks and monitor client progress in real-time.",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Get insights into completion rates and onboarding efficiency.",
    },
    {
      icon: Clock,
      title: "Smart reminders",
      description: "Automated follow-ups keep clients on track without manual work.",
    },
    {
      icon: Shield,
      title: "Secure & private",
      description: "Enterprise-grade security for all your client data.",
    },
  ];

  return (
    <section id="features" className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-sm font-semibold text-accent uppercase tracking-widest">
            Features
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground mt-4 mb-6 leading-tight">
            Everything you need to onboard clients
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful tools designed to save hours of manual work and deliver a seamless experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-soft"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-6 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="w-7 h-7 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
