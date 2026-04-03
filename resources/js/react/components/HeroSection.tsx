import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Heart, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" aria-labelledby="hero-heading">
      
      {/* Lovable Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#f1fbe8_0%,#f7fbf6_70%)]"></div>
      <div 
        className="absolute inset-0 opacity-50 mix-blend-multiply" 
        style={{ backgroundImage: 'radial-gradient(rgba(26,69,46,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>
      
      {/* Background Orbs (Lime/Primary text-matched) */}
      <motion.div 
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-72 h-72 bg-[#A3E635]/20 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.05, 1], x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#1a452e]/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], x: [0, -20, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#A3E635]/15 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Hero Text Section */}
          <div className="text-center lg:text-left">
            {/* 100% Natural Choice Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-[#A3E635]/15 rounded-[24px] px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-[#1a452e]" />
              <span className="text-sm font-semibold text-[#1a452e]">100% Natural Sweeteners</span>
            </motion.div>
            
            {/* Title with Custom Gradient mapped from .text-gradient-forest */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              id="hero-heading" 
              className="text-5xl md:text-6xl lg:text-[85px] xl:text-[95px] font-black text-[#1a452e] leading-[0.9] tracking-tight mb-6"
            >
              Sweetness<br/>
              <span 
                style={{
                  background: 'linear-gradient(135deg, #1a452e, #A3E635)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Without
              </span><br/>
              Sacrifice
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="text-lg md:text-xl text-[#6b7280] max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                to="/collections/all" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all duration-300 bg-[#1a452e] text-[#f7fbf6] hover:bg-[#153424] rounded-[22px] shadow-[0_4px_14px_-2px_rgba(26,69,46,0.4)] hover:shadow-lg hover:-translate-y-1 text-base h-16 px-10"
              >
                Shop Collection
              </Link>
              <Link 
                to="/benefits" 
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all duration-300 border-2 border-[#1a452e]/30 bg-[#f7fbf6]/80 backdrop-blur-sm text-[#1a452e] hover:border-[#1a452e] hover:bg-[#1a452e]/5 rounded-[22px] text-base h-16 px-10"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Right Product Image Wrapper */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative aspect-square max-w-lg mx-auto">
              
              <div className="absolute inset-0 bg-[#A3E635]/20 rounded-[48px] blur-2xl transform scale-90"></div>
              
              {/* Product Image strictly matching Lovable look: No white background, just the rounded image */}
              <div className="relative rounded-[48px] overflow-hidden shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] h-full">
                <img 
                  src={heroImage} 
                  alt="Grevia premium stevia and monkfruit organic sweetener products" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Lovable Badges */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bg-white/90 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] px-4 py-3 flex items-center gap-2 top-4 -left-4 lg:-left-8 border border-[#e5e7eb]/50"
              >
                <div className="w-8 h-8 bg-[#A3E635]/20 rounded-[14px] flex items-center justify-center">
                  <Award className="w-4 h-4 text-[#1a452e]" />
                </div>
                <span className="text-sm font-bold text-[#1a452e]">Zero Glycemic</span>
              </motion.div>

              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bg-white/90 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] px-4 py-3 flex items-center gap-2 bottom-20 -right-4 lg:-right-8 border border-[#e5e7eb]/50"
              >
                <div className="w-8 h-8 bg-[#A3E635]/20 rounded-[14px] flex items-center justify-center">
                  <Heart className="w-4 h-4 text-[#1a452e]" />
                </div>
                <span className="text-sm font-bold text-[#1a452e]">Keto Friendly</span>
              </motion.div>

              <motion.div 
                animate={{ y: [-3, 6, -3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bg-white/90 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] px-4 py-3 flex items-center gap-2 -bottom-4 left-8 border border-[#e5e7eb]/50"
              >
                <div className="w-8 h-8 bg-[#A3E635]/20 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#1a452e]" />
                </div>
                <span className="text-sm font-bold text-[#1a452e]">100% Pure</span>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
