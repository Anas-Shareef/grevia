import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const BeyondSweetenersSection = () => {
  const categories = [
    {
      title: "Bakery Items",
      desc: "Freshly prepared, health-conscious baked goods made for everyday indulgence.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1200",
      link: "/collections/bakery",
      color: "from-black/60 to-transparent"
    },
    {
      title: "Pickles & Preserves",
      desc: "Traditional recipes crafted with natural ingredients and no artificial preservatives.",
      image: "https://images.unsplash.com/photo-1589135398309-1144e45194cd?auto=format&fit=crop&q=80&w=1200",
      link: "/collections/pickles",
      color: "from-black/60 to-transparent"
    }
  ];

  return (
    <section id="beyond-sweeteners" className="py-24 md:py-32 bg-white">
      <div className="container mx-auto px-6 md:px-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1a452e] tracking-tight mb-6"
          >
            Beyond Sweeteners
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#5a6e60] text-lg font-medium leading-relaxed max-w-2xl"
          >
            Crafted foods made with the same care, purity, and health-first philosophy as Grevia sweeteners. Thoughtfully prepared staples for your kitchen.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              className="relative group h-[400px] md:h-[500px] rounded-squircle-2xl overflow-hidden shadow-card cursor-pointer"
            >
              {/* Background Image */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-80 transition-opacity duration-500 group-hover:opacity-90`} />

              {/* Content */}
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {cat.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base font-medium max-w-sm mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                  {cat.desc}
                </p>
                
                <Link to={cat.link} className="inline-flex items-center gap-3 bg-[#A3E635] text-[#1a452e] font-bold px-8 py-4 rounded-full w-fit hover:bg-white transition-colors duration-300 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150 shadow-lg">
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeyondSweetenersSection;
