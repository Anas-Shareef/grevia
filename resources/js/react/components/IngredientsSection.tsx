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
      className="py-24 md:py-40 bg-white relative overflow-hidden"
      aria-labelledby="ingredients-heading"
    >
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 bg-secondary px-4 py-2 rounded-full"
          >
            Ingredient Spotlight
          </motion.span>
          <h2
            id="ingredients-heading"
            className="text-5xl md:text-6xl lg:text-8xl font-black text-primary leading-[1] mb-8 tracking-tighter"
          >
            Nature's Finest
            <br />
            <span className="text-accent-green">Sweeteners</span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-medium leading-relaxed">
            Discover the powerful plants behind our pure, natural sweetness.
          </p>
        </motion.div>

        {/* Ingredients Comparison */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {ingredients.map((ingredient, index) => (
            <motion.article
              key={ingredient.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group bg-page rounded-[40px] overflow-hidden border border-border/40 hover:border-accent-green/20 transition-all duration-700"
            >
              {/* Image Banner */}
              <div className="relative h-[250px] md:h-[350px] overflow-hidden">
                <img
                  src={ingredient.image}
                  alt={`Fresh ${ingredient.name} plant`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-page/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-4xl md:text-5xl font-black text-primary tracking-tighter uppercase">
                    {ingredient.name}
                  </h3>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 md:p-12">
                <p className="text-lg text-text-muted mb-10 leading-relaxed font-medium">
                  {ingredient.description}
                </p>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-5 mb-10">
                  <div className="bg-white rounded-2xl p-6 shadow-soft border border-border/30">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                      Sweetness
                    </span>
                    <p className="text-base font-black text-primary">
                      {ingredient.sweetness}
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-soft border border-border/30">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">
                      Origin
                    </span>
                    <p className="text-base font-black text-primary">
                      {ingredient.origin}
                    </p>
                  </div>
                </div>

                {/* Feature List */}
                <ul className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                  {ingredient.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-accent-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-accent-green" />
                      </div>
                      <span className="text-sm font-bold text-primary tracking-tight">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Global CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <Link to="/benefits">
            <Button variant="outline" className="border-primary/20 text-primary rounded-2xl px-12 py-8 text-lg font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-95 group">
              Learn More About Our Sourcing
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default IngredientsSection;
