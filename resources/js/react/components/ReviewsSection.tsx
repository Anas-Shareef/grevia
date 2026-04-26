import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle } from "lucide-react";

// In a real app, this would be fetched from an API
const mockReviews = [
  {
    name: "Ananya R.",
    role: "Verified Customer",
    text: "Grevia has completely changed my baking game. No bitter aftertaste and my blood sugar stays perfectly level. It's a miracle sweetener!",
    rating: 5,
    avatar: "A"
  },
  {
    name: "Dr. Vikram K.",
    role: "Verified Guest",
    text: "As a nutritionist, I highly recommend Grevia to my patients. It's the cleanest extraction of Stevia I've found on the Indian market.",
    rating: 5,
    avatar: "V"
  },
  {
    name: "Sneha M.",
    role: "Verified Customer",
    text: "The 1:10 ratio makes it so easy to replace sugar in my recipes. My family can't even tell the difference. Simply the best!",
    rating: 5,
    avatar: "S"
  },
  {
    name: "Rahul T.",
    role: "Verified Customer",
    text: "Great taste in coffee! Finally found something that doesn't taste like chemicals.",
    rating: 4,
    avatar: "R"
  },
  {
    name: "Priya S.",
    role: "Verified Guest",
    text: "Loved the monk fruit variant. Excellent quality.",
    rating: 5,
    avatar: "P"
  },
  {
    name: "Karan D.",
    role: "Verified Customer",
    text: "Good product, but the delivery took a bit longer than expected.",
    rating: 4,
    avatar: "K"
  }
];

const ReviewsSection = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate AJAX fetch
    setReviews(mockReviews);
  }, [productId]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 5);
      setIsLoading(false);
    }, 600);
  };

  const visibleReviews = reviews.slice(0, visibleCount);

  return (
    <section className="py-12 bg-white relative overflow-hidden font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header & Write Review Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2E4D31] mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-700">4.8 out of 5</span>
              <span className="text-gray-500 text-sm">Based on {reviews.length} reviews</span>
            </div>
          </div>
          
          <button className="bg-[#2E4D31] hover:bg-[#1a3320] text-white px-8 py-4 rounded-[40px] font-bold tracking-wide transition-all shadow-md active:scale-95 w-full md:w-auto">
            WRITE A REVIEW
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {visibleReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-[30px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative flex flex-col h-full"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              
              <p className="text-gray-700 text-base font-medium leading-relaxed mb-6 flex-1">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-[#2E4D31]/10 text-[#2E4D31] flex items-center justify-center font-black text-lg">
                  {review.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#2E4D31]">{review.name}</div>
                  {/* Verified Badge */}
                  <div className="inline-flex items-center gap-1 mt-1 bg-[#77cb4d] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    <CheckCircle className="w-3 h-3" />
                    {review.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < reviews.length && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="border-2 border-[#2E4D31] text-[#2E4D31] hover:bg-[#2E4D31] hover:text-white px-10 py-3 rounded-[30px] font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load More Reviews"}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewsSection;
