import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import steviaImage from "@/assets/stevia-plant.jpg";
import monkfruitImage from "@/assets/monkfruit.jpg";

const ingredients = [
  {
    name: "Stevia",
    image: steviaImage,
    description: "Extracted from the leaves of the Stevia rebaudiana plant, native to South America. Used for centuries as a natural sweetener.",
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
    name: "Monkfruit",
    image: monkfruitImage,
    description: "Also known as Luo Han Guo, this small melon has been used in traditional Chinese medicine for centuries.",
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

const IngredientsSection = () => {
  return (
    <section
      id="ingredients"
      className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden"
      aria-labelledby="ingredients-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-radial-grid opacity-30" />

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

        {/* Ingredients Comparison */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {ingredients.map((ingredient, index) => (
            <motion.article
              key={ingredient.name}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group bg-card rounded-squircle-xl overflow-hidden shadow-card border border-border/50"
            >
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={ingredient.image}
                  alt={`Fresh ${ingredient.name} plant`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-3xl md:text-4xl font-black text-foreground">
                    {ingredient.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {ingredient.description}
                </p>

                {/* Stats */}
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

                {/* Benefits */}
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/benefits">
            <Button variant="outline" size="lg" className="group">
              Learn More About Our Sourcing
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientsSection;
