import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Heart, User, LogOut, LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { setIsCartOpen, getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collections/all" },
    { label: "Our Benefits", href: "/benefits" },
    { label: "Contact", href: "/contact" },
  ];

  const navLinkClass = "text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-heading)] hover:text-[var(--green-accent)] transition-all duration-300";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'h-16 bg-white/90 backdrop-blur-md shadow-sm' : 'h-20 bg-transparent'}`}>
      <div className="container h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-0.5">
          <span className="logo-chunky">grevia</span><span className="text-3xl font-[900] text-[var(--green-accent)]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="flex items-center gap-2 md:gap-5">
          {/* Wishlist */}
          <Link to="/wishlist" className="p-2 text-[var(--text-heading)] hover:text-[var(--green-accent)] transition-colors relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[var(--green-accent)] text-[var(--green-primary)] text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 text-[var(--text-heading)] hover:text-[var(--green-accent)] transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[var(--border-light)] overflow-hidden py-2 z-50"
                >
                  {user ? (
                    <>
                      <div className="px-5 py-3 border-b border-[var(--border-light)] mb-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1">Account</p>
                        <p className="text-xs font-bold text-[var(--text-heading)] truncate">{user.name}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-[var(--text-heading)] hover:bg-[var(--green-pale)] hover:text-[var(--green-primary)] transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> My Dashboard
                      </Link>
                      <Link to="/dashboard/orders" className="flex items-center gap-3 px-5 py-3 text-xs font-bold text-[var(--text-heading)] hover:bg-[var(--green-pale)] hover:text-[var(--green-primary)] transition-colors">
                        <Package className="w-4 h-4" /> Order History
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-3 px-5 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Secure Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-heading)] hover:bg-[var(--green-pale)]">Log In</Link>
                      <Link to="/register" className="block px-5 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-heading)] hover:bg-[var(--green-pale)]">Sign Up</Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Bag */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 px-4 py-2 bg-[var(--green-primary)] text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[11px] font-black uppercase tracking-widest hidden sm:inline">Bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--green-accent)] text-[var(--green-primary)] text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-[var(--text-heading)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 top-0 left-0 bg-white z-[60] flex flex-col p-8 pt-24"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--text-heading)]"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-4xl font-[900] tracking-tighter text-[var(--green-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-4">
              {!user ? (
                <>
                  <Link to="/login" className="btn-secondary w-full text-center">Log In</Link>
                  <Link to="/register" className="btn-primary w-full text-center">Join Movement</Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn-primary w-full text-center">Visit Dashboard</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
