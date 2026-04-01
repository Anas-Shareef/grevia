import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ConversionBanner = () => {
  return (
    <section
      className="py-24 md:py-32 relative overflow-hidden bg-white"
      aria-labelledby="cta-heading"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-page opacity-50" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 bg-secondary rounded-full px-6 py-3 mb-10 shadow-soft"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Our Sweet Switch</span>
          </motion.div>

          <h2
            id="cta-heading"
            className="text-5xl md:text-6xl lg:text-8xl font-black text-primary leading-[0.95] mb-10 tracking-tighter"
          >
            Ready to Make
            <br />
            the <span className="text-accent-bright">Sweet Switch?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
            Join 50k+ health-conscious people who've already discovered the pure taste of natural sweetness. 
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-primary hover:bg-primary/95 text-white rounded-2xl px-12 py-10 text-xl font-black uppercase tracking-widest shadow-button transition-transform hover:scale-105 active:scale-95 group">
              Shop Now & Save
              <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Link to="/benefits">
              <Button
                variant="outline"
                className="border-primary/20 border-2 bg-white hover:bg-secondary text-primary rounded-2xl px-12 py-10 text-xl font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-16 mt-20 pt-16 border-t border-primary/5"
          >
            <div className="text-center">
              <div className="text-5xl font-black text-primary tracking-tighter">50K+</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-primary tracking-tighter">4.9★</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-primary tracking-tighter">100%</div>
              <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-3">Pure Organic</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversionBanner;
