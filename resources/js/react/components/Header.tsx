import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Heart, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const { setIsCartOpen, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Benefits", href: "/benefits" },
    { 
      label: "Sweeteners", 
      href: "/collections/all",
      dropdown: [
        { label: "Pure Stevia", href: "/collections/all?filter=stevia" },
        { label: "Monk Fruit", href: "/collections/all?filter=monk-fruit" },
      ]
    },
    { 
      label: "Other Products", 
      href: "/collections/all",
      dropdown: [
        { label: "Baking Blends", href: "/collections/all?filter=baking" },
        { label: "Liquid Drops", href: "/collections/all?filter=liquid" },
      ]
    },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full h-[75px] bg-[#f5f6f4] transition-all duration-300" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <div className="h-full flex items-center justify-between px-6 md:px-10 max-w-[1920px] mx-auto">
        
        {/* Left Section: Logo */}
        <Link to="/" className="flex items-center group py-2">
          <img 
            src="/grevia-logo.png" 
            alt="Grevia Healthy Natural Foods" 
            className="h-10 w-auto md:h-12 object-contain group-hover:scale-[1.02] transition-transform duration-300"
          />
        </Link>

        {/* Center Section: Navigation */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10 h-full">
          {navLinks.map((link) => (
            <div 
              key={link.label} 
              className="relative h-full flex items-center group"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
            >
              <Link 
                to={link.href} 
                className="flex items-center gap-1 text-[15px] font-[500] text-[#4a4a4a] hover:text-[#527a63] transition-colors duration-200 relative overflow-hidden py-2"
              >
                {link.label}
                {link.dropdown && <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" />}
                
                {/* Underline Animation */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#527a63] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </Link>

              {/* Dropdown Menu */}
              {link.dropdown && (
                <AnimatePresence>
                  {activeDropdown === link.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
                      className="absolute top-[65px] left-0 min-w-[200px] bg-white rounded-xl shadow-lg border border-[#dee7da] overflow-hidden py-2 z-50"
                    >
                      {link.dropdown.map((subItem) => (
                        <Link 
                          key={subItem.label} 
                          to={subItem.href}
                          className="block px-5 py-2.5 text-[14px] font-[500] text-[#4a4a4a] hover:bg-[#f5f6f4] hover:text-[#1c5f38] transition-colors"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Right Section: Icons + CTA */}
        <div className="flex items-center gap-5 md:gap-6">
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <button 
              onClick={() => navigate('/wishlist')}
              className="text-[#4a4a4a] hover:text-[#1c5f38] transition-colors relative"
            >
              <Heart className="w-[20px] h-[20px] stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1c5f38] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            
            {/* User Profile (Mobile/Tablet Hidden to save space if needed, but keeping for functionality) */}
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="hidden sm:block text-[#4a4a4a] hover:text-[#1c5f38] transition-colors"
            >
              <User className="w-[20px] h-[20px] stroke-[1.5]" />
            </button>

            {/* Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="text-[#4a4a4a] hover:text-[#1c5f38] transition-colors relative"
            >
              <ShoppingCart className="w-[20px] h-[20px] stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1c5f38] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Shop Now CTA */}
          <Link 
            to="/collections/all" 
            className="hidden sm:flex items-center justify-center px-[22px] py-[10px] bg-[#1c5f38] text-[#fafaf5] rounded-full text-[14px] font-[600] shadow-sm hover:shadow-md hover:bg-[#154a2a] hover:-translate-y-[1px] transition-all duration-200"
          >
            Shop Now
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-[#4a4a4a] ml-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-[22px] h-[22px]" /> : <Menu className="w-[22px] h-[22px]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 top-[75px] left-0 bg-[#f5f6f4] z-40 flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col gap-3">
                  <Link
                    to={link.href}
                    className="text-2xl font-[700] text-[#1c5f38]"
                    onClick={(e) => {
                      if (link.dropdown) {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === link.label ? null : link.label);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      {link.label}
                      {link.dropdown && (
                        <ChevronDown className={`w-6 h-6 transition-transform ${activeDropdown === link.label ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {link.dropdown && activeDropdown === link.label && (
                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-[#dee7da]">
                      {link.dropdown.map(subItem => (
                        <Link 
                          key={subItem.label} 
                          to={subItem.href}
                          className="text-lg font-[500] text-[#527a63]"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col gap-4 pb-12">
              <Link to="/collections/all" className="flex items-center justify-center py-4 bg-[#1c5f38] text-white rounded-full font-bold text-lg">
                Shop Now
              </Link>
              {!user ? (
                <>
                  <Link to="/login" className="flex items-center justify-center py-3 bg-white text-[#1c5f38] border border-[#dee7da] rounded-full font-bold">Log In</Link>
                </>
              ) : (
                <Link to="/dashboard" className="flex items-center justify-center py-3 bg-white text-[#1c5f38] border border-[#dee7da] rounded-full font-bold">My Account</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
