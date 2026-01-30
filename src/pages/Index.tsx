import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Pain from "@/components/landing/Pain";
import Solution from "@/components/landing/Solution";
import DashboardShowcase from "@/components/landing/DashboardShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import TargetAudience from "@/components/landing/TargetAudience";
import TechConfidence from "@/components/landing/TechConfidence";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        <Hero />
        <Pain />
        <Solution />
        <DashboardShowcase />
        <HowItWorks />
        <TargetAudience />
        <TechConfidence />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
};

export default Index;
