const TechConfidence = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-16">
            Dev-first by design.
          </h2>
          
          <div className="space-y-6 text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                Drop-in JS snippet
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                React / Next / Remix / Vite
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                No heavy SDK
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
              <p className="text-xl text-muted-foreground">
                No user-hostile tours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechConfidence;
