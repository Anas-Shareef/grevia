import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Leaf } from "lucide-react";

const ConversionBanner = () => {
  return (
    <section className="bg-[#1a452e] py-24 md:py-32 relative overflow-hidden">
      {/* Subtle organic background glow */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#A3E635]/10 blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-6 md:px-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-[#A3E635]/15 rounded-full px-4 py-1.5 mb-8 border border-[#A3E635]/20"
          >
            <span className="text-[12px] font-bold text-[#A3E635] tracking-widest uppercase">Limited Time Offer</span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
            Ready to Make the <br /> 
            <span className="text-[#A3E635]">Sweet Switch?</span>
          </h2>
          
          <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12">
            Join thousands who've already discovered the pure taste of natural sweetness. Get 20% off your first order with code <span className="text-[#A3E635] font-bold whitespace-nowrap uppercase tracking-wider bg-[#A3E635]/10 px-2 py-0.5 rounded">PURESWEET20</span>
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
            <Link to="/collections/all">
              <button className="bg-[#A3E635] text-[#1a452e] font-bold h-16 px-10 rounded-full flex items-center justify-center gap-3 hover:bg-white transition-all duration-300 shadow-xl hover:-translate-y-1 group">
                <span>Shop Now & Save 20%</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/benefits">
              <button className="bg-transparent border-2 border-white/20 text-white font-bold h-16 px-10 rounded-full hover:bg-white/10 transition-all duration-300">
                Learn More
              </button>
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/10 items-center">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <Users className="w-6 h-6 text-[#A3E635] mb-2" />
              <span className="text-3xl font-black text-white leading-none">50K+</span>
              <span className="text-white/50 text-[12px] font-bold uppercase tracking-widest">Happy Customers</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex items-center gap-1 mb-2">
                <span className="text-3xl font-black text-white leading-none">4.9</span>
                <Star className="w-6 h-6 text-[#A3E635] fill-[#A3E635]" />
              </div>
              <span className="text-white/50 text-[12px] font-bold uppercase tracking-widest">Average Rating</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-2"
            >
              <Leaf className="w-6 h-6 text-[#A3E635] mb-2" />
              <span className="text-3xl font-black text-white leading-none">100%</span>
              <span className="text-white/50 text-[12px] font-bold uppercase tracking-widest">Natural Ingredients</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversionBanner;
