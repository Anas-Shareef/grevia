import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Heart, User, LogOut, LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import greviaLogo from "@/assets/grevia-logo.png";

interface DropdownItem {
  name: string;
  href: string;
}

interface MegaMenuSection {
  title: string;
  href: string;
  items: { name: string; href: string; subtitle?: string }[];
}

interface NavItem {
  name: string;
  href?: string;
  dropdown?: DropdownItem[];
  megaMenu?: boolean;
  sections?: MegaMenuSection[];
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { setIsCartOpen, getCartCount, getCartTotal } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  const cartCount = getCartCount();
  const cartTotal = getCartTotal();
  const wishlistCount = getWishlistCount();

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Benefits", href: "/benefits" },
    { 
      name: "Natural Sweeteners", 
      href: "/collections/natural-sweeteners",
      megaMenu: true,
      sections: [
        {
          title: "Stevia Products",
          href: "/collections/stevia",
          items: [
            { name: "Stevia Powder 1:10", href: "/collections/stevia-powder-1-10", subtitle: "Everyday Sweetness" },
            { name: "Stevia Powder 1:50", href: "/collections/stevia-powder-1-50", subtitle: "Concentrated Baking" },
            { name: "Stevia Drops 1:10", href: "/collections/stevia-drops-1-10", subtitle: "Liquid Convenience" },
          ]
        },
        {
          title: "Monk Fruit Products",
          href: "/collections/monk-fruit",
          items: [
            { name: "Monk Fruit Powder 1:10", href: "/collections/monk-fruit-powder-1-10", subtitle: "Premium Sand Like" },
          ]
        }
      ]
    },
    { name: "Other Products", href: "/products/other-products" },
    { name: "Contact Us", href: "/contact" },
  ];

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={greviaLogo}
              alt="Grevia - Healthy Natural Foods"
              className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => (item.dropdown || item.megaMenu) && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <button
                    className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2"
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : item.megaMenu ? (
                  <button
                    className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                  >
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    to={item.href!}
                    className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-lime after:transition-all after:duration-300 hover:after:w-full py-2"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.dropdown && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[200px]"
                    >
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="block px-4 py-3 text-sm text-foreground hover:bg-lime/10 hover:text-lime transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mega Menu */}
                <AnimatePresence>
                  {item.megaMenu && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[#1a2e1b] border border-[#2d7a3a33] rounded-[32px] shadow-2xl overflow-hidden min-w-[850px] p-10 grid grid-cols-3 gap-10"
                    >
                      {item.sections?.map((section) => (
                        <div key={section.title}>
                          <Link to={section.href} className="block font-bold text-foreground hover:text-primary transition-colors mb-4 uppercase tracking-wider text-xs">
                            {section.title}
                          </Link>
                          <div className="space-y-4">
                            {section.items.map((subItem) => (
                              <Link key={subItem.name} to={subItem.href} className="group block">
                                <p className="text-sm font-semibold text-foreground group-hover:text-lime transition-colors">
                                  {subItem.name}
                                </p>
                                {subItem.subtitle && (
                                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                                    {subItem.subtitle}
                                  </p>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {/* Strength Guide Box */}
                      <div className="bg-[#173404] rounded-3xl p-8 flex flex-col justify-center border border-[#2d7a3a33] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-lime/10 blur-[50px] group-hover:bg-lime/20 transition-all duration-700" />
                        <h4 className="font-black text-white mb-4 text-xs uppercase tracking-[0.2em]">Strength Guide</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-[10px] font-black text-lime uppercase tracking-widest mb-1">1:10 Ratio</p>
                            <p className="text-xs text-white/50 leading-relaxed italic">
                              1g replaces 10g sugar. Ideal for tea, coffee & daily use.
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-lime uppercase tracking-widest mb-1">1:50 Ratio</p>
                            <p className="text-xs text-white/50 leading-relaxed italic">
                              Concentrated extracts for baking & large scale use.
                            </p>
                          </div>
                        </div>
                        <Link to="/benefits" className="text-[10px] font-black text-lime mt-6 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                          Learn More About Ratios <span>→</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Account Dropdown */}
            <div className="relative" onMouseEnter={() => setIsUserMenuOpen(true)} onMouseLeave={() => setIsUserMenuOpen(false)}>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-squircle hover:bg-secondary/50 transition-colors group"
                aria-label="User account"
              >
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className="text-xs text-muted-foreground font-medium">Hello, {user ? user.name.split(' ')[0] : 'Sign In'}</p>
                  <p className="text-sm font-bold text-foreground leading-none">{user ? 'My Account' : 'Account'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
                  >
                    {user ? (
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-border/50 mb-1">
                          <p className="text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary/50 transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link to="/dashboard/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary/50 transition-colors">
                          <Package className="w-4 h-4" /> My Orders
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-secondary/50 transition-colors">
                          <Heart className="w-4 h-4" /> Wishlist
                        </Link>
                        <div className="border-t border-border/50 mt-1 pt-1">
                          <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 space-y-3">
                        <Button className="w-full" asChild>
                          <Link to="/login">Login</Link>
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                          New customer? <Link to="/register" className="text-primary hover:underline font-semibold">Sign up</Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-squircle hover:bg-secondary/50 transition-colors group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-foreground group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-squircle hover:bg-secondary/50 transition-colors group"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-lime transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-lime text-foreground text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                    {cartCount}
                  </span>
                )}
              </div>
              {cartTotal > 0 && (
                <span className="text-sm font-bold text-foreground">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Cart & Menu */}
          <div className="lg:hidden flex items-center gap-1">
            {/* Mobile Account Icon (only if logged in, otherwise accessible via hamburger) */}
            {user ? (
              <Link to="/dashboard" className="p-2 rounded-squircle hover:bg-secondary/50">
                <User className="w-5 h-5 text-foreground" />
              </Link>
            ) : (
              <Link to="/login" className="p-2 rounded-squircle hover:bg-secondary/50">
                <User className="w-5 h-5 text-foreground" />
              </Link>
            )}


            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-squircle hover:bg-secondary/50 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-foreground" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 px-2 py-2 rounded-squircle hover:bg-secondary/50 transition-colors"
              aria-label="Shopping cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-lime text-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden pb-6 overflow-hidden"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-2">
                {user ? (
                  <div className="mb-4 p-4 bg-secondary/30 rounded-xl">
                    <p className="font-semibold text-foreground">Welcome, {user.name}</p>
                    <div className="flex flex-col gap-2 mt-2 pl-2 border-l-2 border-primary/20">
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-1">Dashboard</Link>
                      <Link to="/dashboard/orders" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium py-1">My Orders</Link>
                      <button onClick={handleLogout} className="text-sm font-medium text-red-500 text-left py-1">Logout</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button variant="outline" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/login">Log In</Link>
                    </Button>
                    <Button asChild onClick={() => setIsMenuOpen(false)}>
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </div>
                )}


                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown || item.megaMenu ? (
                      <>
                        <button
                          onClick={() => setMobileDropdown(mobileDropdown === item.name ? null : item.name)}
                          className="flex items-center justify-between w-full text-lg font-semibold text-foreground py-3 px-2"
                        >
                          {item.name}
                          <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === item.name ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 overflow-hidden"
                            >
                              {item.dropdown?.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.name}
                                  to={dropdownItem.href}
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setMobileDropdown(null);
                                  }}
                                  className="block text-base text-muted-foreground hover:text-lime py-2 px-2"
                                >
                                  {dropdownItem.name}
                                </Link>
                              ))}

                              {item.sections?.map((section) => (
                                <div key={section.title} className="py-2">
                                  <Link 
                                    to={section.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block text-sm font-bold text-foreground uppercase tracking-widest px-2 mb-2"
                                  >
                                    {section.title}
                                  </Link>
                                  <div className="space-y-1 ml-2 border-l border-border/50">
                                    {section.items.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        to={subItem.href}
                                        onClick={() => {
                                          setIsMenuOpen(false);
                                          setMobileDropdown(null);
                                        }}
                                        className="block text-sm text-muted-foreground hover:text-lime py-1 px-4"
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href!}
                        onClick={() => setIsMenuOpen(false)}
                        className="block text-lg font-semibold text-foreground hover:text-primary transition-colors py-3 px-2"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
