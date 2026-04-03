import { motion } from "framer-motion";
import { Zap, Heart, Leaf, Scale, Droplets, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Zero Glycemic",
      description: "No impact on blood sugar levels, making it perfect for diabetics.",
      icon: <Zap className="w-6 h-6 text-primary" />,
    },
    {
      title: "Keto-Friendly",
      description: "Maintain ketosis without sacrificing sweetness. Zero carbs, zero compromise.",
      icon: <Heart className="w-6 h-6 text-primary" />,
    },
    {
      title: "Pure Extraction",
      description: "Carefully extracted from nature's finest plants using clean methods.",
      icon: <Leaf className="w-6 h-6 text-primary" />,
    },
    {
      title: "Zero Calories",
      description: "Enjoy guilt-free sweetness without adding to your daily calorie count.",
      icon: <Scale className="w-6 h-6 text-primary" />,
    },
    {
      title: "No Aftertaste",
      description: "Clean, pure sweetness that tastes just like sugar without the bitterness.",
      icon: <Droplets className="w-6 h-6 text-primary" />,
    },
    {
      title: "Dentist Approved",
      description: "Doesn't contribute to tooth decay. Your smile stays perfect.",
      icon: <Shield className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <section id="benefits" className="py-24 md:py-40 relative bg-background/50 overflow-hidden" aria-labelledby="benefits-heading">
      
      {/* Structural Airiness - Soft Blurs */}
      <div className="absolute top-1/4 right-0 w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[20%] h-[20%] bg-primary/2 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
        >
          <span className="inline-block text-[11px] font-black text-primary/60 uppercase tracking-[0.2em] mb-4">Why Choose Us</span>
          <h2 id="benefits-heading" className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight mb-8">
            The Sweet Truth<br />
            <span className="text-primary font-bold">About Health</span>
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed font-medium">
            Our natural sweeteners deliver pure, clean sweetness backed by science and nature.
          </p>
        </motion.div>

        {/* Benefits Grid - 2 rows x 3 columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 lg:gap-12">
          {benefits.map((benefit, index) => (
            <motion.article 
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white p-10 rounded-[24px] shadow-[0_8px_30px_rgba(46,125,50,0.04)] hover:shadow-[0_20px_50px_rgba(46,125,50,0.1)] hover:-translate-y-2 transition-all duration-500 border border-primary/5"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-[18px] flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-extrabold text-foreground mb-4 tracking-tight">{benefit.title}</h3>
              <p className="text-[15px] font-medium text-foreground/60 leading-relaxed">
                {benefit.description}
              </p>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BenefitsSection;
