import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

declare global {
  interface Window {
    GreviaSettings?: {
      cta_badge_text?: string;
      cta_heading?: string;
      cta_description?: string;
      cta_primary_btn_text?: string;
      cta_primary_btn_url?: string;
      cta_secondary_btn_text?: string;
      cta_secondary_btn_url?: string;
      cta_stat1_value?: string;
      cta_stat1_label?: string;
      cta_stat2_value?: string;
      cta_stat2_label?: string;
      cta_stat3_value?: string;
      cta_stat3_label?: string;
    };
  }
}

const ConversionBanner = () => {
  const settings = window.GreviaSettings || {};

  const badgeText = settings.cta_badge_text || "Limited Time Offer";
  const heading = settings.cta_heading || "Ready to Make\nthe Sweet Switch?";
  const description = settings.cta_description || "Join thousands who've already discovered the pure taste of nature. Get 20% off your first order with code SWEEVAL20";
  const primaryBtnText = settings.cta_primary_btn_text || "Shop Now & Save 20%";
  const primaryBtnUrl = settings.cta_primary_btn_url || "/collections/all";
  const secondaryBtnText = settings.cta_secondary_btn_text || "Learn More";
  const secondaryBtnUrl = settings.cta_secondary_btn_url || "/benefits";

  const metrics = [
    { label: settings.cta_stat1_label || "Happy Customers", value: settings.cta_stat1_value || "50K+" },
    { label: settings.cta_stat2_label || "Average Rating", value: settings.cta_stat2_value || "4.9★" },
    { label: settings.cta_stat3_label || "Natural Ingredients", value: settings.cta_stat3_value || "100%" },
  ];

  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden bg-primary"
      aria-labelledby="cta-heading"
    >
      {/* Background Architectural Elements */}
      <div className="absolute inset-0 bg-radial-grid opacity-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Eyebrow Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-10"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="eyebrow !text-white !tracking-[0.2em]">
              {badgeText}
            </span>
          </motion.div>

          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-8 whitespace-pre-line"
          >
            {heading}
          </h2>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link
              to={primaryBtnUrl}
              className="inline-flex items-center justify-center gap-3 font-black text-lg bg-white text-primary hover:bg-white/90 hover:-translate-y-1 rounded-full shadow-2xl transition-all duration-300 h-16 px-10 group"
            >
              {primaryBtnText}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={secondaryBtnUrl}
              className="inline-flex items-center justify-center font-bold h-16 px-10 text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/50 rounded-full transition-all duration-300"
            >
              {secondaryBtnText}
            </Link>
          </div>

          {/* Stats Section with Divider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 pt-16 border-t border-white/10"
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center group">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {metric.value}
                </div>
                <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.25em]">
                  {metric.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversionBanner;
