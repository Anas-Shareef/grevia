import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  card_description: string;
  card_image_full_url: string;
  availability_status: 'active' | 'coming_soon' | 'hidden';
  overlay_density: number;
}

const EditorialCard = ({ category, index }: { category: Category, index: number }) => {
  const density = (category.overlay_density ?? 72) / 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative h-[450px] md:h-[500px] bg-[#1a2a1e] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-soft hover:shadow-card transition-all duration-700"
    >
      {/* Editorial Background Image */}
      <img
        src={category.card_image_full_url || 'https://images.unsplash.com/photo-1502741126161-b048400d085d?q=80&w=2000&auto=format&fit=crop'}
        alt={category.name}
        onError={(e) => {
          e.currentTarget.src = 'https://images.unsplash.com/photo-1502741126161-b048400d085d?q=80&w=2000&auto=format&fit=crop';
          e.currentTarget.onerror = null;
        }}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* 5-Stop Premium Gradient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 20%,
            rgba(0, 0, 0, ${0.18 * density / 0.72}) 45%,
            rgba(0, 0, 0, ${0.60 * density / 0.72}) 70%,
            rgba(0, 0, 0, ${0.78 * density / 0.72}) 100%
          )`
        }}
      />

      {/* Editorial Content block */}
      <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 z-10 font-['Montserrat']">
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight tracking-[-0.01em] max-w-[80%] md:max-w-[60%]">
          {category.name}
        </h3>
        <p className="text-white/88 font-medium mb-8 line-clamp-2 max-w-[85%] md:max-w-[55%] leading-relaxed text-sm md:text-base">
          {category.card_description || 'Thoughtfully prepared items aligned with our clean-label standards.'}
        </p>
        <div className="mt-8">
          <Link
            to={`/collections?category=${category.slug}`}
            className="inline-flex items-center justify-center gap-3 border-2 border-white/92 text-white font-bold rounded-full hover:bg-white hover:text-[#2E4D31] transition-all duration-300 h-14 px-10 text-[14px] tracking-wide"
          >
            Explore Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const BeyondSweetenersSection = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(data => {
        // We pick specific categories for the homepage or just the first few
        // For now, let's show categories that aren't the primary sweeteners if possible, 
        // or just the first 2 editorial-ready categories.
        const editorialReady = data.filter((c: any) => 
          c.availability_status === 'active' && 
          !c.slug.includes('stevia') && 
          !c.slug.includes('monk')
        );
        setCategories(editorialReady.slice(0, 2));
      })
      .catch(err => console.error("Failed to fetch home categories:", err));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section
      id="beyond-sweeteners"
      className="py-24 md:py-32 bg-[#FDFDF7] relative overflow-hidden"
      aria-labelledby="beyond-sweeteners-heading"
    >
      {/* Soft atmospheric glows */}
      <div className="absolute top-1/2 left-[-10%] w-[40%] h-[40%] bg-[#77cb4d]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-[#2E4D31]/3 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <span className="font-['Montserrat'] text-[10px] font-black uppercase tracking-[0.3em] text-[#77cb4d] mb-4 inline-block">
            Explore More
          </span>
          <h2
            id="beyond-sweeteners-heading"
            className="font-['Montserrat'] text-4xl md:text-5xl lg:text-6xl font-black text-[#2E4D31] leading-tight mb-8"
          >
            Beyond
            <br />
            <span className="font-bold text-[#77cb4d]">Sweeteners</span>
          </h2>
          <p className="font-['Montserrat'] text-lg text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed opacity-80">
            Crafted foods made with the same health-first philosophy as Grevia
            sweeteners. Thoughtfully prepared items aligned with our clean-label
            standards.
          </p>
        </motion.div>

        {/* Categories Grid - Editorial High Fidelity Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <EditorialCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeyondSweetenersSection;
