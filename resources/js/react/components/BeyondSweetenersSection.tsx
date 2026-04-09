import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const BeyondSweetenersSection = () => {
  const categories = [
    {
      title: "Bakery Items",
      description:
        "Freshly prepared baked goods made for everyday indulgence without the sugar spike.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      link: "/collections/bakery",
      delay: 0.1,
    },
    {
      title: "Pickles & Preserves",
      description:
        "Traditional recipes crafted with natural ingredients and no artificial preservatives.",
      image: "/build/assets/hero-bg-D-TWzogc.jpg",
      link: "/collections/pickles",
      delay: 0.2,
    },
  ];

  return (
    <section
      id="beyond-sweeteners"
      className="py-24 md:py-32 bg-background relative overflow-hidden"
      aria-labelledby="beyond-sweeteners-heading"
    >
      {/* Ambient background glows for airiness */}
      <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-primary/3 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/2 rounded-full blur-[100px] -z-10" />

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
            Explore More
          </span>
          <h2
            id="beyond-sweeteners-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-8"
          >
            Beyond
            <br />
            <span className="text-primary font-bold">Sweeteners</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Crafted foods made with the same health-first philosophy as Grevia
            sweeteners. Thoughtfully prepared items aligned with our clean-label
            standards.
          </p>
        </motion.div>

        {/* Categories Grid - High Fidelity Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {categories.map((cat) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: cat.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative h-[400px] md:h-[500px] bg-card rounded-squircle-2xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-700 border border-border/50"
            >
              {/* Foreground Image with Zoom */}
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Sophisticated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-white/80 font-medium mb-8 line-clamp-2 max-w-sm leading-relaxed">
                  {cat.description}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <Link
                    to={cat.link}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-lime text-foreground font-bold rounded-full shadow-lg hover:bg-lime-glow hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-14 px-8 text-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Move to Cart
                  </Link>
                  <button className="shrink-0 w-14 h-14 flex items-center justify-center rounded-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300 shadow-sm hover:shadow-md group/trash">
                    <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeyondSweetenersSection;
