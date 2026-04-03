import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ConversionBanner = () => {
  const metrics = [
    { label: "Happy Customers", value: "50K+" },
    { label: "Average Rating", value: "4.9★" },
    { label: "Natural Ingredients", value: "100%" },
  ];

  return (
    <section className="py-24 md:py-40 relative overflow-hidden bg-primary" aria-labelledby="cta-heading">
      
      {/* Background Architectural Grid/Blobs */}
      <div className="absolute inset-0 bg-radial-grid opacity-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/10 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Banner Content */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-10"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Limited Time Offer</span>
          </motion.div>

          <h2 id="cta-heading" className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-8">
            Ready to Make<br />the Sweet Switch?
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Join thousands who've already discovered the pure taste of nature. 
            Get 20% off your first order with code <span className="font-black text-white underline decoration-white/30 underline-offset-8">SWEEVAL20</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
            <Link 
              to="/collections/all"
              className="inline-flex items-center justify-center gap-3 font-black text-lg bg-white text-primary hover:bg-cream hover:-translate-y-1 rounded-full shadow-2xl transition-all duration-300 h-16 px-10 group"
            >
              Shop Now & Save 20%
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/#benefits"
              className="inline-flex items-center justify-center font-bold h-16 px-10 text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/50 rounded-full transition-all duration-300"
            >
              Learn More
            </Link>
          </div>

          {/* Stats Below */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 pt-16 border-t border-white/10"
          >
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center group">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">{metric.value}</div>
                <div className="text-[11px] font-black text-white/40 uppercase tracking-[0.25em]">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default ConversionBanner;
