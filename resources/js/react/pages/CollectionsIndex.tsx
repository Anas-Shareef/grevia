import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// We map out the predefined dynamic collections utilizing the Smart Routing Slugs
const COLLECTIONS = [
  {
    title: "Stevia Products",
    slug: "stevia-products", 
    image: "https://grevia.in/storage/categories/stevia-mockup.png", 
    comingSoon: false,
  },
  {
    title: "Monk Fruit Products",
    slug: "monk-fruit-products", 
    image: "https://grevia.in/storage/categories/monkfruit-mockup.png",
    comingSoon: false,
  },
  {
    title: "Healthy Snacks & Pantry",
    slug: "healthy-snacks-pantry", 
    image: "https://grevia.in/storage/categories/snacks-mockup.png",
    comingSoon: false,
  },
  {
    title: "Superfood Powders",
    slug: "#", 
    image: "https://grevia.in/storage/categories/superfood-mockup.png",
    comingSoon: true,
  },
  {
    title: "Functional Drink Mixes",
    slug: "#", 
    image: "https://grevia.in/storage/categories/drinks-mockup.png",
    comingSoon: true,
  }
];

export default function CollectionsIndex() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      
      {/* 
        Spacing offset for the fixed header. 
        Main content container mimics a rich visually-led shopping experience.
      */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 md:px-8 py-32">
        
        {/* Typographical Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
            Guilt-Free Essentials
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
            Discover our entire ecosystem of natural sweeteners, zero-calorie alternatives, and pantry essentials seamlessly categorized for your lifestyle.
          </p>
        </div>

        {/* 3 Column Desktop, 1 Column Mobile Framework */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          
          {COLLECTIONS.map((c, i) => {
            const innerContent = (
              // The CREAMS Aesthetic wrapper (Off-white Bone background #f4f4eb or #fafaf2)
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group aspect-[3/4] md:aspect-[4/5] bg-[#fafaf2] overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col justify-center items-center p-8 border border-black/5"
              >
                {/* 
                  Drop Shadowed Imagery (Zoom/Brightness on Hover)
                  mix-blend-multiply ensures white product backgrounds blend smoothly into the bone aesthetic.
                */}
                <div className="absolute inset-0 w-full h-full p-8 md:p-12 mix-blend-multiply flex items-center justify-center">
                    <img 
                      src={c.image} 
                      onError={(e) => { 
                        e.currentTarget.src = `https://placehold.co/600x800/f4f4eb/94a3b8?text=${encodeURIComponent(c.title)}`; 
                      }}
                      alt={c.title}
                      className="w-full h-full object-contain group-hover:scale-110 group-hover:brightness-105 transition-all duration-1000 ease-out drop-shadow-2xl"
                    />
                </div>
                
                {/* "Coming Soon" Subtly Embedded Flag */}
                {c.comingSoon && (
                  <div className="absolute top-6 right-6 bg-black text-white text-[10px] uppercase font-black tracking-widest px-4 py-2 opacity-90 z-20 shadow-lg">
                    COMING SOON
                  </div>
                )}

                {/* 
                  Centered White Rectangular Box Labeling (Montserrat/Jost Inspired)
                */}
                <div className="absolute bottom-12 z-20">
                  <div className="bg-white px-8 md:px-10 py-4 shadow-md transition-transform duration-500 group-hover:-translate-y-3">
                    <h2 className="text-sm md:text-base font-black tracking-[0.2em] uppercase text-slate-900 text-center whitespace-nowrap">
                      {c.title}
                    </h2>
                  </div>
                </div>

                {/* Subtle base gradient for box legibility if images are too light */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/5 to-transparent z-10 pointer-events-none opacity-50" />
              </motion.div>
            );

            // Conditional Wrapping Routing based on Development Lifecycle
            if (c.comingSoon) {
              return (
                <div 
                  key={i} 
                  onClick={() => alert("This product line is currently in development! Sign up for our newsletter on the home page to get early access on launch day.")}
                >
                  {innerContent}
                </div>
              );
            }

            return (
              <Link to={`/collections/${c.slug}`} key={i} className="block">
                {innerContent}
              </Link>
            );
          })}

        </div>
      </main>

      <Footer />
    </div>
  );
}
