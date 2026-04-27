import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, Star, Heart, Check, Truck, RotateCcw, 
  Info, ChevronRight, Minus, Plus, ChevronDown, 
  Award, Shield, Zap, Activity, Leaf, Camera, Video
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import { ProductCard } from "@/components/ProductCard";

// --- Components ---

const TrustChip = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-2 bg-[#F0FAE8] border border-[#77CB4D] rounded-full px-3 py-1.5 transition-all hover:bg-[#EAF2EB]">
    <Icon className="w-4 h-4 text-[#2E4D31]" />
    <span className="text-xs font-bold text-[#2E4D31] Montserrat whitespace-nowrap">{text}</span>
  </div>
);

const BenefitChip = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-1.5 bg-[#F0FAE8] border border-[#77CB4D] rounded-full px-3 py-1 transition-all hover:shadow-sm">
    <Icon className="w-3.5 h-3.5 text-[#2E4D31]" />
    <span className="text-[11px] font-bold text-[#2E4D31] Montserrat uppercase tracking-wider">{text}</span>
  </div>
);

const AccordionItem = ({ title, children, defaultOpen = false, icon: Icon }: { title: string, children: React.ReactNode, defaultOpen?: boolean, icon?: any }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`mb-3 border transition-all duration-300 rounded-[16px] overflow-hidden ${isOpen ? 'border-[#2E4D31] bg-white shadow-sm' : 'border-[#E5E7EB] bg-[#F8F5F0]'}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left px-5 py-4 group"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-[#2E4D31]" />}
          <span className="font-bold text-[15px] text-[#2E4D31] Montserrat">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#2E4D31]' : 'group-hover:text-[#2E4D31]'}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 text-[#313131] font-medium text-[14px] leading-[1.7] Montserrat">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubstitutionTip = ({ ratio }: { ratio: string }) => {
  const x = ratio.split(':')[1] || '10';
  return (
    <motion.div 
      key={ratio}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-[20px] bg-[#F0FAE8] border-[1.5px] border-[#77CB4D] flex gap-3 items-center"
    >
      <Leaf className="w-4 h-4 text-[#2E4D31] flex-shrink-0" />
      <p className="text-[14px] font-semibold text-[#2E4D31] Montserrat">
        1g replaces {x}g of sugar
      </p>
    </motion.div>
  );
};

// --- Main Page ---

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProductsResponse } = useProducts();
  const allProducts: Product[] = Array.isArray(allProductsResponse)
    ? allProductsResponse
    : (allProductsResponse as any)?.data || [];

  const [selectedRatio, setSelectedRatio] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isScrolledPastCart, setIsScrolledPastCart] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.concentration) setSelectedRatio(product.concentration);
      else if (product.ratio) setSelectedRatio(product.ratio);
      else setSelectedRatio('1:10');
      
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      const cartBtn = document.getElementById('main-add-to-cart');
      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        setIsScrolledPastCart(rect.top < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen Montserrat">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="flex flex-col lg:flex-row gap-12 animate-pulse">
            <div className="aspect-square w-full lg:w-1/2 rounded-[24px] bg-[#F8F5F0]" />
            <div className="space-y-6 w-full lg:w-1/2">
              <div className="h-4 w-32 bg-gray-100 rounded-full" />
              <div className="h-10 w-3/4 bg-gray-100 rounded-[20px]" />
              <div className="h-24 w-full bg-gray-100 rounded-[24px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen Montserrat">
        <Header />
        <div className="container mx-auto px-4 pt-48 pb-32 text-center">
          <div className="w-24 h-24 bg-[#F0FAE8] rounded-full flex items-center justify-center mx-auto mb-8">
            <Leaf className="w-12 h-12 text-[#2E4D31]" />
          </div>
          <h2 className="text-3xl font-bold text-[#2E4D31] mb-6">Product not found</h2>
          <Link to="/collections/all" className="inline-flex items-center justify-center bg-[#2E4D31] text-white h-14 px-10 rounded-full font-bold transition-all hover:bg-[#1a3320]">
            Browse All Collections
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const concentrationOptions = product.concentration_options || ['1:10', '1:50', '1:100', '1:200'];
  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const originalPrice = selectedVariant?.discount_price ? selectedVariant.price : product.original_price;
  const discountPercent = originalPrice && displayPrice ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
  const wishlisted = isInWishlist(String(product.id));

  const galleryImages = (product.gallery && product.gallery.length > 0)
    ? product.gallery.map(g => g.url)
    : [product.image].filter(Boolean);
  
  const mainImageUrl = galleryImages[selectedThumb] || product.image;

  const handleAddToCart = () => {
    const variantId = selectedVariant?.id || product.variants?.[0]?.id;
    addToCart(product, quantity, variantId);
    toast.success(`${product.name} Added!`, { 
      style: { background: '#2E4D31', color: '#fff', borderRadius: '40px' },
      icon: <Check className="w-4 h-4" />
    });
  };

  const toggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(String(product.id));
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist ❤️');
    }
  };

  const relatedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 8);

  return (
    <div className="bg-white min-h-screen text-[#313131] Montserrat">
      <Header />

      <main className="container mx-auto px-4 md:px-8 max-w-screen-2xl pt-28 md:pt-36 pb-20">
        {/* Breadcrumb - Desktop Only */}
        <nav className="hidden lg:flex items-center gap-2 mb-10 text-[12px] font-semibold text-gray-400" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#77CB4D]">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/collections/all" className="hover:text-[#77CB4D]">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#2E4D31]">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Image Gallery (Sticky on Desktop) */}
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-36 self-start">
            <div className="relative flex-1 aspect-square rounded-[24px] overflow-hidden bg-[#F8F5F0] group">
              {product.badge && (
                <div className="absolute top-6 left-6 bg-[#F59E0B] text-white px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full z-10 shadow-sm Montserrat">
                  {product.badge}
                </div>
              )}
              <button 
                onClick={toggleWishlist}
                className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-white/50 z-10 transition-all hover:scale-110 active:scale-95"
              >
                <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.img 
                  key={mainImageUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={mainImageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                />
              </AnimatePresence>
            </div>
            
            {/* Thumbnails (Vertical on Desktop) */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-hide snap-x lg:w-[72px]">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedThumb(idx)}
                  className={`flex-shrink-0 w-[72px] h-[72px] rounded-[10px] border-[2.5px] transition-all overflow-hidden bg-[#F8F5F0] snap-center ${selectedThumb === idx ? 'border-[#2E4D31] shadow-md' : 'border-transparent hover:border-[#77CB4D]'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex text-[#F59E0B]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 5) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-[13px] font-bold text-gray-500">{(product.rating || 5).toFixed(1)} / 5.0 ({product.reviews_count || 12} reviews)</span>
            </div>

            <h1 className="text-[28px] md:text-[36px] font-bold text-[#2E4D31] mb-6 leading-[1.1] Montserrat">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[30px] md:text-[36px] font-extrabold text-[#2E4D31]">₹{displayPrice}</span>
              {originalPrice && originalPrice > displayPrice && (
                <>
                  <span className="text-[20px] text-gray-400 line-through">₹{originalPrice}</span>
                  <span className="bg-[#F59E0B] text-white px-3 py-1 rounded-full text-[12px] font-bold Montserrat">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            {/* Benefit Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              <BenefitChip icon={Zap} text="Keto-Friendly" />
              <BenefitChip icon={Activity} text="Zero-Glycemic" />
              <BenefitChip icon={Award} text="100% Organic" />
              <BenefitChip icon={Shield} text="Diabetic-Safe" />
            </div>

            {/* Concentration Selector */}
            {concentrationOptions.length > 0 && (
              <div className="mb-8">
                <label className="text-[12px] font-bold text-[#1F2937] uppercase tracking-wider mb-4 block Montserrat">Concentration / Potency</label>
                <div className="flex flex-wrap gap-2.5">
                  {concentrationOptions.map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedRatio(r)}
                      className={`h-11 px-6 rounded-[24px] font-bold text-[13px] border-2 transition-all Montserrat ${selectedRatio === r ? 'bg-[#EAF2EB] text-[#2E4D31] border-[#2E4D31] shadow-sm' : 'bg-white text-[#313131] border-[#E5E7EB] hover:border-[#2E4D31] hover:bg-[#F0FAE8]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <SubstitutionTip ratio={selectedRatio} />
              </div>
            )}

            {/* Pack Size Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <label className="text-[12px] font-bold text-[#1F2937] uppercase tracking-wider mb-4 block Montserrat">Select Pack Size</label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`h-11 px-6 rounded-[24px] font-bold text-[13px] border-2 transition-all Montserrat ${selectedVariant?.id === v.id ? 'bg-[#EAF2EB] text-[#2E4D31] border-[#2E4D31] shadow-sm' : 'bg-white text-[#313131] border-[#E5E7EB] hover:border-[#2E4D31] hover:bg-[#F0FAE8]'}`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Box */}
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#F8F5F0] rounded-full p-1.5 border border-[#E5E7EB]">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                    className="w-10 h-10 flex items-center justify-center hover:bg-white transition-all rounded-full text-[#2E4D31]"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-[16px] Montserrat">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)} 
                    className="w-10 h-10 flex items-center justify-center hover:bg-white transition-all rounded-full text-[#2E4D31]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  id="main-add-to-cart"
                  onClick={handleAddToCart} 
                  className="flex-1 h-14 bg-[#77CB4D] hover:bg-[#5fb33a] text-white rounded-full flex items-center justify-center gap-3 font-bold text-[14px] uppercase Montserrat transition-all active:scale-[0.98] shadow-lg shadow-[#77CB4D]/25"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-3 mt-2">
                <TrustChip icon={Truck} text="Free Shipping above ₹499" />
                <TrustChip icon={RotateCcw} text="7-Day Hassle-Free Returns" />
                <TrustChip icon={Award} text="100% Organic Certified" />
              </div>
            </div>
            
            {/* Accordions */}
            <div className="space-y-1">
              <AccordionItem title="Product Story" defaultOpen={true} icon={Leaf}>
                <div 
                  className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: product.product_description || product.description || "Experience the pure taste of nature with Grevia's premium sweetener." }} 
                />
              </AccordionItem>
              
              <AccordionItem title="Ingredients" icon={Info}>
                <div 
                  className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: product.ingredients || "Organic Stevia Leaf Extract, Purified Water." }} 
                />
              </AccordionItem>
              
              <AccordionItem title="How to Use" icon={Check}>
                <div 
                  className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed" 
                  dangerouslySetInnerHTML={{ __html: product.usage_instructions || "Add 2-3 drops to your coffee or tea. Stir and enjoy!" }} 
                />
              </AccordionItem>
              
              <AccordionItem title="Shipping & Returns" icon={Truck}>
                <p>Standard delivery takes 3-5 business days. We offer free shipping on orders above ₹499. Returns accepted within 7 days for unopened products.</p>
              </AccordionItem>
            </div>

          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <div className="mt-24 border-t border-[#E5E7EB] pt-20">
           <ReviewsSection productId={String(product.id)} />
        </div>

        {/* Related Products Slider */}
        <div className="mt-24 overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[24px] font-bold text-[#2E4D31] Montserrat">You May Also Like</h2>
            <div className="hidden md:flex gap-3">
              <button 
                onClick={() => scrollContainerRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:border-[#2E4D31] hover:text-[#2E4D31] transition-all bg-white"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button 
                onClick={() => scrollContainerRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                className="w-10 h-10 rounded-full border border-[#E5E7EB] flex items-center justify-center hover:border-[#2E4D31] hover:text-[#2E4D31] transition-all bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-12 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            {relatedProducts.map(p => (
              <div key={p.id} className="min-w-[260px] sm:min-w-[300px] w-full max-w-[320px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          
          {/* Custom Scroll Progress Bar */}
          <div className="w-full h-1 bg-[#E5E7EB] rounded-full max-w-xs mx-auto -mt-4 overflow-hidden">
            <motion.div 
              className="h-full bg-[#2E4D31]" 
              style={{ width: '30%' }} // Note: In real app, calculate scroll progress
            />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Add to Cart */}
      <AnimatePresence>
        {isScrolledPastCart && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-[#E5E7EB] z-50 flex lg:hidden items-center justify-between px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-gray-400 line-clamp-1">{product.name}</span>
              <span className="text-[18px] font-extrabold text-[#2E4D31]">₹{displayPrice}</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="h-12 px-8 bg-[#2E4D31] text-white rounded-full font-bold text-[14px] Montserrat active:scale-95 transition-all shadow-lg"
            >
              Add to Cart
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Global CSS for Montserrat and scrollbar-hide */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
        .Montserrat { font-family: 'Montserrat', sans-serif !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default ProductDetailPage;
