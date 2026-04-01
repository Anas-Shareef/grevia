import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Star, ShieldCheck, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg"; // Updated reference if product image is available

const HeroSection = () => {
  return (
    <>
      <section className="hero overflow-hidden pt-24 md:pt-32">
        <div className="hero-inner container flex flex-col items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <div className="eyebrow-badge">
                <span className="dot" />
                100% Natural Sweetness
              </div>
              
              <h1 className="mb-6">
                Natural Sweetness <br className="hidden md:block" /> 
                <span className="text-[var(--green-primary)]">Without</span> Sacrifice
              </h1>
              
              <p className="hero-subtitle mb-8">
                Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor.
              </p>
              
              <div className="hero-bullets mb-10">
                <div className="hero-bullet">
                  <div className="bullet-check"><Check className="w-3 h-3" /></div>
                  <span>Zero Glycemic Impact</span>
                </div>
                <div className="hero-bullet">
                  <div className="bullet-check"><Check className="w-3 h-3" /></div>
                  <span>Keto & Diabetic Friendly</span>
                </div>
                <div className="hero-bullet">
                  <div className="bullet-check"><Check className="w-3 h-3" /></div>
                  <span>100% Organic Ingredients</span>
                </div>
              </div>
              
              <div className="hero-ctas">
                <Link to="/collections/all" className="btn-primary">
                  Shop Collection
                </Link>
                <Link to="/benefits" className="btn-secondary">
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="hero-visual relative flex justify-center lg:justify-end"
            >
              <div className="hero-img-container stevia-bg max-w-[500px]">
                <img 
                  src={heroImage} 
                  alt="Grevia Premium Sweetener" 
                  className="relative z-10 p-8"
                />
                <div className="img-shadow-orb" />
                
                {/* Floating Review Badge */}
                <div className="hero-float-badge flex items-center gap-2 animate-float">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span>4.9/5 from 2,000+ happy souls</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Trust Bar (Step 8) */}
      <div className="trust-bar w-full py-10 border-y border-[var(--border-light)] bg-white">
        <div className="container flex flex-wrap justify-center gap-12 sm:gap-20">
          <div className="trust-item">
            <div className="trust-icon"><ShieldCheck className="w-5 h-5 text-[var(--green-primary)]" /></div>
            <span>FDA Certified Purity</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><Zap className="w-5 h-5 text-[var(--green-primary)]" /></div>
            <span>Zero Insulin Spikes</span>
          </div>
          <div className="trust-item">
            <div className="trust-icon"><Star className="w-5 h-5 text-[var(--green-primary)]" /></div>
            <span>#1 Organic Choice</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
