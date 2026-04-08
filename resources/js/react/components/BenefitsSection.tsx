import { motion } from "framer-motion";
import { Zap, Heart, Leaf, Scale, Droplets, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Zero Glycemic",
      description:
        "No impact on blood sugar levels, making it perfect for diabetics and health-conscious individuals.",
      icon: <Zap className="w-7 h-7 text-primary" />,
    },
    {
      title: "Keto-Friendly",
      description:
        "Maintain ketosis without sacrificing sweetness. Zero carbs, zero compromise.",
      icon: <Heart className="w-7 h-7 text-primary" />,
    },
    {
      title: "Pure Extraction",
      description:
        "Carefully extracted from nature's finest plants using clean, sustainable methods.",
      icon: <Leaf className="w-7 h-7 text-primary" />,
    },
    {
      title: "Zero Calories",
      description:
        "Enjoy guilt-free sweetness without adding to your daily calorie count.",
      icon: <Scale className="w-7 h-7 text-primary" />,
    },
    {
      title: "No Aftertaste",
      description:
        "Clean, pure sweetness that tastes just like sugar without the bitter aftertaste.",
      icon: <Droplets className="w-7 h-7 text-primary" />,
    },
    {
      title: "Dentist Approved",
      description:
        "Doesn't contribute to tooth decay or cavities. Your smile stays perfect.",
      icon: <Shield className="w-7 h-7 text-primary" />,
    },
  ];

  return (
    <section
      id="benefits"
      className="py-24 md:py-32 relative overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Ambient Glow Blobs — visible soft green */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-lime/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
            Our natural sweeteners deliver pure, clean sweetness backed by
            science and nature.
          </p>
        </motion.div>

        {/* Benefits Grid — Exact Lovable structure */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-squircle-lg p-8 shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 hover:border-lime/30"
            >
              <div className="w-14 h-14 bg-lime/15 rounded-squircle flex items-center justify-center mb-6 group-hover:bg-lime/25 group-hover:scale-110 transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
