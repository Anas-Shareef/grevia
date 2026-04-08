import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const IngredientsSection = () => {
  const ingredients = [
    {
      title: "Stevia",
      description:
        "Extracted from the leaves of the Stevia rebaudiana plant, native to South America. Used for centuries as a natural sweetener.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      sweetness: "200-300x sweeter than sugar",
      origin: "South America",
      benefits: [
        "Zero calories",
        "No blood sugar spike",
        "Suitable for diabetics",
        "Heat stable for cooking",
      ],
    },
    {
      title: "Monkfruit",
      description:
        "Also known as Luo Han Guo, this small melon has been used in traditional Chinese medicine for centuries.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      sweetness: "150-250x sweeter than sugar",
      origin: "Southeast Asia",
      benefits: [
        "Natural antioxidants",
        "Zero glycemic index",
        "No bitter aftertaste",
        "Keto approved",
      ],
    },
  ];

  return (
    <section
      id="ingredients"
      className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden"
      aria-labelledby="ingredients-heading"
    >
      {/* Radial Grid Background Pattern */}
      <div className="absolute inset-0 bg-radial-grid opacity-30" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="eyebrow mb-4 !text-lime">
            Ingredient Spotlight
          </span>
          <h2
            id="ingredients-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6"
          >
            Nature's Finest
            <br />
            <span className="text-primary">Sweeteners</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover the powerful plants behind our pure, natural sweetness.
          </p>
        </motion.div>

        {/* Ingredient Cards - 2-column grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {ingredients.map((ingredient, index) => (
            <motion.article
              key={ingredient.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="group bg-card rounded-squircle-xl overflow-hidden shadow-card border border-border/50"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={ingredient.image}
                  alt={`Fresh ${ingredient.title} plant`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl md:text-4xl font-black text-foreground">
                    {ingredient.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {ingredient.description}
                </p>

                {/* Data Badges */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-secondary/50 rounded-squircle p-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Sweetness
                    </span>
                    <p className="text-sm font-bold text-foreground mt-1">
                      {ingredient.sweetness}
                    </p>
                  </div>
                  <div className="bg-secondary/50 rounded-squircle p-4">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Origin
                    </span>
                    <p className="text-sm font-bold text-foreground mt-1">
                      {ingredient.origin}
                    </p>
                  </div>
                </div>

                {/* Benefits Checklist */}
                <ul className="space-y-3">
                  {ingredient.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-lime/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/benefits"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground rounded-squircle h-14 px-8 transition-all duration-300 group"
          >
            Learn More About Our Sourcing
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientsSection;
