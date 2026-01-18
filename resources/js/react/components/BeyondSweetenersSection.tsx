import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import bakeryCategory from "@/assets/bakery-category.jpg";
import picklesCategory from "@/assets/pickles-category.jpg";

const categories = [
  {
    id: "bakery",
    title: "Bakery Items",
    description: "Freshly prepared, minimally processed baked goods made for everyday indulgence.",
    image: bakeryCategory,
    href: "/products/bakery",
  },
  {
    id: "pickles",
    title: "Pickles & Preserves",
    description: "Traditional recipes crafted with natural ingredients and no artificial preservatives.",
    image: picklesCategory,
    href: "/products/pickles",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const BeyondSweetenersSection = () => {
  return (
    <section
      id="beyond-sweeteners"
      className="py-24 md:py-32 bg-[#F9FAFB] relative overflow-hidden"
      aria-labelledby="beyond-sweeteners-heading"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-lime/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-primary/5 rounded-full blur-3xl" />

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
            Explore More
          </span>
          <h2
            id="beyond-sweeteners-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6"
          >
            Beyond
            <br />
            <span className="text-primary">Sweeteners</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Crafted foods made with the same care, purity, and health-first philosophy as Grevia sweeteners.
            Thoughtfully prepared bakery items and traditional foods, aligned with our clean-label and quality-driven standards.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="group relative bg-card rounded-squircle-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 border border-border/50 hover:border-lime/30"
            >
              <Link to={category.href}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="p-8 text-center bg-card flex flex-col items-center flex-grow">
                  <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 line-clamp-2 max-w-sm mx-auto">
                    {category.description}
                  </p>
                  <div className="inline-flex items-center text-primary font-bold group/btn">
                    Explore Products
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BeyondSweetenersSection;
