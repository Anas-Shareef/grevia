import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, CheckCircle, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const ReviewsSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews?product_id=${productId}`);
      // Assuming response.data is the array of reviews if paginated
      setReviews(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    if (productId && productId !== "undefined") {
      fetchReviews();
    }
  }, [productId]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 5);
      setIsLoading(false);
    }, 600);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        product_id: productId,
        rating,
        title,
        comment,
      };

      if (!user) {
        payload.guest_name = guestName;
        payload.guest_email = guestEmail;
      }

      await api.post("/reviews", payload);
      toast.success("Review submitted! It will appear once approved by our team.");
      setIsModalOpen(false);
      // Reset form
      setRating(5);
      setTitle("");
      setComment("");
      setGuestName("");
      setGuestEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review. Please check your inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleReviews = reviews.slice(0, visibleCount);
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";

  return (
    <section className="py-12 bg-white relative overflow-hidden font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header & Write Review Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#2E4D31] mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex text-yellow-500">
                {[...Array(Math.round(Number(averageRating)) || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="font-bold text-gray-700">{averageRating} out of 5</span>
              <span className="text-gray-500 text-sm">Based on {reviews.length} reviews</span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2E4D31] hover:bg-[#1a3320] text-white px-8 py-4 rounded-[40px] font-bold tracking-wide transition-all shadow-md active:scale-95 w-full md:w-auto"
          >
            WRITE A REVIEW
          </button>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
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
                
                <h4 className="font-bold text-lg text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-700 text-base font-medium leading-relaxed mb-6 flex-1">
                  "{review.comment || review.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#2E4D31]/10 text-[#2E4D31] flex items-center justify-center font-black text-lg uppercase">
                    {(review.guest_name || review.user?.name || "G")[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#2E4D31]">{review.guest_name || review.user?.name || "Guest"}</div>
                    {/* Verified Badge */}
                    <div className="inline-flex items-center gap-1 mt-1 bg-[#77cb4d] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                      <CheckCircle className="w-3 h-3" />
                      {review.is_verified_purchase ? "Verified Customer" : "Verified Guest"}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[30px] w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#2E4D31] mb-6">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  
                  {!user && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Name *</label>
                        <input required value={guestName} onChange={e => setGuestName(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#77cb4d] outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                        <input required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#77cb4d] outline-none" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Rating *</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star className={`w-8 h-8 ${num <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="Summary of your experience" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#77cb4d] outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Review *</label>
                    <textarea required value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="What did you love about this product?" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#77cb4d] outline-none resize-none" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#2E4D31] hover:bg-[#1a3320] text-white px-8 py-4 rounded-[40px] font-bold tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default ReviewsSection;
