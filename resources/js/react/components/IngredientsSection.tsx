import { motion } from "framer-motion";
import { Check } from "lucide-react";
import steviaImage from "@/assets/stevia-plant.jpg";
import monkfruitImage from "@/assets/monkfruit.jpg";

const ingredients = [
  {
    name: "Pure Stevia",
    image: steviaImage,
    tag: "The Classic Choice",
    description: "Extracted from the leaves of the Stevia rebaudiana plant. Used for centuries as a natural sweetener with zero calorie impact.",
    features: ["Zero Calories", "No Blood Sugar Spike", "Heat Stable", "Keto Friendly"],
    type: "stevia",
  },
  {
    name: "Monk Fruit",
    image: monkfruitImage,
    tag: "The Antioxidant Powerhouse",
    description: "Also known as Luo Han Guo, this small melon provides intense sweetness without the caloric baggage.",
    features: ["Natural Antioxidants", "Zero Glycemic Index", "No Aftertaste", "Organic Sourcing"],
    type: "monk",
  },
];

const stats = [
  { number: "0", label: "Calories" },
  { number: "0", label: "Glycemic Index" },
  { number: "250x", label: "Sweeter Than Sugar" },
  { number: "100%", label: "Plant Based" },
];

const IngredientsSection = () => {
  return (
    <>
      {/* Step 12: Green Stats Bar */}
      <div className="stats-bar">
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 13: Ingredients Grid */}
      <section id="ingredients" className="ingredients-section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Natural Sourcing</span>
            <h2 className="section-title">Derived From <br /> Nature's Finest</h2>
            <p className="section-subtitle">
              We carefully extract sweetness from high-quality plants to ensure the purest taste and maximum health benefits.
            </p>
          </div>

          <div className="ingredients-grid">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="ingredient-card"
              >
                <div className={`ingredient-img ${ingredient.type === 'stevia' ? 'stevia-img' : 'monk-img'}`}>
                  <img src={ingredient.image} alt={ingredient.name} />
                </div>
                <div className="ingredient-body">
                  <span className={`ingredient-tag ${ingredient.type === 'monk' ? 'monk' : ''}`}>
                    {ingredient.tag}
                  </span>
                  <h3 className="ingredient-name">{ingredient.name}</h3>
                  <p className="ingredient-desc">{ingredient.description}</p>
                  
                  <div className="ingredient-features">
                    {ingredient.features.map((feat) => (
                      <div key={feat} className="ingredient-feat">
                        <div className={`feat-check ${ingredient.type === 'monk' ? 'monk' : ''}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default IngredientsSection;
