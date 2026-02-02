const Pain = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-12 leading-tight">
            Unfinished onboarding is a <span className="text-red-500">slow death</span> for your SaaS.
          </h2>

          <div className="space-y-6 text-left max-w-3xl mx-auto">
            <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl transition-all hover:border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                Users sign up, hit a wall, and disappear. You just paid to acquire a lead you'll never talk to again.
              </p>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl transition-all hover:border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                You’re flying blind. You don’t know which specific step is killing your activation rate.
              </p>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card border border-border rounded-2xl transition-all hover:border-red-500/30">
              <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                Unfinished setup = Churn. Churn = Death. You’re bleeding users and you don’t have a safety net.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pain;
