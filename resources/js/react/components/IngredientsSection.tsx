import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const IngredientsSection = () => {
  const ingredients = [
    {
      title: "Stevia",
      description: "Extracted from the leaves of the Stevia rebaudiana plant, native to South America. Used for centuries as a natural sweetener.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      sweetness: "200-300x sweeter than sugar",
      origin: "South America",
      benefits: [
        "Zero calories",
        "No blood sugar spike",
        "Suitable for diabetics",
        "Heat stable for cooking"
      ],
      animation: { x: -30 }
    },
    {
      title: "Monkfruit",
      description: "Also known as Luo Han Guo, this small melon has been used in traditional Chinese medicine for centuries.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      sweetness: "150-250x sweeter than sugar",
      origin: "Southeast Asia",
      benefits: [
        "Natural antioxidants",
        "Zero glycemic index",
        "No bitter aftertaste",
        "Keto approved"
      ],
      animation: { x: 30 }
    }
  ];

  return (
    <section id="ingredients" className="py-24 md:py-40 bg-background relative overflow-hidden" aria-labelledby="ingredients-heading">
      
      {/* Decorative Radial Depth */}
      <div className="absolute inset-0 bg-radial-grid opacity-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
        >
          <span className="inline-block text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-4">Ingredient Spotlight</span>
          <h2 id="ingredients-heading" className="text-4xl md:text-5xl font-black text-foreground leading-[1.1] mb-6 tracking-tight">
            Nature's Finest<br />
            Sweeteners
          </h2>
          <p className="text-lg md:text-xl text-foreground/60 font-medium leading-relaxed">
            Discover the powerful plants behind our pure, natural sweetness.
          </p>
        </motion.div>

        {/* Ingredients Group */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-6xl mx-auto">
          {ingredients.map((ingredient) => (
            <motion.article 
              key={ingredient.title}
              initial={{ opacity: 0, ...ingredient.animation }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(46,125,50,0.05)] border border-primary/5"
            >
              <div className="relative h-[300px] md:h-[350px]">
                <img 
                  src={ingredient.image} 
                  alt={ingredient.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
                  }}
                />
                <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tighter">{ingredient.title}</h3>
                </div>
              </div>

              <div className="p-8 md:p-12 -mt-6 relative">
                <p className="text-foreground/60 text-[16px] md:text-[17px] leading-relaxed mb-10 font-medium">
                  {ingredient.description}
                </p>

                {/* Insight Row */}
                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-background rounded-[20px] p-5 border border-primary/5">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.15em] block mb-1">Sweetness</span>
                    <p className="text-[14px] md:text-[15px] font-bold text-primary leading-tight">{ingredient.sweetness}</p>
                  </div>
                  <div className="bg-background rounded-[20px] p-5 border border-primary/5">
                    <span className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.15em] block mb-1">Origin</span>
                    <p className="text-[14px] md:text-[15px] font-bold text-primary leading-tight">{ingredient.origin}</p>
                  </div>
                </div>

                {/* Check List */}
                <ul className="space-y-4">
                  {ingredient.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-bold text-foreground/70">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Action Row */}
        <div className="text-center mt-16 md:mt-24">
          <Link 
            to="/#benefits"
            className="inline-flex items-center justify-center gap-2 px-10 h-16 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 group"
          >
            Learn More About Our Sourcing
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default IngredientsSection;
