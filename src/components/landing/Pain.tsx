const Pain = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-12 leading-tight">
            Most products don't fail.
            <br />
            Users just never reach the aha moment.
          </h2>
          
          <div className="space-y-6 text-left max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                Users sign up and disappear
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                You don't know which step broke them
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                Analytics tell you what happened, not what to fix
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                CAPTCHAs, tours, and emails don't solve activation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pain;
