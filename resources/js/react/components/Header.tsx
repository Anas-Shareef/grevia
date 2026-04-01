import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Heart, User, LogOut, LayoutDashboard, Package } from "lucide-react";
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
    { label: "Benefits", href: "/benefits" },
    { label: "Collections", href: "/collections/all" },
    { label: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="container flex items-center justify-between w-full h-full">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          GREVIA<span className="accent">.</span>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links hidden lg:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link to={link.href} className="hover:text-[var(--green-primary)] transition-colors duration-150">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Wishlist */}
          <Link to="/wishlist" className="p-2 text-[var(--text-body)] hover:text-[var(--green-primary)] transition-colors relative">
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--green-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="p-2 text-[var(--text-body)] hover:text-[var(--green-primary)] transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-[var(--border-light)] rounded-[var(--radius-sm)] shadow-lg overflow-hidden py-2 z-50"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-[var(--border-light)] mb-1">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                      </div>
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--green-pale)] hover:text-[var(--green-primary)] transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link to="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--green-pale)] hover:text-[var(--green-primary)] transition-colors">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--green-pale)] hover:text-[var(--green-primary)]">Log In</Link>
                      <Link to="/register" className="block px-4 py-2 text-sm text-[var(--text-body)] hover:bg-[var(--green-pale)] hover:text-[var(--green-primary)]">Sign Up</Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-[var(--text-body)] hover:text-[var(--green-primary)] transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--green-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-[var(--text-body)] hover:text-[var(--green-primary)]"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-[var(--border-light)] overflow-hidden"
          >
            <div className="container py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-lg font-medium text-[var(--text-body)] hover:text-[var(--green-primary)]"
                >
                  {link.label}
                </Link>
              ))}
              {!user && (
                <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-light)]">
                  <Link to="/login" className="btn-secondary w-full justify-center">Log In</Link>
                  <Link to="/register" className="btn-primary w-full justify-center">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
