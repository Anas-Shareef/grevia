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

const BenefitsSection = () => {
  return (
    <section id="benefits" className="benefits-section">
      <div className="container">
        {/* Section Header (Step 9) */}
        <div className="section-header">
          <span className="section-eyebrow">The Sweet Truth</span>
          <h2 className="section-title">Designed for Your <br /> Well-being</h2>
          <p className="section-subtitle">
            Our natural sweeteners deliver pure, clean sweetness backed by science and nature.
          </p>
        </div>

        {/* Benefits Grid (Step 11) */}
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="benefit-card"
            >
              <div className="benefit-icon">
                <benefit.icon className="w-6 h-6 text-[var(--green-primary)]" />
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-desc">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
