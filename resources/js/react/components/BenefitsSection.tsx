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
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-lime/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-block text-sm font-bold text-lime uppercase tracking-widest mb-4">
            Why Choose Us
          </span>
          <h2
            id="benefits-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6"
          >
            The Sweet Truth
            <br />
            <span className="text-primary">About Health</span>
          </h2>
          <p className="text-lg text-muted-foreground">
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
              className="group bg-card rounded-squircle-lg p-8 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 hover:border-lime/30"
            >
              <div className="w-14 h-14 bg-lime/15 rounded-squircle flex items-center justify-center mb-6 group-hover:bg-lime/25 group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
