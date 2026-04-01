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
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-[900] tracking-tighter leading-[0.9] text-[var(--green-primary)] mb-8">
              Sweetness <br />
              <span className="text-[var(--text-body)] opacity-10">Without</span> <br />
              Sacrifice<span className="text-[var(--green-accent)]">.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-[var(--text-muted)] font-medium leading-relaxed max-w-xl mb-10">
              Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              {["Zero Glycemic", "Keto Friendly", "100% Pure"].map((badge) => (
                <div key={badge} className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[var(--green-primary)]/10 text-[var(--green-primary)] font-black uppercase tracking-widest text-[10px] bg-white/50 backdrop-blur-sm">
                  <Check className="w-3.5 h-3.5" />
                  {badge}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/collections/all" className="btn-primary flex items-center justify-center">
                Shop Collection
              </Link>
              <Link to="/benefits" className="btn-secondary flex items-center justify-center">
                Learn More
              </Link>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[40px] bg-white shadow-2xl border border-[var(--border-light)] p-12 flex items-center justify-center overflow-hidden group">
              {/* Product Image */}
              <img 
                src={heroImage} 
                alt="Grevia Premium Sweetener" 
                className="relative z-10 w-full max-w-[400px] drop-shadow-2xl animate-float"
              />
              
              {/* Floating Review Badge */}
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-[var(--border-light)] z-20 flex flex-col gap-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--green-primary)]">
                  4.9/5 from 2,000+ Happy Souls
                </p>
              </div>

              {/* Decorative Leaf */}
              <div className="absolute top-10 right-10 opacity-20 rotate-12">
                <Leaf className="w-20 h-20 text-[var(--green-primary)]" />
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
