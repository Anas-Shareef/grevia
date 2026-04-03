import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BeyondSweetenersSection = () => {
  const categories = [
    {
      title: "Bakery Items",
      description: "Freshly prepared baked goods made for everyday indulgence without the sugar spike.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      link: "/collections/bakery",
      delay: 0.1
    },
    {
      title: "Pickles & Preserves",
      description: "Traditional recipes crafted with natural ingredients and no artificial preservatives.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      link: "/collections/pickles",
      delay: 0.2
    }
  ];

  return (
    <section id="beyond-sweeteners" className="py-24 md:py-40 bg-background relative overflow-hidden" aria-labelledby="beyond-sweeteners-heading">
      
      {/* Background Orbs for 'airy' feel */}
      <div className="absolute top-1/2 left-[-10%] w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-[20%] right-[-5%] w-[25%] h-[25%] bg-primary/2 rounded-full blur-[80px] -z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 md:mb-24"
        >
          <span className="inline-block text-[11px] font-black text-primary/60 uppercase tracking-[0.25em] mb-4">Explore More</span>
          <h2 id="beyond-sweeteners-heading" className="text-4xl md:text-5xl font-black text-foreground leading-tight tracking-tight mb-8">
            Beyond<br />
            <span className="text-primary font-bold">Sweeteners</span>
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed font-medium">
            Crafted foods made with the same health-first philosophy as Grevia sweeteners. 
            Thoughtfully prepared items aligned with our clean-label standards.
          </p>
        </motion.div>

        {/* Categories Grid - 2 Big Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <motion.div 
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: cat.delay, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-[400px] md:h-[500px] bg-white rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(46,125,50,0.06)] hover:shadow-[0_20px_50px_rgba(46,125,50,0.15)] hover:-translate-y-2 transition-all duration-700 border border-primary/5"
            >
              {/* Foreground Image */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/20 to-transparent opacity-80" />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">{cat.title}</h3>
                <p className="text-white/70 font-medium mb-8 line-clamp-2 max-w-sm">
                  {cat.description}
                </p>
                <Link 
                  to={cat.link}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-forest-light hover:shadow-xl hover:translate-x-2 transition-all duration-300 h-12 px-8 text-sm group/btn"
                >
                  Explore Products
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
