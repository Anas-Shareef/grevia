import { motion } from "framer-motion";
import { 
  Zap, 
  Heart, 
  Leaf, 
  Flame, 
  Droplets, 
  Smile 
} from "lucide-react";

interface Benefit {
  icon: any;
  title: string;
  desc: string;
}

const benefits: Benefit[] = [
  {
    icon: Zap,
    title: "Zero Glycemic",
    desc: "Perfectly safe for diabetics with no impact on blood sugar levels.",
  },
  {
    icon: Heart,
    title: "Keto Friendly",
    desc: "Maintain 100% ketosis without sacrificing any sweetness.",
  },
  {
    icon: Leaf,
    title: "Pure Extraction",
    desc: "Extracted from nature's finest plants using sustainable methods.",
  },
  {
    icon: Flame,
    title: "Zero Calories",
    desc: "Enjoy guilt-free flavor without adding any daily calories.",
  },
  {
    icon: Droplets,
    title: "No Aftertaste",
    desc: "Clean, pure sweetness that tastes exactly like sugar.",
  },
  {
    icon: Smile,
    title: "Eco-Friendly",
    desc: "Sourced responsibly to protect our planet for future generations.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 md:py-32 bg-[#F8FAF8]">
      <div className="container mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[#1a452e] font-bold uppercase tracking-[0.2em] text-[12px] mb-4 block"
          >
            The Sweet Truth
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a452e] tracking-tight leading-[1.1] mb-6"
          >
            A Better Way to <br /> Enjoy Sweetness
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#5a6e60] text-lg font-medium"
          >
            Pure, clean sweetness backed by science and sourced from nature.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-squircle-xl p-10 shadow-card hover:shadow-lg transition-all duration-500 group border border-transparent hover:border-[#1a452e]/5"
            >
              <div className="w-14 h-14 rounded-[18px] bg-[#A3E635]/15 flex items-center justify-center text-[#1a452e] mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                <benefit.icon className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold text-[#1a452e] tracking-tight mb-4">{benefit.title}</h3>
              <p className="text-[#5a6e60] text-[15px] font-medium leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
