import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Quote, CheckCircle, X, Camera, Video, ThumbsUp, 
  ChevronRight, Play, Image as ImageIcon, Upload, Plus
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const MediaThumbnail = ({ url, type }: { url: string, type: 'image' | 'video' }) => (
  <div className="relative group cursor-pointer aspect-square rounded-[12px] overflow-hidden border border-gray-100 bg-gray-50">
    {type === 'video' ? (
      <div className="w-full h-full flex items-center justify-center">
        <video src={url} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
          <Play className="w-6 h-6 text-white fill-current" />
        </div>
      </div>
    ) : (
      <img src={url} alt="Review" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
    )}
  </div>
);

const ReviewsSection = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoScrollRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{url: string, type: string}[]>([]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews?product_id=${productId}`);
      setReviews(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  useEffect(() => {
    if (productId && productId !== "undefined" && /^\d+$/.test(productId)) {
      fetchReviews();
    }
  }, [productId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentImages = files.filter(f => f.type.startsWith('image')).length;
      const currentVideos = files.filter(f => f.type.startsWith('video')).length;
      
      let newImages = 0;
      let newVideos = 0;
      const acceptedFiles: File[] = [];

      newFiles.forEach(file => {
        if (file.type.startsWith('image')) {
          if (currentImages + newImages < 3) {
            acceptedFiles.push(file);
            newImages++;
          } else {
            toast.error("Maximum 3 images allowed per review.");
          }
        } else if (file.type.startsWith('video')) {
          if (currentVideos + newVideos < 1) {
            acceptedFiles.push(file);
            newVideos++;
          } else {
            toast.error("Maximum 1 video allowed per review.");
          }
        }
      });

      if (acceptedFiles.length > 0) {
        setFiles(prev => [...prev, ...acceptedFiles]);
        const newPreviews = acceptedFiles.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type.startsWith('video') ? 'video' : 'image'
        }));
        setPreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const handleHelpful = async (reviewId: number) => {
    try {
      // In a real app, send to API
      // await api.post(`/reviews/${reviewId}/helpful`);
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r));
      toast.success("Thanks for your feedback!");
    } catch (e) {
      toast.error("Failed to update.");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('product_id', productId);
      formData.append('rating', String(rating));
      formData.append('title', title);
      formData.append('comment', comment);

      if (!user) {
        formData.append('guest_name', guestName);
        formData.append('guest_email', guestEmail);
      }

      files.forEach((file, i) => {
        formData.append(`media[${i}]`, file);
      });

      await api.post("/reviews", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success("Review submitted! Approval pending.", {
        style: { background: '#2E4D31', color: '#fff', borderRadius: '20px' }
      });
      setIsModalOpen(false);
      // Reset
      setRating(5); setTitle(""); setComment(""); setGuestName(""); setGuestEmail(""); setFiles([]); setPreviews([]);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract all media for the top carousel
  const allMedia = reviews.flatMap(r => {
    const images = (r.image_urls || []).map((url: string) => ({ url, type: 'image', review: r }));
    const video = r.video_url ? [{ url: r.video_url, type: 'video', review: r }] : [];
    return [...images, ...video];
  }).slice(0, 15);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "5.0";

  return (
    <section className="py-20 bg-white Montserrat">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* User Photos Carousel */}
        {allMedia.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[20px] font-bold text-[#2E4D31]">Real Experiences</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => photoScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#F8F5F0]"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <button 
                  onClick={() => photoScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-[#F8F5F0]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div 
              ref={photoScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
            >
              {allMedia.map((m, i) => (
                <div key={i} className="min-w-[160px] md:min-w-[200px] aspect-square snap-start">
                  <MediaThumbnail url={m.url} type={m.type as any} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-start justify-between mb-20 bg-[#F8F5F0] rounded-[32px] p-8 md:p-12 border border-[#E5E7EB]">
          <div className="w-full lg:w-1/3">
            <h2 className="text-4xl md:text-5xl font-black text-[#2E4D31] mb-4">Reviews</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-[48px] font-black text-[#2E4D31]">{averageRating}</div>
              <div>
                <div className="flex text-[#F59E0B]">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(Number(averageRating)) ? 'fill-current' : ''}`} />)}
                </div>
                <div className="text-sm font-bold text-gray-500">Based on {reviews.length} reviews</div>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto h-14 bg-[#2E4D31] hover:bg-[#1a3320] text-white px-10 rounded-full font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#2E4D31]/20 active:scale-95"
            >
              Write a Review
            </button>
          </div>

          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trust Points */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EAF2EB] flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#2E4D31]" /></div>
                <span className="font-bold text-[#2E4D31] text-sm">100% Genuine Reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EAF2EB] flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#2E4D31]" /></div>
                <span className="font-bold text-[#2E4D31] text-sm">Verified Purchases</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EAF2EB] flex items-center justify-center"><CheckCircle className="w-4 h-4 text-[#2E4D31]" /></div>
                <span className="font-bold text-[#2E4D31] text-sm">No Artificial Sweeteners</span>
              </div>
            </div>
            
            {/* Rating Breakdown Bar (Mock) */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(r => (
                <div key={r} className="flex items-center gap-3">
                  <span className="text-[12px] font-bold w-4">{r}★</span>
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-[#77CB4D]" style={{ width: r === 5 ? '80%' : r === 4 ? '15%' : '2%' }} />
                  </div>
                  <span className="text-[12px] font-bold text-gray-400 w-8">{r === 5 ? '80%' : r === 4 ? '15%' : '2%'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-[#F8F5F0]/50 rounded-[24px] border border-dashed border-[#E5E7EB]">
            <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">Be the first to share your thoughts on this product.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {reviews.slice(0, visibleCount).map((review, i) => (
                <motion.div
                  key={review.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[24px] p-8 border border-[#E5E7EB] hover:shadow-xl transition-all duration-500 relative flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex text-[#F59E0B]">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'fill-current' : ''}`} />)}
                    </div>
                    <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h4 className="font-bold text-[18px] text-[#2E4D31] mb-3">{review.title}</h4>
                  <p className="text-gray-600 text-[15px] font-medium leading-relaxed mb-6 flex-1 italic">
                    "{review.comment || review.text}"
                  </p>

                  {/* Review Media */}
                  {(review.image_urls?.length > 0 || review.video_url) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {review.image_urls?.map((url: string, idx: number) => (
                        <div key={idx} className="w-16 h-16 rounded-[12px] overflow-hidden border border-gray-100">
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {review.video_url && (
                        <div className="w-16 h-16 rounded-[12px] overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
                          <Play className="w-4 h-4 text-[#2E4D31]" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F0FAE8] text-[#2E4D31] flex items-center justify-center font-black text-sm uppercase border border-[#EAF2EB]">
                        {(review.guest_name || review.user?.name || "G")[0]}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#2E4D31]">{review.guest_name || review.user?.name || "Guest"}</div>
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-[#77CB4D] uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" />
                          {review.is_verified_purchase ? "Verified Buyer" : "Verified Review"}
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleHelpful(review.id)}
                      className="flex items-center gap-2 text-[12px] font-bold text-gray-400 hover:text-[#2E4D31] transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Helpful ({review.helpful_count || 0})
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {visibleCount < reviews.length && (
              <div className="flex justify-center">
                <button 
                  onClick={() => setVisibleCount(v => v + 4)}
                  className="h-12 px-10 rounded-full border-2 border-[#2E4D31] text-[#2E4D31] font-bold text-[13px] uppercase tracking-widest hover:bg-[#2E4D31] hover:text-white transition-all"
                >
                  View All Reviews
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E4D31]/20 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-gray-400 hover:text-[#2E4D31] transition-all"><X className="w-6 h-6" /></button>
              
              <div className="p-10 md:p-12">
                <h3 className="text-3xl font-black text-[#2E4D31] mb-2">Write a Review</h3>
                <p className="text-gray-400 font-bold text-sm mb-10">Share your sweet experience with the Grevia community.</p>
                
                <form onSubmit={handleSubmitReview} className="space-y-8">
                  <div className="flex flex-col items-center p-6 bg-[#F8F5F0] rounded-[24px] border-2 border-dashed border-[#E5E7EB]">
                    <div className="text-sm font-black text-[#2E4D31] uppercase tracking-widest mb-4">Overall Rating</div>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button key={num} type="button" onClick={() => setRating(num)} className="hover:scale-125 transition-transform">
                          <Star className={`w-10 h-10 ${num <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-[#2E4D31] uppercase tracking-widest">Headline</label>
                      <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Best Stevia I've tried!" className="w-full h-14 px-6 rounded-full bg-[#F8F5F0] border-transparent focus:bg-white focus:border-[#77CB4D] outline-none font-bold text-[15px] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black text-[#2E4D31] uppercase tracking-widest">Email Address</label>
                      <input required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} type="email" placeholder="for verification only" className="w-full h-14 px-6 rounded-full bg-[#F8F5F0] border-transparent focus:bg-white focus:border-[#77CB4D] outline-none font-bold text-[15px] transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#2E4D31] uppercase tracking-widest">Your Experience</label>
                    <textarea required value={comment} onChange={e => setComment(e.target.value)} rows={4} placeholder="Tell us what you loved..." className="w-full p-6 rounded-[24px] bg-[#F8F5F0] border-transparent focus:bg-white focus:border-[#77CB4D] outline-none font-bold text-[15px] transition-all resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black text-[#2E4D31] uppercase tracking-widest">Photos & Video</label>
                    <div className="flex flex-wrap gap-4">
                      {previews.map((p, i) => (
                        <div key={i} className="w-20 h-20 rounded-[16px] overflow-hidden relative group">
                          {p.type === 'video' ? <div className="w-full h-full bg-black flex items-center justify-center"><Video className="w-6 h-6 text-white" /></div> : <img src={p.url} className="w-full h-full object-cover" />}
                          <button type="button" onClick={() => {
                            setFiles(files.filter((_, idx) => idx !== i));
                            setPreviews(previews.filter((_, idx) => idx !== i));
                          }} className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X className="w-5 h-5 text-white" /></button>
                        </div>
                      ))}
                      <label className="w-20 h-20 rounded-[16px] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8F5F0] transition-colors">
                        <Plus className="w-6 h-6 text-gray-400" />
                        <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-[#2E4D31] hover:bg-[#1a3320] text-white rounded-full font-black text-[14px] uppercase tracking-[2px] transition-all shadow-xl shadow-[#2E4D31]/20 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Post Review"}
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
