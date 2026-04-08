import { motion } from "framer-motion";
import { Sparkles, Award, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      aria-labelledby="hero-heading"
    >
      {/* Background gradients - Exact Lovable match */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-radial-grid opacity-50" />

      {/* Ambient glow blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-lime/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-lime/15 rounded-full blur-3xl animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-lime/15 rounded-squircle px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                100% Natural Sweeteners
              </span>
            </motion.div>

            {/* Main Heading - Exact color #113b23 via foreground variable */}
            <h1
              id="hero-heading"
              className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[0.9] tracking-tight mb-6"
            >
              Sweetness
              <br />
              <span className="text-gradient-forest">Without</span>
              <br />
              Sacrifice
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              Experience the pure taste of nature with Grevia's premium Stevia
              and Monkfruit. Zero calories, zero glycemic impact, endless
              flavor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center gap-2 font-bold bg-primary text-primary-foreground hover:bg-forest-light rounded-squircle-lg shadow-button hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-base h-16 px-10"
              >
                Shop Collection
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                to="/benefits"
                className="inline-flex items-center justify-center font-bold border-2 border-primary/30 bg-background/80 backdrop-blur-sm text-primary hover:border-primary hover:bg-primary/5 rounded-squircle-lg transition-all duration-300 text-base h-16 px-10"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right: Hero Image with Floating Badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Glow behind image */}
              <div className="absolute inset-0 bg-lime/20 rounded-squircle-xl blur-2xl transform scale-90" />

              {/* Image - NO border, NO padding, flush with container */}
              <div className="relative rounded-squircle-xl overflow-hidden shadow-card">
                <img
                  src="/build/assets/hero-bg-D-TWzogc.jpg"
                  alt="Grevia premium stevia and monkfruit organic sweetener products"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Badge: Zero Glycemic (top-left) */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bg-background/90 backdrop-blur-md rounded-squircle-lg shadow-card px-4 py-3 flex items-center gap-2 top-4 -left-4 lg:-left-8 animate-float"
              >
                <div className="w-8 h-8 bg-lime/20 rounded-squircle flex items-center justify-center">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Zero Glycemic
                </span>
              </motion.div>

              {/* Floating Badge: Keto Friendly (bottom-right) */}
              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bg-background/90 backdrop-blur-md rounded-squircle-lg shadow-card px-4 py-3 flex items-center gap-2 bottom-20 -right-4 lg:-right-8 animate-float animation-delay-2000"
              >
                <div className="w-8 h-8 bg-lime/20 rounded-squircle flex items-center justify-center">
                  <Heart className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  Keto Friendly
                </span>
              </motion.div>

              {/* Floating Badge: 100% Pure (bottom-left) */}
              <motion.div
                animate={{ y: [-4, 6, -4] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bg-background/90 backdrop-blur-md rounded-squircle-lg shadow-card px-4 py-3 flex items-center gap-2 -bottom-4 left-8 animate-float animation-delay-4000"
              >
                <div className="w-8 h-8 bg-lime/20 rounded-squircle flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground">
                  100% Pure
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
