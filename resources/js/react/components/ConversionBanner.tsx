import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const ConversionBanner = () => {
  return (
    <section className="py-24 md:py-32 overflow-hidden relative">
      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-[var(--green-primary)] rounded-[48px] p-12 md:p-24 relative overflow-hidden shadow-2xl"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--green-accent)] blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white blur-[100px] opacity-10 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-[900] tracking-tighter leading-[0.9] text-white mb-8">
              Ready to Make the <br /> 
              Sweet Switch<span className="text-[var(--green-accent)]">?</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
              Join thousands of others in choosing a healthier, sweeter life without any compromise. Your journey to natural sweetness starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link to="/collections/all">
                <button className="btn-lime w-full sm:w-auto px-12 py-5 flex items-center justify-center gap-3 group">
                  Shop All Products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link to="/contact">
                <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-[24px] px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/20 transition-all">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Extreme corner decorative elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[var(--green-accent)] blur-[80px] opacity-10 rounded-full" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 bg-[var(--green-primary)] blur-[100px] opacity-10 rounded-full" />
    </section>
  );
};

export default ConversionBanner;
