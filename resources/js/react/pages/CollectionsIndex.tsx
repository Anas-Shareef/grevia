import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

const CollectionCard = ({ category, index }: { category: Category, index: number }) => {
  const isActive = category.availability_status === 'active';
  const density = (category.overlay_density ?? 72) / 100;
  
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className={`relative overflow-hidden group h-[350px] md:h-[400px] lg:h-[500px] rounded-[20px] md:rounded-[30px] lg:rounded-[40px] bg-[#1a2a1e] ${
        !isActive ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      {/* Background Image with Hover Scale */}
      <img
        src={category.card_image_full_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop'}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale(1.04)"
        loading="lazy"
      />

      {/* 5-Stop Gradient Overlay (PRD Spec) */}
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
        } as any}
      />

      {/* Content Block */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 z-10 flex flex-col items-start font-['Montserrat']">
        <h3 className="text-2xl md:text-3xl lg:text-[32px] font-black text-white mb-2 md:mb-3 leading-[1.15] tracking-[-0.01em] max-w-[80%] md:max-w-[65%] lg:max-w-[60%]">
          {category.name}
        </h3>
        
        <p className="text-sm md:text-[14px] lg:text-[15px] font-medium text-white/90 mb-6 md:mb-8 leading-relaxed max-w-[85%] md:max-w-[70%] lg:max-w-[55%] line-clamp-2 italic md:not-italic">
          {category.card_description || 'Experience the pure taste of nature with our curated selection.'}
        </p>

        {isActive ? (
          <div className="inline-flex items-center gap-3 px-6 py-3 border-[1.5px] border-white/90 rounded-full text-white text-[13px] md:text-[14px] font-bold tracking-wide transition-all duration-300 group-hover:bg-white group-hover:text-[#2E4D31] group-hover:border-white">
            Explore Products
            <span className="text-lg leading-none">→</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/10 border-[1.5px] border-white/30 rounded-full text-white/70 text-[12px] md:text-[13px] font-bold tracking-[0.04em] pointer-events-none backdrop-blur-sm">
             Coming Soon
          </div>
        )}
      </div>
    </motion.div>
  );

  if (isActive) {
    return (
      <Link 
        to={`/collections?category=${category.slug}`}
        className="block h-full"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default function CollectionsIndex() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(data => {
        // Only top-level categories that aren't hidden
        setCategories(data.filter((c: any) => c.availability_status !== 'hidden'));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch collections:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDF7] flex flex-col selection:bg-[#2E4D31] selection:text-white">
      <Header />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        
        {/* Editorial Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-24 space-y-6">
          <h1 className="font-['Montserrat'] text-4xl md:text-[36px] font-black text-[#2E4D31] tracking-tight leading-tight">
            Guilt-Free Essentials
          </h1>
          <div className="w-16 h-1 bg-[#77cb4d]/30 mx-auto rounded-full" />
          <p className="font-['Montserrat'] text-[#4A4A4A] text-base md:text-lg leading-relaxed opacity-80">
            Discover our entire ecosystem of natural sweeteners, zero-calorie alternatives, and pantry essentials seamlessly categorized for your lifestyle.
          </p>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <AnimatePresence mode="wait">
            {loading ? (
              [1, 2, 3, 4].map((n) => (
                <div key={n} className="aspect-[1.75/1] bg-slate-100 animate-pulse rounded-[40px]" />
              ))
            ) : (
              categories.map((c, i) => (
                <div 
                  key={c.id} 
                  className={`${
                    categories.length % 2 !== 0 && i === categories.length - 1 
                      ? 'md:col-span-2 md:max-w-[700px] md:mx-auto w-full' 
                      : ''
                  }`}
                >
                  <CollectionCard category={c} index={i} />
                </div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
