import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setIsCartOpen, getCartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Benefits", href: "/#benefits" },
    { label: "Sweeteners", href: "/collections/all" },
    { label: "Other Products", href: "/collections/all" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          
          {/* Logo (Left) */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/grevia-logo.png" 
                alt="Grevia" 
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
            </Link>
          </div>

          {/* Desktop Navigation (Center) - Simplified Link Structure */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-10" aria-label="Main navigation">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group/nav">
                <Link 
                  to={link.href}
                  className="text-[15px] font-bold text-foreground/80 hover:text-primary transition-colors relative py-2"
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </Link>
              </div>
            ))}
          </nav>

          {/* Desktop Actions (Right) */}
          <div className="hidden lg:flex flex-1 justify-end items-center gap-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/80 hover:text-primary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            <Link 
              to="/collections/all" 
              className="inline-flex items-center justify-center bg-primary text-white font-bold rounded-full hover:bg-forest-light transition-all duration-300 h-10 px-7 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/80"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            <button 
              className="p-2 text-foreground/80"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full left-4 right-4 mt-2 bg-background rounded-2xl shadow-xl border border-border/50 overflow-hidden lg:hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.label}
                  to={link.href}
                  className="text-lg font-semibold text-foreground/90 hover:text-primary transition-colors py-2 border-b border-border/10 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link 
                  to="/collections/all"
                  className="flex items-center justify-center h-14 bg-primary text-white rounded-2xl font-bold transition-all active:scale-95 shadow-lg"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
