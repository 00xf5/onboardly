const DashboardShowcase = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-center">
            One screen. One truth.
          </h2>
          
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full h-6 bg-muted rounded" />
                </div>
              </div>
              
              {/* Dashboard Screenshot */}
              <div className="relative">
                <img 
                  src="/api/placeholder/1200/800" 
                  alt="Onboardly Dashboard"
                  className="w-full h-auto"
                />
                
                {/* Callouts */}
                <div className="absolute top-20 left-8 bg-accent text-white px-3 py-1 rounded text-sm font-medium">
                  Activation rate
                </div>
                
                <div className="absolute top-40 right-8 bg-accent text-white px-3 py-1 rounded text-sm font-medium">
                  Funnel drop-off
                </div>
                
                <div className="absolute bottom-32 left-12 bg-accent text-white px-3 py-1 rounded text-sm font-medium">
                  Failing steps
                </div>
                
                <div className="absolute bottom-20 right-12 bg-accent text-white px-3 py-1 rounded text-sm font-medium">
                  Live events feed
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground mt-12 text-lg">
            Yeah… I'd check this every morning.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
