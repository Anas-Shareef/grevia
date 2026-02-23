import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import BenefitsSection from "@/components/BenefitsSection";
import IngredientsSection from "@/components/IngredientsSection";
import ProductsSection from "@/components/ProductsSection";
import BeyondSweetenersSection from "@/components/BeyondSweetenersSection";
import ConversionBanner from "@/components/ConversionBanner";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        {!user && (
          <>
            <BenefitsSection />
            <IngredientsSection />
          </>
        )}
        <ProductsSection />
        <BeyondSweetenersSection />
        <ConversionBanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
