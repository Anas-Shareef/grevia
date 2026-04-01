import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Heart, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import greviaLogo from "@/assets/grevia-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [mobileSubDropdown, setMobileSubDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { setIsCartOpen, getCartCount, getCartTotal } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const wishlistCount = getWishlistCount();

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Small pill link component for the mega-menu
  const Pill = ({ label, href }: { label: string; href: string }) => (
    <Link
      to={href}
      onClick={() => setMegaMenuOpen(false)}
      className="inline-block px-3 py-1 rounded-lg text-xs font-medium border transition-all duration-150 hover:scale-105"
      style={{
        background: 'var(--pill-inactive-bg)',
        borderColor: 'var(--pill-inactive-border)',
        color: 'var(--text-secondary)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'var(--pill-active-bg)';
        el.style.borderColor = 'var(--pill-active-border)';
        el.style.color = 'var(--text-green)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement;
        el.style.background = 'var(--pill-inactive-bg)';
        el.style.borderColor = 'var(--pill-inactive-border)';
        el.style.color = 'var(--text-secondary)';
      }}
    >
      {label}
    </Link>
  );

  const navLinkClass = "text-sm font-semibold transition-colors py-2";
  const navLinkStyle = { color: 'var(--text-secondary)' };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{ background: 'rgba(13,31,14,0.95)', borderColor: 'var(--border-card)' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src={greviaLogo}
              alt="Grevia - Premium Natural Sweeteners"
              className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <Link to="/" className={navLinkClass} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Home
            </Link>
            <Link to="/benefits" className={navLinkClass} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Benefits
            </Link>

            {/* ─── Natural Sweeteners Mega Menu ─── */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-sm font-semibold py-2 transition-colors"
                style={{ color: megaMenuOpen ? 'var(--text-green)' : 'var(--text-secondary)' }}
              >
                Natural Sweeteners
                <ChevronDown className={`w-4 h-4 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {megaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16 }}
                    className="fixed left-0 right-0 top-[64px] md:top-[80px] z-50 shadow-2xl"
                    style={{
                      background: 'var(--bg-card)',
                      borderTop: '1px solid var(--border-card)',
                      borderBottom: '1px solid var(--border-card)',
                    }}
                  >
                    <div className="container mx-auto px-6 py-8" style={{ display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: 0 }}>

                      {/* ── Col 1: Shop by Type ── */}
                      <div className="pr-6" style={{ borderRight: '0.5px solid var(--border-card)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                          Shop by type
                        </p>
                        <div className="space-y-2 mb-6">
                          <Link
                            to="/collections/all?type=stevia"
                            onClick={() => setMegaMenuOpen(false)}
                            className="flex items-center gap-3 w-full text-left p-3 rounded-xl transition-all"
                            style={{ background: 'var(--pill-inactive-bg)', border: '1px solid var(--border-card)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-active)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-card)'; }}
                          >
                            <span className="text-xl">🌿</span>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Stevia</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powder & Drops</p>
                            </div>
                          </Link>
                          <Link
                            to="/collections/all?type=monk-fruit"
                            onClick={() => setMegaMenuOpen(false)}
                            className="flex items-center gap-3 w-full text-left p-3 rounded-xl transition-all"
                            style={{ background: 'var(--pill-inactive-bg)', border: '1px solid var(--border-card)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-active)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-card)'; }}
                          >
                            <span className="text-xl">🍈</span>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Monk Fruit</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Powder</p>
                            </div>
                          </Link>
                        </div>
                        {/* Ratio Explainer card */}
                        <div className="p-3 rounded-xl" style={{ background: '#1e2d0e', border: '1px solid #3b6d11' }}>
                          <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-green)' }}>💡 What is 1:10 ratio?</p>
                          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            1g of Grevia replaces 10g of sugar. For large-batch baking, choose 1:50.
                          </p>
                        </div>
                      </div>

                      {/* ── Col 2: Stevia Products ── */}
                      <div className="px-8" style={{ borderRight: '0.5px solid var(--border-card)' }}>
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                          Stevia products
                        </p>
                        <div className="space-y-5">
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🌿 Stevia Powder</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Pill label="1:10 mild" href="/collections/all?type=stevia&form=powder&ratio=1-10" />
                              <Pill label="1:50 strong" href="/collections/all?type=stevia&form=powder&ratio=1-50" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Pill label="50g" href="/collections/all?type=stevia&form=powder&size=50g" />
                              <Pill label="100g" href="/collections/all?type=stevia&form=powder&size=100g" />
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>💧 Stevia Drops</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Pill label="1:10 mild" href="/collections/all?type=stevia&form=drops&ratio=1-10" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Pill label="50g" href="/collections/all?type=stevia&form=drops&size=50g" />
                              <Pill label="100g" href="/collections/all?type=stevia&form=drops&size=100g" />
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/collections/all?type=stevia"
                          onClick={() => setMegaMenuOpen(false)}
                          className="inline-flex items-center gap-1 mt-5 text-xs font-semibold hover:underline"
                          style={{ color: 'var(--text-green)' }}
                        >
                          View all Stevia →
                        </Link>
                      </div>

                      {/* ── Col 3: Monk Fruit Products ── */}
                      <div className="pl-8">
                        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                          Monk Fruit products
                        </p>
                        <div className="space-y-5">
                          <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🍈 Monk Fruit Powder</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Pill label="1:10 mild" href="/collections/all?type=monk-fruit&form=powder&ratio=1-10" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Pill label="50g" href="/collections/all?type=monk-fruit&form=powder&size=50g" />
                              <Pill label="100g" href="/collections/all?type=monk-fruit&form=powder&size=100g" />
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/collections/all?type=monk-fruit"
                          onClick={() => setMegaMenuOpen(false)}
                          className="inline-flex items-center gap-1 mt-5 text-xs font-semibold hover:underline"
                          style={{ color: 'var(--text-green)' }}
                        >
                          View all Monk Fruit →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/collections/other-products" className={navLinkClass} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Other Products
            </Link>
            <Link to="/contact" className={navLinkClass} style={navLinkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-green)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              Contact Us
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Account Dropdown */}
            <div className="relative" onMouseEnter={() => setIsUserMenuOpen(true)} onMouseLeave={() => setIsUserMenuOpen(false)}>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'var(--acc-green)' }}>
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Hello, {user ? user.name.split(' ')[0] : 'Sign In'}</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user ? 'My Account' : 'Account'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-56 rounded-xl shadow-lg overflow-hidden z-50"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                  >
                    {user ? (
                      <div className="py-2">
                        <div className="px-4 py-3 mb-1" style={{ borderBottom: '1px solid var(--border-card)' }}>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
                        <Link to="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}><Package className="w-4 h-4" /> My Orders</Link>
                        <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm transition-colors" style={{ color: 'var(--text-secondary)' }}><Heart className="w-4 h-4" /> Wishlist</Link>
                        <div className="mt-1 pt-1" style={{ borderTop: '1px solid var(--border-card)' }}>
                          <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        <button
                          onClick={() => { navigate('/login'); setIsUserMenuOpen(false); }}
                          className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                          style={{ background: 'var(--acc-green)' }}
                        >
                          Login
                        </button>
                        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                          New? <Link to="/register" className="font-semibold" style={{ color: 'var(--text-green)' }}>Sign up</Link>
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 rounded-xl transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
                    style={{ background: 'var(--text-green)', color: 'var(--bg-page)' }}>
                    {cartCount}
                  </span>
                )}
              </div>
              {cartTotal > 0 && (
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Icons + Hamburger */}
          <div className="lg:hidden flex items-center gap-1">
            {user ? (
              <Link to="/dashboard" className="p-2 rounded-xl" style={{ color: 'var(--text-secondary)' }}><User className="w-5 h-5" /></Link>
            ) : (
              <Link to="/login" className="p-2 rounded-xl" style={{ color: 'var(--text-secondary)' }}><User className="w-5 h-5" /></Link>
            )}
            <Link to="/wishlist" className="relative p-2 rounded-xl" style={{ color: 'var(--text-secondary)' }}>
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-xl" style={{ color: 'var(--text-secondary)' }}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: 'var(--text-green)', color: 'var(--bg-page)' }}>
                  {cartCount}
                </span>
              )}
            </button>
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
              {isMenuOpen
                ? <X className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
                : <Menu className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile Full-Screen Slide-In Drawer ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 top-[64px] z-40 overflow-y-auto"
            style={{ background: 'var(--bg-page)' }}
          >
            <div className="p-6 space-y-1">
              {/* Auth Row */}
              {user ? (
                <div className="mb-5 p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Welcome, {user.name}</p>
                  <div className="flex flex-col gap-1.5 mt-3 pl-3" style={{ borderLeft: '2px solid var(--border-active)' }}>
                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-1" style={{ color: 'var(--text-secondary)' }}>Dashboard</Link>
                    <Link to="/dashboard/orders" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-1" style={{ color: 'var(--text-secondary)' }}>My Orders</Link>
                    <button onClick={handleLogout} className="text-sm font-medium text-red-400 text-left py-1">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-5">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 rounded-xl text-sm font-semibold text-center"
                    style={{ border: '1px solid var(--border-active)', color: 'var(--text-green)' }}>
                    Log In
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}
                    className="py-2.5 rounded-xl text-sm font-semibold text-center text-white"
                    style={{ background: 'var(--acc-green)' }}>
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Nav links */}
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold py-3 px-2" style={{ color: 'var(--text-primary)' }}>Home</Link>
              <Link to="/benefits" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold py-3 px-2" style={{ color: 'var(--text-primary)' }}>Benefits</Link>

              {/* Natural Sweeteners Accordion */}
              <div style={{ borderBottom: '1px solid var(--border-card)' }} className="pb-1">
                <button
                  onClick={() => setMobileDropdown(mobileDropdown === 'sweeteners' ? null : 'sweeteners')}
                  className="flex items-center justify-between w-full text-lg font-semibold py-3 px-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Natural Sweeteners
                  <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'sweeteners' ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                </button>
                <AnimatePresence>
                  {mobileDropdown === 'sweeteners' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-4 pb-2 overflow-hidden"
                    >
                      {/* Stevia Sub-Accordion */}
                      <div>
                        <button
                          onClick={() => setMobileSubDropdown(mobileSubDropdown === 'stevia' ? null : 'stevia')}
                          className="flex items-center justify-between w-full text-base font-medium py-2 px-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          🌿 Stevia
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubDropdown === 'stevia' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileSubDropdown === 'stevia' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-4 overflow-hidden space-y-0.5">
                              <Link to="/collections/all?type=stevia&form=powder&ratio=1-10" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1.5 px-2" style={{ color: 'var(--text-muted)' }}>Stevia Powder 1:10</Link>
                              <Link to="/collections/all?type=stevia&form=powder&ratio=1-50" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1.5 px-2" style={{ color: 'var(--text-muted)' }}>Stevia Powder 1:50</Link>
                              <Link to="/collections/all?type=stevia&form=drops&ratio=1-10" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1.5 px-2" style={{ color: 'var(--text-muted)' }}>Stevia Drops 1:10</Link>
                              <Link to="/collections/all?type=stevia" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1.5 px-2 font-semibold" style={{ color: 'var(--text-green)' }}>View all Stevia →</Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Monk Fruit Sub-Accordion */}
                      <div>
                        <button
                          onClick={() => setMobileSubDropdown(mobileSubDropdown === 'monk' ? null : 'monk')}
                          className="flex items-center justify-between w-full text-base font-medium py-2 px-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          🍈 Monk Fruit
                          <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubDropdown === 'monk' ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileSubDropdown === 'monk' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-4 overflow-hidden space-y-0.5">
                              <Link to="/collections/all?type=monk-fruit&form=powder&ratio=1-10" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1.5 px-2" style={{ color: 'var(--text-muted)' }}>Monk Fruit Powder 1:10</Link>
                              <Link to="/collections/all?type=monk-fruit" onClick={() => setIsMenuOpen(false)} className="block text-sm py-1.5 px-2 font-semibold" style={{ color: 'var(--text-green)' }}>View all Monk Fruit →</Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <Link to="/collections/all" onClick={() => setIsMenuOpen(false)} className="block text-sm font-semibold py-2 px-2 mt-1" style={{ color: 'var(--text-green)' }}>Shop All →</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/collections/other-products" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold py-3 px-2" style={{ color: 'var(--text-primary)' }}>Other Products</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-lg font-semibold py-3 px-2" style={{ color: 'var(--text-primary)' }}>Contact Us</Link>

              {/* Bottom search bar */}
              <div className="mt-8 pt-4" style={{ borderTop: '1px solid var(--border-card)' }}>
                <Link to="/search" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span>🔍</span> Search products...
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
