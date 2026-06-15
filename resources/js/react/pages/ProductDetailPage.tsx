import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, Star, Heart, Check, Truck, RotateCcw, 
  Info, ChevronRight, Minus, Plus, ChevronDown, Sparkles,
  Award, Shield, Zap, Activity, Leaf, Camera, Video,
  Mail, Copy, Share2
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
import { api } from "@/lib/api";

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

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.42 9.861-9.864.001-2.637-1.03-5.114-2.905-6.989-1.874-1.873-4.364-2.903-7.003-2.904-5.442 0-9.86 4.42-9.863 9.864 0 1.712.446 3.387 1.292 4.873l-.986 3.6 3.69-.968zm13.125-7.587c-.301-.15-1.78-.879-2.056-.979-.275-.1-.475-.15-.675.15-.2.3-.775.979-.95 1.179-.175.2-.35.225-.651.075-1.041-.521-1.824-.959-2.529-2.167-.184-.315-.093-.48.016-.628.11-.15.247-.3.37-.45.122-.15.163-.25.244-.416.082-.167.041-.313-.021-.463-.062-.15-.525-1.266-.719-1.731-.19-.456-.399-.393-.547-.4l-.469-.009c-.162 0-.425.061-.647.303-.222.242-.848.828-.848 2.018 0 1.19.867 2.337.989 2.5.122.162 1.706 2.602 4.132 3.649.577.249 1.027.397 1.378.508.58.184 1.109.158 1.527.096.466-.07 1.432-.585 1.633-1.15.201-.565.201-1.05.14-1.15-.061-.1-.225-.15-.526-.3z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.905 2.167-2.905 1.024 0 1.518.769 1.518 1.69 0 1.03-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.198-.334 1.362-.053.21-.174.25-.4.149-1.49-.693-2.421-2.87-2.421-4.615 0-3.76 2.73-7.213 7.87-7.213 4.132 0 7.34 2.944 7.34 6.88 0 4.105-2.586 7.408-6.177 7.408-1.205 0-2.337-.625-2.725-1.363l-.74 2.818c-.267 1.019-1.001 2.3-1.495 3.1 1.092.337 2.245.518 3.44.518 6.627 0 12-5.37 12-11.987C24.017 5.367 18.648 0 12.017 0z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
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
  const parts = ratio.split(':');
  const multiplier = parts.length > 1 ? parts[1] : '10';
  const tip = `1g replaces ${multiplier}g of sugar`;

  return (
    <motion.div 
      key={ratio}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-4 rounded-[20px] bg-[#F0FAE8] border-[1.5px] border-[#77CB4D] flex gap-3 items-center"
    >
      <Leaf className="w-4 h-4 text-[#2E4D31] flex-shrink-0" />
      <p className="text-[14px] font-semibold text-[#2E4D31] Montserrat">
        {tip}
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
      else setSelectedRatio('');
      
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      }
    }
  }, [product]);

  // Dynamic info box for concentration
  const [infoBoxText, setInfoBoxText] = useState<string | null>(null);
  const [infoBoxVisible, setInfoBoxVisible] = useState(false);
  const [infoBoxOpacity, setInfoBoxOpacity] = useState(1);

  // Structured EAV attributes from new API response
  const attrs = (product as any)?.attributes || {};
  const concentrations: any[] = attrs.concentrations || [];
  const hasEavConcentrations = concentrations.length > 0;

  useEffect(() => {
    if (hasEavConcentrations) {
      const defaultConc = concentrations.find((c: any) => c.is_default) || concentrations[0];
      if (defaultConc) {
        const val = defaultConc.slug || defaultConc.value || '';
        setSelectedRatio(val);
        
        let tip = defaultConc.substitution_text;
        if (!tip && (val.includes(':') || val.includes('-'))) {
          const parts = val.includes(':') ? val.split(':') : val.split('-');
          const multiplier = parts[1]?.match(/\d+/)?.[0] || '10';
          tip = `1g replaces ${multiplier}g of sugar`;
        }

        if (tip) {
          setInfoBoxText(tip);
          setInfoBoxVisible(true);
        }
      }
    }
  }, [hasEavConcentrations, concentrations.length]);

  // Fix 2: Reset thumbnail index when variant changes so gallery starts at first image
  useEffect(() => {
    setSelectedThumb(0);
  }, [selectedVariant]);

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





  // Fix 7: Dynamic SEO meta
  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} | Grevia — Premium Natural Sweeteners`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', product.description || `Buy ${product.name} from Grevia. Zero calories, 100% organic.`);
    }
  }, [product]);

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
        <Footer />
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
  
  // Dynamic Badge & Pricing Calculations
  const inStock = product.in_stock !== undefined ? product.in_stock : (product.inStock !== undefined ? product.inStock : true);
  const hasVariants = !!product.variants && product.variants.length > 0;
  const activeVariants = hasVariants ? (product.variants?.filter((v: any) => v.status === "active") || []) : [];
  const isOutOfStock = inStock === false || (hasVariants && activeVariants.every((v: any) => Number(v.stock_quantity) === 0));

  const origPrice = product.original_price ?? product.originalPrice;
  const basePrice = product.price;
  const hasDiscount = selectedVariant
    ? !!selectedVariant.discount_price && Number(selectedVariant.discount_price) < Number(selectedVariant.price)
    : !!origPrice && Number(basePrice) < Number(origPrice);

  const displayPrice = selectedVariant
    ? (selectedVariant.discount_price || selectedVariant.price)
    : product.price;

  const originalPrice = selectedVariant
    ? (selectedVariant.discount_price ? selectedVariant.price : null)
    : origPrice;

  const discountPercent = originalPrice && displayPrice ? Math.round(((Number(originalPrice) - Number(displayPrice)) / Number(originalPrice)) * 100) : 0;

  const createdAtStr = (product as any).created_at ?? (product as any).createdAt;
  const isNewProduct = createdAtStr
    ? (new Date().getTime() - new Date(createdAtStr).getTime()) / (1000 * 60 * 60 * 24) < 14
    : false;

  const wishlisted = isInWishlist(String(product.id));
  
  const formatAttr   = attrs.format || null;
  const trustBadges: any[]    = attrs.trust_badges || [];

  // Fallback: if no EAV concentrations, use legacy concentration_options
  const legacyConcOptions: string[] = (product as any).concentration_options || [];

  // Trust badges: Use only what is selected in the Admin "Dynamic Attributes" section
  const dynamicTrustBadges = trustBadges;

  const handleConcentrationClick = (conc: any) => {
    setInfoBoxOpacity(0);
    setTimeout(() => {
      const val = conc.slug || conc.value || '';
      setSelectedRatio(val);
      
      let tip = conc.substitution_text;
      if (!tip && (val.includes(':') || val.includes('-'))) {
        const parts = val.includes(':') ? val.split(':') : val.split('-');
        const multiplier = parts[1]?.match(/\d+/)?.[0] || '10';
        tip = `1g replaces ${multiplier}g of sugar`;
      }

      if (tip) {
        setInfoBoxText(tip);
        setInfoBoxVisible(true);
      } else {
        setInfoBoxVisible(false);
      }
      setInfoBoxOpacity(1);
    }, 120);
  };

  // Fix 2: Variant-specific gallery — prefer variant images when a variant is selected
  const variantGallery = [
    selectedVariant?.image_path ? (selectedVariant.image_path.startsWith('http') ? selectedVariant.image_path : `/storage/${selectedVariant.image_path}`) : null,
    ...(selectedVariant?.variant_images?.map((vImg: any) => vImg.url || (vImg.image_path ? `/storage/${vImg.image_path}` : null)) || [])
  ].filter(Boolean);
  const baseGallery = (product.gallery && product.gallery.length > 0)
    ? product.gallery.map((g: any) => g.url)
    : [product.image].filter(Boolean);
  const galleryImages = variantGallery.length > 0 ? variantGallery : baseGallery;

  const mainImageUrl = galleryImages[selectedThumb] || (variantGallery[0] ?? product.image);
  const absoluteShareImage = mainImageUrl ? (mainImageUrl.startsWith('http') ? mainImageUrl : window.location.origin + mainImageUrl) : '';




  const handleAddToCart = () => {
    const variantId = selectedVariant?.id || product.variants?.[0]?.id;
    const selectedAttributes: Record<string, any> = {};
    
    if (selectedRatio) {
      selectedAttributes.concentration = selectedRatio;
    }

    addToCart(product, quantity, variantId, selectedAttributes);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("Link copied to clipboard!", {
          style: { background: '#2E4D31', color: '#fff', borderRadius: '40px' },
          icon: <Check className="w-4 h-4" />
        });
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  // Fix 5: Prefer admin-picked related products; fallback to same-category then random
  const relatedProducts = (() => {
    if (product.related_products && product.related_products.length > 0) {
      return product.related_products;
    }
    const sameCategory = allProducts.filter(p => p.id !== product.id && p.category_id === product.category_id);
    if (sameCategory.length > 0) return sameCategory.slice(0, 8);
    return allProducts.filter(p => p.id !== product.id).slice(0, 8);
  })();

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
              {/* Dynamic Badges */}
              <div className="absolute top-6 left-6 z-30 flex flex-col gap-1.5">
                {isOutOfStock ? (
                  <div className="bg-slate-600/90 text-white font-bold uppercase tracking-widest text-[10px] px-3.5 py-1.5 rounded-full z-10 shadow-sm Montserrat select-none">
                    Sold Out
                  </div>
                ) : (
                  <>
                    {/* Sale / Discount Badge */}
                    {hasDiscount && discountPercent > 0 && (
                      <div className="bg-[#F59E0B] text-white font-black uppercase tracking-widest text-[10px] px-3.5 py-1.5 rounded-full z-10 shadow-sm Montserrat select-none">
                        Save {discountPercent}%
                      </div>
                    )}
                    
                    {/* Manual Badge (Filament admin) */}
                    {product.badge && (
                      <div className="bg-[#2E4D31] text-white font-bold uppercase tracking-widest text-[10px] px-3.5 py-1.5 rounded-full z-10 shadow-sm Montserrat select-none">
                        {product.badge}
                      </div>
                    )}

                    {/* New Product Badge */}
                    {isNewProduct && !product.badge && (
                      <div className="bg-[#16A34A] text-white font-bold uppercase tracking-widest text-[10px] px-3.5 py-1.5 rounded-full z-10 shadow-sm Montserrat select-none">
                        New
                      </div>
                    )}
                  </>
                )}
              </div>
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

            {/* Fix 1: Dynamic Health Benefit Chips from admin */}
            <div className="flex flex-wrap gap-2 mb-8">
              {Array.isArray(product.health_benefits) && product.health_benefits.length > 0 && (
                product.health_benefits.map((benefit: string, idx: number) => {
                  const icons = [Zap, Activity, Award, Shield, Leaf, Sparkles];
                  return <BenefitChip key={idx} icon={icons[idx % icons.length]} text={benefit} />;
                })
              )}
            </div>

            {/* Format Display */}
            {formatAttr && (
              <p className="text-[13px] text-[#5A5A5A] Montserrat mb-4">
                <span className="font-medium">Format:</span> {formatAttr.value}
              </p>
            )}

            {/* Potency — EAV Bubble Pills */}
            {hasEavConcentrations ? (
              <div className="mb-8">
                <label className="text-[11px] font-bold text-[#1E3A1F] uppercase tracking-[0.1em] mb-4 block Montserrat">Potency</label>
                <div className="flex flex-wrap gap-2.5">
                  {concentrations.map((conc: any) => {
                    const isActive = selectedRatio === (conc.slug || conc.value);
                    return (
                      <button
                        key={conc.id}
                        onClick={() => handleConcentrationClick(conc)}
                        className={`h-11 px-6 rounded-[100px] text-[13px] border transition-all duration-200 Montserrat ${
                          isActive
                            ? 'bg-[#1E3A1F] border-[#1E3A1F] text-white font-semibold'
                            : 'bg-white border-[#C0C0C0] text-[#1C1C1C] font-medium hover:border-[#4A8C4B] hover:bg-[#F1F8F1] hover:text-[#2E5D2F]'
                        }`}
                      >
                        {conc.label || conc.value}
                      </button>
                    );
                  })}
                </div>
                {/* Dynamic Info Box with substitution_text */}
                {infoBoxVisible && infoBoxText && (
                  <div
                    className="flex items-center gap-3 mt-3 px-5 py-3 rounded-[12px] border border-[#77CB4D] bg-[#EBF5EB]"
                    style={{ opacity: infoBoxOpacity, transition: 'opacity 200ms ease' }}
                  >
                    <Leaf className="w-4 h-4 text-[#4A8C4B] flex-shrink-0" />
                    <span className="text-[14px] text-[#1C1C1C] Montserrat">{infoBoxText}</span>
                  </div>
                )}
              </div>
            ) : legacyConcOptions.length > 0 ? (
              <div className="mb-8">
                <label className="text-[11px] font-bold text-[#1E3A1F] uppercase tracking-[0.1em] mb-4 block Montserrat">Potency</label>
                <div className="flex flex-wrap gap-2.5">
                  {legacyConcOptions.map((r: string) => (
                    <button
                      key={r}
                      onClick={() => setSelectedRatio(r)}
                      className={`h-11 px-6 rounded-[100px] font-bold text-[13px] border-2 transition-all Montserrat ${selectedRatio === r ? 'bg-[#1E3A1F] text-white border-[#1E3A1F]' : 'bg-white text-[#313131] border-[#E5E7EB] hover:border-[#2E4D31] hover:bg-[#F0FAE8]'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <SubstitutionTip ratio={selectedRatio} />
              </div>
            ) : null}

            {/* Pack Size Selector — Grevia light-green selected style, out-of-stock dimmed */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-10">
                <label className="text-[11px] font-bold text-[#1E3A1F] uppercase tracking-[0.1em] mb-4 block Montserrat">Select Pack Weight</label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v: any) => {
                    const isAvailable = (v.is_available !== false) && (v.stock_quantity === undefined || v.stock_quantity > 0);
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => isAvailable && setSelectedVariant(v)}
                        disabled={!isAvailable}
                        title={!isAvailable ? 'Out of Stock' : undefined}
                        className={`h-11 px-6 rounded-[100px] text-[13px] transition-all duration-200 Montserrat ${
                          !isAvailable
                            ? 'opacity-40 cursor-not-allowed bg-[#F4F4F4] border border-[#E0E0E0] text-[#AAAAAA] font-normal'
                            : isSelected
                              ? 'bg-[#EBF5EB] border-[1.5px] border-[#4A8C4B] text-[#1E3A1F] font-bold'
                              : 'bg-white border border-[#C0C0C0] text-[#1C1C1C] font-medium hover:border-[#4A8C4B] hover:bg-[#F1F8F1]'
                        }`}
                      >
                        {v.title || v.weight}
                      </button>
                    );
                  })}
                </div>
                {selectedVariant && (selectedVariant.stock_quantity ?? 1) > 0 && (selectedVariant.stock_quantity ?? 1) < 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 inline-flex items-center gap-2 bg-[#FEF3C7] border border-[#F59E0B] rounded-full px-4 py-1.5"
                  >
                    <span className="text-[12px] font-bold text-[#92400E] Montserrat">🔥 Only {selectedVariant.stock_quantity} left!</span>
                  </motion.div>
                )}
                {selectedVariant && selectedVariant.stock_quantity === 0 && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-red-50 border border-red-300 rounded-full px-4 py-1.5">
                    <span className="text-[12px] font-bold text-red-600 Montserrat">Sold Out</span>
                  </div>
                )}
              </div>
            )}

            {/* Buy Box */}
            <div className="flex flex-col gap-4 mb-6">
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
              {/* Trust Badges — PRD §4.3: Quality Promise section */}
              {Array.isArray(dynamicTrustBadges) && dynamicTrustBadges.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] font-bold text-[#5A5A5A] uppercase tracking-[0.12em] Montserrat mb-3">Quality Promise</p>
                  <div className="flex flex-wrap gap-4">
                    {dynamicTrustBadges.map((tb: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5" style={{ minWidth: '60px', maxWidth: '72px' }}>
                        {(tb.icon || tb.icon_url) ? (
                          <img
                            src={tb.icon || `/storage/${tb.icon_url}`}
                            alt={tb.label || tb.value_text}
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <Award className="w-8 h-8 text-[#2E5D2F]" />
                        )}
                        <span className="text-[10px] font-medium text-[#1E3A1F] Montserrat uppercase tracking-[0.08em] text-center leading-tight">
                          {tb.label || tb.value_text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Share Widget */}
            <div className="mt-8 pt-8 border-t border-[#E5E7EB] mb-6">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-4 Montserrat">
                <Share2 className="w-4 h-4 text-gray-500" />
                <span>Share This Product</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this on Grevia: ${product.name} - ${window.location.href}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <FacebookIcon />
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out ${product.name} on Grevia!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <XIcon />
                  X
                </a>
                <a
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(absoluteShareImage)}&description=${encodeURIComponent(product.description || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#cc001f] text-white font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <PinterestIcon />
                  Pinterest
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0A66C2] hover:bg-[#0956a3] text-white font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <LinkedInIcon />
                  LinkedIn
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`${product.name} on Grevia`)}&body=${encodeURIComponent(`Check out this amazing product on Grevia: ${product.name}\n\nLink: ${window.location.href}`)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2E4D31] hover:bg-[#1a3320] text-white font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-[13px] Montserrat transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
            
            {/* Accordions — conditional per PRD §4.4 */}
            <div className="space-y-1 mt-8">
              {/* Product Story — Primary from description, fallback to others */}
              {(() => {
                const storyContent =
                  product.description?.trim() ||
                  product.product_description?.trim() ||
                  (product as any).content?.attr_product_story?.trim() ||
                  (product as any).product_content?.attr_product_story?.trim();
                  
                return storyContent ? (
                  <AccordionItem title="Product Story" defaultOpen={true} icon={Leaf}>
                    <div
                      className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: storyContent }}
                    />
                  </AccordionItem>
                ) : null;
              })()}

              {/* Ingredients — only if present */}
              {(product.ingredients && (Array.isArray(product.ingredients) ? product.ingredients.length > 0 : String(product.ingredients).trim())) && (
                <AccordionItem title="Ingredients" icon={Info}>
                  {Array.isArray(product.ingredients) ? (
                    <ul className="list-none space-y-2">
                      {product.ingredients.map((ing: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 Montserrat text-gray-600">
                          <Leaf className="w-3.5 h-3.5 text-[#77CB4D] flex-shrink-0" />
                          <span className="text-[14px] font-medium">{ing}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.ingredients }}
                    />
                  )}
                </AccordionItem>
              )}

              {/* Usage & Preparation — only if content exists */}
              {(() => {
                const usageContent =
                  (product as any).content?.attr_usage_prep?.trim() ||
                  (product as any).product_content?.attr_usage_prep?.trim() ||
                  product.usage_instructions?.trim();
                return usageContent ? (
                  <AccordionItem title="How to Use" icon={Check}>
                    <div
                      className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: usageContent }}
                    />
                  </AccordionItem>
                ) : null;
              })()}

              {/* Shipping & Returns — Dynamic with hardcoded fallback */}
              {(() => {
                const shippingContent = (product as any).shipping_returns?.trim();
                
                return (
                  <AccordionItem title="Shipping & Returns" icon={Truck}>
                    {shippingContent ? (
                      <div
                        className="prose prose-sm max-w-none Montserrat text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: shippingContent }}
                      />
                    ) : (
                      <p className="Montserrat text-[14px] text-gray-600 leading-relaxed">
                        Standard delivery takes 3–5 business days. Free shipping on orders above ₹499.
                        Returns accepted within 7 days for unopened products.
                      </p>
                    )}
                  </AccordionItem>
                );
              })()}
            </div>

          </div>
        </div>



        {/* Reviews Section */}
        <div id="reviews-anchor">
          <ReviewsSection productId={String((product as any).dbId || product.id)} />
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
            {Array.isArray(relatedProducts) && relatedProducts.map(p => (
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
