import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Heart, Check } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const FloatingBadge = ({
  icon: Icon,
  text,
  delay,
  className,
}: {
  icon: React.ElementType;
  text: string;
  delay: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className={`absolute bg-white/95 backdrop-blur-md rounded-2xl shadow-card px-5 py-4 flex items-center gap-3 border border-primary/5 z-20 ${className}`}
  >
    <div className="w-9 h-9 bg-secondary rounded-xl flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] leading-none">{text}</span>
  </motion.div>
);

interface BannerData {
  title: string;
  badge_text?: string;
  description?: string;
  image_url?: string;
  primary_button_text?: string;
  primary_button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  features?: { text: string; icon: string }[];
}

const HeroSection = () => {
  const [banner, setBanner] = useState<BannerData | null>(null);

  useEffect(() => {
    api.get('/content/hero-banner')
      .then(res => {
        if (res) setBanner(res);
      })
      .catch(err => console.error("Failed to fetch hero banner", err));
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return Sparkles;
      case 'Award': return Award;
      case 'Heart': return Heart;
      default: return Check;
    }
  };

const titleText = banner?.title || "Sweetness <span class='text-accent-green'>Without</span> Sacrifice";

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex items-center bg-page overflow-hidden pt-32 pb-20">
      {/* Soft natural elements */}
      <div className="absolute top-0 right-0 w-[60%] h-full bg-mint-soft rounded-l-[100px] -z-10 translate-x-[10%] hidden lg:block" />
      <div className="absolute top-20 right-40 w-4 h-4 bg-accent-green/20 rounded-full blur-xl" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl px-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <span className="text-primary font-black tracking-[0.2em] text-[10px] uppercase">
                {banner?.badge_text || "100% Natural Sweeteners"}
              </span>
            </motion.div>
            
            <h1 
              className="text-6xl md:text-8xl lg:text-[100px] leading-[0.85] font-black uppercase tracking-tighter text-primary mb-10"
              dangerouslySetInnerHTML={{ __html: titleText }}
            />
            
            <p className="text-lg md:text-xl text-text-muted mb-12 leading-relaxed font-medium max-w-xl">
              {banner?.description || "Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor."}
            </p>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <Link to={banner?.primary_button_link || "/collection"}>
                <Button className="bg-primary hover:bg-primary/95 text-white rounded-2xl px-10 py-8 text-lg font-black uppercase tracking-widest shadow-button transition-transform hover:scale-105 active:scale-95">
                  {banner?.primary_button_text || "Shop Collection"}
                </Button>
              </Link>
              <Link to={banner?.secondary_button_link || "/benefits"}>
                <Button variant="outline" className="border-border hover:bg-secondary text-primary rounded-2xl px-10 py-8 text-lg font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95">
                  {banner?.secondary_button_text || "Learn More"}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right: Interactive Image & Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center relative px-4"
          >
            <div className="relative group">
              {/* Product Background Blob */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-secondary rounded-[60px] -rotate-6 scale-95 group-hover:bg-mint transition-colors duration-700" 
              />
              
              <img 
                src={banner?.image_url || heroBg} 
                alt="Grevia Premium Sweeteners" 
                className="relative h-auto max-w-full lg:max-w-[500px] drop-shadow-2xl hover:scale-105 transition-transform duration-700 z-10" 
              />

              {/* Floating feature badges - Exactly as reference */}
              <FloatingBadge 
                icon={Award} 
                text="Zero Glycemic" 
                delay={0.6} 
                className="-top-8 -left-12 hidden sm:flex" 
              />
              <FloatingBadge 
                icon={Heart} 
                text="Keto Friendly" 
                delay={0.8} 
                className="top-1/2 -right-16 translate-y-12 hidden sm:flex" 
              />
              <FloatingBadge 
                icon={Sparkles} 
                text="100% Pure" 
                delay={1.0} 
                className="-bottom-10 left-12 hidden sm:flex" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
