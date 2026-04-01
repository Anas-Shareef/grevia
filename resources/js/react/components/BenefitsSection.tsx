import { motion } from "framer-motion";
import { 
  Zap, 
  Heart, 
  Leaf, 
  Scale, 
  Droplets, 
  Shield 
} from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Zero Glycemic",
    description: "No impact on blood sugar levels, making it perfect for diabetics and health-conscious individuals.",
  },
  {
    icon: Heart,
    title: "Keto-Friendly",
    description: "Maintain ketosis without sacrificing sweetness. Zero carbs, zero compromise.",
  },
  {
    icon: Leaf,
    title: "Pure Extraction",
    description: "Carefully extracted from nature's finest plants using clean, sustainable methods.",
  },
  {
    icon: Scale,
    title: "Zero Calories",
    description: "Enjoy guilt-free sweetness without adding to your daily calorie count.",
  },
  {
    icon: Droplets,
    title: "No Aftertaste",
    description: "Clean, pure sweetness that tastes just like sugar without the bitter aftertaste.",
  },
  {
    icon: Shield,
    title: "Dentist Approved",
    description: "Doesn't contribute to tooth decay or cavities. Your smile stays perfect.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const BenefitsSection = () => {
  return (
    <section
      id="benefits"
      className="py-24 md:py-32 relative bg-page overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 bg-secondary px-4 py-2 rounded-full"
          >
            Why Choose Us
          </motion.span>
          <h2
            id="benefits-heading"
            className="text-4xl md:text-5xl lg:text-7xl font-black text-primary leading-[1] mb-6 tracking-tighter"
          >
            The Sweet Truth
            <br />
            <span className="text-accent-green">About Health</span>
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto font-medium">
            Our natural sweeteners deliver pure, clean sweetness backed by science and nature.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              variants={itemVariants}
              className="group bg-white rounded-[32px] p-10 shadow-card hover:shadow-glow transition-all duration-500 border border-border/40 hover:border-accent-green/20"
            >
              <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-soft">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-primary mb-4 tracking-tighter">
                {benefit.title}
              </h3>
              <p className="text-text-muted leading-relaxed font-medium">
                {benefit.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
