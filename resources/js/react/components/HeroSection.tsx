import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Heart, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" aria-labelledby="hero-heading">
      
      {/* Background Gradients & Blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#f0faea_0%,#f7fbf6_70%)]"></div>
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply" 
        style={{ backgroundImage: 'radial-gradient(rgba(26,69,46,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>
      
      {/* Animated Blobs using Framer Motion since arbitrary keyframes are harder to inject cleanly without css */}
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

      <div className="container mx-auto px-4 md:px-6 relative z-10 w-full max-w-[1920px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-[#A3E635]/15 rounded-[20px] px-4 py-2 mb-6 border border-[#A3E635]/30">
              <Sparkles className="w-4 h-4 text-[#1a452e]" />
              <span className="text-sm font-[700] text-[#1a452e]">100% Natural Sweeteners</span>
            </div>
            
            {/* Main Headline */}
            <h1 id="hero-heading" className="text-6xl md:text-7xl lg:text-[90px] font-black text-[#1a452e] leading-[0.9] tracking-tighter mb-8">
              Sweetness<br/>
              {/* Vibrant green for "Without" based on Image 2 */ }
              <span className="text-[#84cc16]">Without</span><br/>
              Sacrifice<span className="text-[#a3e635]">.</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-[#6b7280] max-w-lg mx-auto lg:mx-0 mb-10 font-medium">
              Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/collections/all" 
                className="inline-flex items-center justify-center font-bold transition-all duration-300 bg-[#1a452e] text-[#f7faf6] hover:bg-[#112e1f] rounded-[20px] shadow-[0_4px_14px_-2px_rgba(26,69,46,0.4)] hover:shadow-xl hover:-translate-y-1 text-[17px] h-16 px-10"
              >
                Shop Collection
              </Link>
              <Link 
                to="/benefits" 
                className="inline-flex items-center justify-center font-bold transition-all duration-300 border-2 border-[#1a452e]/20 bg-white/50 backdrop-blur-sm text-[#1a452e] hover:border-[#1a452e] hover:bg-[#1a452e]/5 rounded-[20px] text-[17px] h-16 px-10"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Visual Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative aspect-[4/3] max-w-xl mx-auto lg:mx-0 lg:ml-auto">
              {/* Soft blur backdrop under the image */}
              <div className="absolute inset-0 bg-[#A3E635]/20 rounded-[40px] blur-2xl transform scale-90"></div>
              
              {/* Main Image Container */}
              <div className="relative rounded-[40px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(26,69,46,0.15)] bg-white border border-[#dee7da] p-2">
                <img 
                  src={heroImage} 
                  alt="Grevia premium stevia and monkfruit organic sweetener products" 
                  className="w-full h-full object-cover rounded-[32px]"
                />
              </div>

              {/* Floating Badge 1: Zero Glycemic */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] px-5 py-3 flex items-center gap-3 top-8 -left-6 lg:-left-12 border border-[#dee7da]"
              >
                <div className="w-10 h-10 bg-[#A3E635]/20 rounded-[14px] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#1a452e]" />
                </div>
                <span className="text-[13px] font-bold text-[#1a452e] uppercase tracking-wider">Zero Glycemic</span>
              </motion.div>

              {/* Floating Badge 2: Keto Friendly */}
              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] px-5 py-3 flex items-center gap-3 bottom-24 -right-6 lg:-right-10 border border-[#dee7da]"
              >
                <div className="w-10 h-10 bg-[#A3E635]/20 rounded-[14px] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#1a452e]" />
                </div>
                <span className="text-[13px] font-bold text-[#1a452e] uppercase tracking-wider">Keto Friendly</span>
              </motion.div>

              {/* Floating Badge 3: 100% Pure */}
              <motion.div 
                animate={{ y: [-3, 6, -3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bg-white/95 backdrop-blur-md rounded-[20px] shadow-[0_8px_30px_-8px_rgba(26,69,46,0.15)] px-5 py-3 flex items-center gap-3 -bottom-6 left-12 border border-[#dee7da]"
              >
                <div className="w-10 h-10 bg-[#A3E635]/20 rounded-[14px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#1a452e]" />
                </div>
                <span className="text-[13px] font-bold text-[#1a452e] uppercase tracking-wider">100% Pure</span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
