import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const ConversionBanner = () => {
  return (
    <section
      className="py-20 md:py-28 relative overflow-hidden bg-primary"
      aria-labelledby="cta-heading"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-radial-grid opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-lime/15 rounded-full blur-3xl" />
      
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
            className="inline-flex items-center gap-2 bg-lime/20 rounded-squircle px-4 py-2 mb-8"
          >
            <Sparkles className="w-4 h-4 text-lime" />
            <span className="text-sm font-semibold text-lime">Limited Time Offer</span>
          </motion.div>

          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-primary-foreground leading-tight mb-6"
          >
            Ready to Make
            <br />
            the Sweet Switch?
          </h2>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Join thousands who've already discovered the pure taste of natural sweetness. 
            Get 20% off your first order with code <span className="font-bold text-lime">PURESWEET20</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="limeLg" size="xl" className="group">
              Shop Now & Save 20%
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 hover:border-primary-foreground/50"
            >
              Learn More
            </Button>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-primary-foreground/20"
          >
            <div className="text-center">
              <div className="text-3xl font-black text-lime">50K+</div>
              <div className="text-sm text-primary-foreground/70">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-lime">4.9★</div>
              <div className="text-sm text-primary-foreground/70">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-lime">100%</div>
              <div className="text-sm text-primary-foreground/70">Natural Ingredients</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversionBanner;
