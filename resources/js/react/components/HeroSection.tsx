import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Heart } from "lucide-react";
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
    className={`absolute bg-background/90 backdrop-blur-md rounded-squircle-lg shadow-card px-4 py-3 flex items-center gap-2 ${className}`}
  >
    <div className="w-8 h-8 bg-lime/20 rounded-squircle flex items-center justify-center">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <span className="text-sm font-bold text-foreground">{text}</span>
  </motion.div>
);

interface BannerData {
  title: string;
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
        if (res.data) setBanner(res.data);
      })
      .catch(err => console.error("Failed to fetch hero banner", err));
  }, []);

  // Icon mapping
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles': return Sparkles;
      case 'Award': return Award;
      case 'Heart': return Heart;
      default: return Sparkles;
    }
  };

  const titleHtml = banner?.title
    ? { __html: banner.title }
    : { __html: `Sweetness<br /><span class="text-gradient-forest">Without</span><br />Sacrifice` };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Background with organic blobs */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Radial grid pattern */}
      <div className="absolute inset-0 bg-radial-grid opacity-50" />

      {/* Animated blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-lime/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-lime/15 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-lime/15 rounded-squircle px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">100% Natural Sweeteners</span>
            </motion.div>

            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.9] tracking-tight mb-6"
              dangerouslySetInnerHTML={titleHtml}
            />

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              {banner?.description || "Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to={banner?.primary_button_link || "/collections/all"}>
                <Button variant="hero" size="xl">
                  {banner?.primary_button_text || "Shop Collection"}
                </Button>
              </Link>
              <Link to={banner?.secondary_button_link || "/benefits"}>
                <Button variant="heroOutline" size="xl">
                  {banner?.secondary_button_text || "Learn More"}
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-lime/20 rounded-squircle-xl blur-2xl transform scale-90" />

              {/* Main image container */}
              <div className="relative rounded-squircle-xl overflow-hidden shadow-card">
                <img
                  src={banner?.image_url || heroBg}
                  alt="Grevia premium stevia and monkfruit organic sweetener products"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dynamic Floating badges */}
              {banner?.features && banner.features.length > 0 ? (
                banner.features.map((feature, index) => {
                  // Determine position classes based on index to replicate original layout
                  let posClass = "";
                  if (index === 0) posClass = "top-4 -left-4 lg:-left-8 animate-float";
                  else if (index === 1) posClass = "bottom-20 -right-4 lg:-right-8 animate-float animation-delay-2000";
                  else if (index === 2) posClass = "-bottom-4 left-8 animate-float animation-delay-4000";

                  return (
                    <FloatingBadge
                      key={index}
                      icon={getIcon(feature.icon)}
                      text={feature.text}
                      delay={0.8 + (index * 0.2)}
                      className={posClass}
                    />
                  );
                })
              ) : (
                <>
                  <FloatingBadge
                    icon={Award}
                    text="Zero Glycemic"
                    delay={0.8}
                    className="top-4 -left-4 lg:-left-8 animate-float"
                  />
                  <FloatingBadge
                    icon={Heart}
                    text="Keto Friendly"
                    delay={1}
                    className="bottom-20 -right-4 lg:-right-8 animate-float animation-delay-2000"
                  />
                  <FloatingBadge
                    icon={Sparkles}
                    text="100% Pure"
                    delay={1.2}
                    className="-bottom-4 left-8 animate-float animation-delay-4000"
                  />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
