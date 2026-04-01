import { motion } from "framer-motion";
import { Check, Globe, Zap, Droplets } from "lucide-react";

const ingredients = [
  {
    name: "Pure Stevia",
    origin: "South America",
    tag: "200-300x Sweeter",
    description: "Extracted from the leaves of the Stevia rebaudiana plant. Used for centuries as a natural sweetener with zero calorie impact and zero glycemic index.",
    features: ["Zero Calories", "No Blood Sugar Spike", "Heat Stable", "Keto Friendly"],
    type: "stevia",
    icon: <LeafIcon />
  },
  {
    name: "Monk Fruit",
    origin: "Southeast Asia",
    tag: "150-250x Sweeter",
    description: "Also known as Luo Han Guo, this small melon provides intense sweetness without the caloric baggage. Rich in antioxidants called mogrosides.",
    features: ["Natural Antioxidants", "Zero Glycemic Index", "No Aftertaste", "Organic Sourcing"],
    type: "monk",
    icon: <FruitIcon />
  }
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
      <div className="bg-[var(--green-primary)] py-12 md:py-20 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-6xl font-[900] text-white tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500">
                  {stat.number}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--green-accent)]/10 blur-2xl rounded-full" />
      </div>

      {/* Step 13: Ingredients Grid */}
      <section id="ingredients" className="py-24 md:py-32 bg-[var(--bg-page)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[var(--green-primary)] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Natural Sourcing</span>
            <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-[1.1] mb-6">
              Nature's Finest <br /> Sweeteners
            </h2>
            <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
              We carefully extract sweetness from high-quality plants to ensure the purest taste and maximum health benefits.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {ingredients.map((ingredient, index) => (
              <motion.div
                key={ingredient.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="bg-white rounded-[40px] border border-[var(--border-light)] p-10 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-[32px] flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:rotate-6 ${ingredient.type === 'stevia' ? 'bg-[#F0F4EF]' : 'bg-[#FDF7ED]'}`}>
                    {ingredient.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${ingredient.type === 'monk' ? 'bg-[#FDF7ED] text-[#9A3412] border-[#9A3412]/10' : 'bg-[#F0F4EF] text-[var(--green-primary)] border-[var(--green-primary)]/10'}`}>
                        {ingredient.tag}
                      </span>
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        {ingredient.origin}
                      </span>
                    </div>
                    
                    <h3 className="text-3xl font-[900] mb-4 uppercase tracking-tighter">{ingredient.name}</h3>
                    <p className="text-[var(--text-muted)] text-sm md:text-base font-medium leading-relaxed mb-8">
                      {ingredient.description}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ingredient.features.map((feat) => (
                        <div key={feat} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${ingredient.type === 'monk' ? 'bg-[#FDF7ED] text-[#9A3412]' : 'bg-[#F0F4EF] text-[var(--green-primary)]'}`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-[var(--text-heading)]">{feat}</span>
                        </div>
                      ))}
                    </div>
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

const LeafIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--green-primary)]"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a13 13 0 0 1-13 13L11 20z"></path><path d="M9 13c0 5 4 8 4 8"></path></svg>
);

const FruitIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#9A3412]"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
);

export default IngredientsSection;
