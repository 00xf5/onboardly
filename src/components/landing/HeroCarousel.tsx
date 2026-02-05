import React, { useState, useEffect } from "react";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
    alt: "Data visualization background",
  },
  {
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2340",
    alt: "Analytics dashboard background",
  },
  {
    url: "https://images.unsplash.com/photo-1454165833767-027ee217ce21?auto=format&fit=crop&q=80&w=2340",
    alt: "Workspace and software development",
  },
  {
    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2340",
    alt: "Modern office and technology",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-slate-900">
      {/* Premium dark gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-10" />
      
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <img
            src={slide.url}
            alt={slide.alt}
            className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${
              index === currentSlide ? "scale-110" : "scale-100"
            }`}
          />
        </div>
      ))}
      
      {/* Decorative glass elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] z-20" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px] z-20" />
    </div>
  );
};

export default HeroCarousel;
