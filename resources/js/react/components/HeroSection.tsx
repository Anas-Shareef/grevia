import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Heart, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f4faf0]" aria-labelledby="hero-heading">

      {/* === BACKGROUND === */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_20%,#d4edcf_0%,#f4faf0_58%,#f7fbf6_100%)]" />

      {/* Top-left dominant lime orb — exactly as in Picture 2 */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 w-[420px] h-[420px] bg-[#A3E635]/25 rounded-full blur-[100px] pointer-events-none"
      />
      {/* Bottom-right subtle orb */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#1a452e]/[0.06] rounded-full blur-[80px] pointer-events-none"
      />

      {/* === CONTENT === */}
      <div className="container mx-auto px-6 md:px-10 relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Text ── */}
          <div className="lg:text-left text-center">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-[#A3E635]/20 rounded-full px-4 py-1.5 mb-7 border border-[#A3E635]/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1a452e]" strokeWidth={2.5} />
              <span className="text-[13px] font-semibold text-[#1a452e] tracking-wide">100% Natural Sweeteners</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              id="hero-heading"
              className="font-black leading-[1.0] tracking-tight mb-6"
              style={{ fontSize: 'clamp(52px, 7vw, 88px)' }}
            >
              <span className="text-[#1c5f38] block">Sweetness</span>
              {/* "Without" — exact forest→lime gradient from Lovable .text-gradient-forest */}
              <span
                className="block"
                style={{
                  background: 'linear-gradient(135deg, hsl(145,55%,24%), hsl(100,55%,55%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Without
              </span>
              <span className="text-[#1c5f38] block">Sacrifice</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#5a6e60] text-[15px] md:text-[17px] leading-relaxed max-w-[380px] lg:mx-0 mx-auto mb-9"
            >
              Experience the pure taste of nature with Grevia's premium Stevia and Monkfruit sweeteners. Zero calories, zero guilt, endless flavor.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 lg:justify-start justify-center"
            >
              <Link
                to="/collections/all"
                className="inline-flex items-center justify-center font-bold text-[15px] h-14 px-9 bg-[#1c5f38] text-white rounded-full shadow-[0_4px_16px_-2px_rgba(28,95,56,0.45)] hover:bg-[#174e2e] hover:-translate-y-0.5 transition-all duration-300"
              >
                Shop Collection
              </Link>
              <Link
                to="/benefits"
                className="inline-flex items-center justify-center font-bold text-[15px] h-14 px-9 border-2 border-[#1c5f38]/25 text-[#1c5f38] bg-white/60 backdrop-blur-sm rounded-full hover:border-[#1c5f38]/60 hover:bg-white/80 transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Image + Floating Badges ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            {/* Outer wrapper — gives room for overflowing badges */}
            <div className="relative mx-auto max-w-[560px] lg:max-w-none pb-10">

              {/* Soft lime glow behind the image */}
              <div className="absolute inset-4 bg-[#A3E635]/15 rounded-[36px] blur-2xl" />

              {/* ── MAIN IMAGE: 4:3 landscape, no border, soft rounded corners ── */}
              <div
                className="relative rounded-[28px] overflow-hidden shadow-[0_16px_48px_-12px_rgba(28,95,56,0.18)]"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={heroImage}
                  alt="Grevia Organic Sweetener products — Stevia and Monkfruit"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ── BADGE 1: Zero Glycemic — top-left overlapping image edge ── */}
              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-4 -left-5 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_4px_20px_-4px_rgba(28,95,56,0.18)] border border-[#e8f0e8]"
              >
                <div className="w-6 h-6 bg-[#A3E635]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-3 h-3 text-[#1c5f38]" />
                </div>
                <span className="text-[12px] font-bold text-[#1c5f38] whitespace-nowrap">Zero Glycemic</span>
              </motion.div>

              {/* ── BADGE 2: Keto Friendly — right side, vertically centered-ish ── */}
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-16 -right-4 lg:-right-8 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_4px_20px_-4px_rgba(28,95,56,0.18)] border border-[#e8f0e8]"
              >
                <div className="w-6 h-6 bg-[#A3E635]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-3 h-3 text-[#1c5f38]" />
                </div>
                <span className="text-[12px] font-bold text-[#1c5f38] whitespace-nowrap">Keto Friendly</span>
              </motion.div>

              {/* ── BADGE 3: 100% Pure — bottom-left, below image ── */}
              <motion.div
                animate={{ y: [-3, 5, -3] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-0 left-6 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 shadow-[0_4px_20px_-4px_rgba(28,95,56,0.18)] border border-[#e8f0e8]"
              >
                <div className="w-6 h-6 bg-[#A3E635]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-[#1c5f38]" />
                </div>
                <span className="text-[12px] font-bold text-[#1c5f38] whitespace-nowrap">100% Pure</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
