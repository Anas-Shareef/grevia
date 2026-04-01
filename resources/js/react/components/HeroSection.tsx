import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Star, ShieldCheck, Zap, Heart, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg"; 

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-[var(--bg-page)] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--green-accent)] blur-[120px] opacity-20 rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--green-accent)] blur-[100px] opacity-10 rounded-full" />

      <div className="container relative z-10 pt-32 pb-20 md:pt-48 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="eyebrow-badge">
              <span className="dot" />
              100% Natural Choice
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-[900] tracking-tighter leading-[0.9] mb-10 text-[var(--green-primary)]">
              Sweetness <br />
              <span className="text-outline">Without</span> <br />
              Sacrifice<span className="text-[var(--green-accent)]">.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium leading-relaxed max-w-xl mb-12">
              Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/collections/all" className="btn-primary flex items-center justify-center">
                Shop Collection
              </Link>
              <Link to="/benefits" className="btn-secondary flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Visual - Exact Clone Layout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative lg:ml-auto"
          >
            {/* The Textured Squircle Showcase */}
            <div className="relative aspect-[4/3] w-full max-w-[650px] rounded-[60px] bg-[#F2F8F1] border border-[var(--green-primary)]/5 p-16 flex items-center justify-center shadow-2xl overflow-visible group">
              {/* Marble Texture Overlay */}
              <div className="absolute inset-0 opacity-40 mix-blend-overlay rounded-[60px] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')]" />
              
              {/* Product Image */}
              <img 
                src={heroImage} 
                alt="Grevia Premium Sweetener Range" 
                className="relative z-10 w-full max-h-[110%] object-contain drop-shadow-[0_35px_35px_rgba(26,69,46,0.2)] animate-float"
              />

              {/* Floating Badge: Zero Glycemic */}
              <div className="absolute top-[10%] -left-[10%] bg-white/90 backdrop-blur-md px-6 py-4 rounded-[28px] shadow-xl border border-[var(--green-primary)]/5 z-20 flex items-center gap-3 animate-float transition-transform hover:scale-110 pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-pale)] flex items-center justify-center text-[var(--green-primary)]">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green-primary)]">Zero Glycemic</p>
                </div>
              </div>

              {/* Floating Badge: Keto Friendly */}
              <div className="absolute bottom-[20%] -right-[15%] bg-white/90 backdrop-blur-md px-6 py-4 rounded-[28px] shadow-xl border border-[var(--green-primary)]/5 z-20 flex items-center gap-3 animate-float [animation-delay:1s] transition-transform hover:scale-110 pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-pale)] flex items-center justify-center text-[var(--green-primary)]">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green-primary)]">Keto Friendly</p>
                </div>
              </div>

              {/* Floating Badge: 100% Pure */}
              <div className="absolute -bottom-[10%] left-[20%] bg-white/90 backdrop-blur-md px-6 py-4 rounded-[28px] shadow-xl border border-[var(--green-primary)]/5 z-20 flex items-center gap-3 animate-float [animation-delay:2s] transition-transform hover:scale-110 pointer-events-none">
                <div className="w-10 h-10 rounded-xl bg-[var(--green-pale)] flex items-center justify-center text-[var(--green-primary)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green-primary)]">100% Pure</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Trust Bar (Step 8) */}
      <div className="bg-white border-y border-[var(--border-light)] py-12 relative z-10">
        <div className="container">
          <div className="flex flex-wrap justify-between items-center gap-10 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {[
              { icon: <ShieldCheck />, text: "FDA Certified Purity" },
              { icon: <Zap />, text: "Zero Insulin Spikes" },
              { icon: <Check />, text: "#1 Organic Choice" },
              { icon: <Heart />, text: "Safe for Diabetics" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-[var(--green-pale)] flex items-center justify-center text-[var(--green-primary)] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-heading)]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
