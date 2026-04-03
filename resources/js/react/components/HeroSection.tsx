import { motion } from "framer-motion";
import { Sparkles, Award, Heart, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center pt-20 overflow-hidden" aria-labelledby="hero-heading">
      
      {/* Background Blobs - Strategic positioning for 'airy' feel */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-lime/10 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] left-[30%] w-[25%] h-[25%] bg-lime/5 rounded-full blur-[80px] animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 rounded-full px-4 py-1.5 mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[13px] font-bold text-primary uppercase tracking-wider">100% Natural Sweeteners</span>
            </motion.div>

            <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.05] tracking-tighter mb-8 max-w-xl">
              Sweetness<br />
              <span className="text-primary">Without</span><br />
              Sacrifice
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 max-w-lg mb-10 leading-relaxed font-medium">
              Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit. Zero calories, zero glycemic impact, endless flavor.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/collections/all"
                className="inline-flex items-center justify-center gap-2 font-black bg-primary text-white rounded-full shadow-lg hover:bg-forest-light hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-16 px-10 group"
              >
                Shop Collection
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/#benefits"
                className="inline-flex items-center justify-center font-bold border-2 border-primary/20 text-primary hover:border-primary hover:bg-primary/5 rounded-full transition-all duration-300 h-16 px-10"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right: Image Card & Floating Badges */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="relative max-w-[540px] mx-auto lg:ml-auto lg:mr-0">
              
              {/* Image Container - Horizontal Card Style */}
              <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(46,125,50,0.12)] bg-white p-2">
                <div className="aspect-[16/10] overflow-hidden rounded-[24px]">
                  <img 
                    src="/build/assets/hero-bg-D-TWzogc.jpg" 
                    alt="Grevia natural products" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>

              {/* Floating Badges - Exactly placed as in prototype */}
              <motion.div 
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-primary/5"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground pr-2">Zero Glycemic</span>
              </motion.div>

              <motion.div 
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-primary/5"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground pr-2">Keto Friendly</span>
              </motion.div>

              <motion.div 
                animate={{ y: [-4, 6, -4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/2 -left-12 translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-primary/5"
              >
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-bold text-foreground pr-2">100% Pure</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
