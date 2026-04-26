import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Heart, Check, Truck, RotateCcw, Info, ChevronRight, Minus, Plus, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import { ProductCard } from "@/components/ProductCard";

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-left font-bold text-lg text-[#2E4D31]">
        {title}
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pt-4 text-gray-600 font-medium">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProductsResponse } = useProducts();
  const allProducts: Product[] = Array.isArray(allProductsResponse)
    ? allProductsResponse
    : (allProductsResponse as any)?.data || [];

  const [selectedRatio, setSelectedRatio] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      if (product.ratio) setSelectedRatio(product.ratio);
      else setSelectedRatio('1:10'); // Default
      
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen font-sans" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 flex items-center justify-center">
          <div className="animate-pulse space-y-4 w-full max-w-6xl">
            <div className="h-8 w-48 rounded-[20px] bg-gray-200" />
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="aspect-square w-full lg:w-1/2 rounded-[40px] bg-gray-200" />
              <div className="space-y-6 w-full lg:w-1/2">
                <div className="h-12 rounded-[20px] bg-gray-200 w-3/4" />
                <div className="h-20 rounded-[20px] bg-gray-200 w-full" />
                <div className="h-24 rounded-[20px] bg-gray-200 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <Header />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-5xl mb-4">🍃</p>
          <h2 className="text-xl font-bold mb-4">Product not found</h2>
          <Link to="/collections/all" className="bg-[#2E4D31] text-white px-8 py-3 rounded-[30px] font-bold">Browse All Collections</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isMonk = product.type?.toLowerCase().includes('monk') || product.name.toLowerCase().includes('monk');
  const imageBgClass = isMonk ? 'bg-[#F2A359]/10' : 'bg-[#2E4D31]/5';
  
  const substitutionText = selectedRatio === '1:10' ? '1g replaces 10g of sugar.' : 
                           selectedRatio === '1:50' ? '1g replaces 50g of sugar.' : 
                           selectedRatio === '1:100' ? '1g replaces 100g of sugar.' : 
                           product.sweetness_description || '1g replaces 10g of sugar. Mild sweetness, great for everyday drinks.';

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const originalPrice = selectedVariant?.discount_price ? selectedVariant.price : product.original_price;
  const wishlisted = isInWishlist(String(product.id));

  const variantGallery = selectedVariant?.gallery || [];
  const baseGallery = product.gallery || [];
  const galleryImages = variantGallery.length > 0
    ? variantGallery.map((g: any) => g.url)
    : baseGallery.length > 0
      ? baseGallery.map(g => g.url)
      : [product.image].filter(Boolean);
  
  const mainImageUrl = galleryImages[selectedThumb] || product.image;

  const handleAddToCart = () => {
    const variantId = selectedVariant?.id || product.variants?.[0]?.id;
    for (let i = 0; i < quantity; i++) addToCart(product, 1, variantId);
    toast.success(`${product.name} Added!`, { duration: 2000 });
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

  const relatedSlugs = product.related_products 
    ? product.related_products.split(',').map(s => s.trim()).filter(Boolean)
    : [];
  
  const relatedProducts = relatedSlugs.length > 0
    ? allProducts.filter(p => relatedSlugs.includes(p.slug || ""))
    : allProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-white min-h-screen text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-2xl pt-24 md:pt-32 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link to="/" className="text-xs transition-colors text-gray-500 hover:text-[#77cb4d]">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link to="/collections/all" className="text-xs transition-colors text-gray-500 hover:text-[#77cb4d]">Collections</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-xs font-bold text-[#2E4D31]">{product.name}</span>
        </nav>

        {/* 2-Column Split */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-20">
          
          {/* Left: Product Images (Sticky) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-4 lg:sticky lg:top-32 self-start">
            <div className={`aspect-square rounded-[40px] flex items-center justify-center relative overflow-hidden group ${imageBgClass}`}>
              {product.badge && (
                <div className="absolute top-6 left-6 bg-[#77cb4d] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-[20px] z-10 shadow-sm">
                  {product.badge}
                </div>
              )}
              <button 
                onClick={toggleWishlist}
                className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 z-10 transition-transform active:scale-90"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              {mainImageUrl ? (
                <motion.img 
                  key={mainImageUrl}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={mainImageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover relative z-0 transition-transform duration-500 group-hover:scale-110 lg:group-hover:scale-150 origin-center cursor-zoom-in"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#2E4D31] text-white font-black tracking-widest uppercase">Grevia</div>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedThumb(idx)}
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-[20px] border-2 transition-all overflow-hidden flex items-center justify-center bg-white snap-center ${selectedThumb === idx ? 'border-[#77cb4d]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-[60%] flex flex-col">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E4D31] mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating || 5) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">{(product.rating || 5).toFixed(1)} / 5.0</span>
              <span className="text-sm text-gray-500">({product.reviews_count || 12} reviews)</span>
            </div>

            <div className="flex items-end gap-4 mb-8">
              <span className="text-3xl lg:text-4xl font-bold text-[#2E4D31]">₹{displayPrice}</span>
              {originalPrice && originalPrice > displayPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">₹{originalPrice}</span>
              )}
              <span className="text-xs font-bold text-[#77cb4d] uppercase tracking-widest mb-2 ml-2">Inclusive of all taxes</span>
            </div>

            {/* Visual Attribute Selector - Strength Ratio */}
            {(product.ratio || product.category?.toString().includes('sweetener') || ['1:10', '1:50', '1:100'].includes(selectedRatio)) && (
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-900 mb-3 block">Strength Ratio (Concentration)</label>
                <div className="flex flex-wrap gap-3">
                  {['1:10', '1:50', '1:100'].map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedRatio(r)}
                      className={`px-6 py-2.5 rounded-[30px] font-bold text-sm border-2 transition-all ${selectedRatio === r ? 'bg-[#2E4D31] text-white border-[#2E4D31]' : 'bg-white text-[#2E4D31] border-gray-200 hover:border-[#2E4D31]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                
                {/* Substitution Tip */}
                <div className="mt-4 p-4 rounded-[20px] bg-[#77cb4d]/10 border border-[#77cb4d]/30 flex gap-4 items-center">
                  <Info className="w-5 h-5 text-[#2E4D31] flex-shrink-0" />
                  <p className="text-sm font-bold text-[#2E4D31]">
                    {substitutionText}
                  </p>
                </div>
              </div>
            )}

            {/* Visual Attribute Selector - Pack Size */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <label className="text-sm font-bold text-gray-900 mb-3 block">Pack Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedThumb(0);
                      }}
                      className={`px-6 py-2.5 rounded-[30px] font-bold text-sm border-2 transition-all ${selectedVariant?.id === v.id ? 'bg-[#2E4D31] text-white border-[#2E4D31]' : 'bg-white text-[#2E4D31] border-gray-200 hover:border-[#2E4D31]'}`}
                    >
                      {v.weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10 p-4 bg-gray-50 rounded-[20px] border border-gray-100">
              <div className="flex items-center justify-between w-full sm:w-auto bg-white rounded-full p-2 border border-gray-200">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:text-[#77cb4d] transition-colors rounded-full bg-gray-50"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:text-[#77cb4d] transition-colors rounded-full bg-gray-50"><Plus className="w-4 h-4" /></button>
              </div>

              <button onClick={handleAddToCart} className="w-full flex-1 h-[56px] bg-[#2E4D31] hover:bg-[#1a3320] text-white rounded-full flex items-center justify-center gap-3 font-bold text-lg transition-all active:scale-95 shadow-md">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>
            
            {/* Accordions */}
            <div className="mt-8">
              <AccordionItem title="The Grevia Story" defaultOpen={true}>
                <p className="leading-relaxed">{product.description || "Experience the pure taste of nature with Grevia's premium sweetener. Zero calories, zero insulin spike, and zero bitter aftertaste. We source the finest organic ingredients to ensure every drop brings joy without compromise."}</p>
                {product.longDescription && (
                  <div className="mt-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                )}
              </AccordionItem>
              
              <AccordionItem title="Health Benefits">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#77cb4d]" /> Keto-Friendly & Low Carb</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#77cb4d]" /> Zero-Glycemic Impact</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#77cb4d]" /> 100% Vegan & Plant-Based</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#77cb4d]" /> No Artificial Preservatives</li>
                </ul>
              </AccordionItem>
              
              <AccordionItem title="Shipping & Returns">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#77cb4d]/10 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-5 h-5 text-[#2E4D31]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Free Standard Shipping</p>
                      <p className="text-sm">On all orders above ₹499. Delivered in 3-5 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#77cb4d]/10 flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-5 h-5 text-[#2E4D31]" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Easy Returns</p>
                      <p className="text-sm">7-day return policy for unopened items in original packaging.</p>
                    </div>
                  </div>
                </div>
              </AccordionItem>
            </div>

          </div>
        </div>

        {/* Dynamic Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-16">
           <ReviewsSection productId={String(product.id)} />
        </div>

        {/* Related Products Slider */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#2E4D31]">You May Also Like</h2>
            <div className="flex gap-2">
              {/* Optional slider controls can go here */}
            </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {relatedProducts.map(p => (
              <div key={p.id} className="min-w-[280px] sm:min-w-[300px] w-full max-w-[320px] snap-center">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
