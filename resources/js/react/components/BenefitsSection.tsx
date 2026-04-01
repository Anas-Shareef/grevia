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
    desc: "No impact on blood sugar levels, making it perfect for diabetics and health-conscious individuals.",
  },
  {
    icon: Heart,
    title: "Keto-Friendly",
    desc: "Maintain ketosis without sacrificing sweetness. Zero carbs, zero compromise.",
  },
  {
    icon: Leaf,
    title: "Pure Extraction",
    desc: "Carefully extracted from nature's finest plants using clean, sustainable methods.",
  },
  {
    icon: Flame,
    title: "Zero Calories",
    desc: "Enjoy guilt-free sweetness without adding to your daily calorie count.",
  },
  {
    icon: Droplets,
    title: "No Aftertaste",
    desc: "Clean, pure sweetness that tastes just like sugar without the bitter aftertaste.",
  },
  {
    icon: Smile,
    title: "Dentist Approved",
    desc: "Doesn't contribute to tooth decay or cavities. Your smile stays perfect.",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 md:py-32 bg-[var(--bg-card)]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[var(--green-primary)] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">The Sweet Truth</span>
          <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-[1.1] mb-6">
            The Sweet Truth <br /> About Health
          </h2>
          <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Our natural sweeteners deliver pure, clean sweetness backed by science and nature.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group bg-white rounded-[var(--radius-squircle)] p-10 border border-[var(--border-light)] transition-all hover:shadow-[var(--shadow-card)] hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-2xl bg-[var(--green-pale)] flex items-center justify-center text-[var(--green-primary)] mb-8 transition-transform group-hover:scale-110">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{benefit.title}</h3>
              <p className="text-[var(--text-muted)] text-sm font-medium leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
