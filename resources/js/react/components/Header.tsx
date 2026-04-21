import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Heart, User, Leaf, Grape, Gift, Library, Package, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

type DropdownItem = {
  label: string;
  href: string;
};

type MegaMenuColumn = {
  title: string;
  icon?: any;
  imageUrl?: string;
  items: { label: string; href: string }[];
};

type NavLink = {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
  megaMenu?: MegaMenuColumn[];
};

type Category = {
  id: number;
  name: string;
  slug: string;
  icon_url?: string;
  children?: Category[];
};

const Header = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { setIsCartOpen, getCartCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
  }, [location]);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(label);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 300);
  };

  const buildShopMegaMenu = (): MegaMenuColumn[] => {
    // Column 1: Shop All
    const shopAllColumn: MegaMenuColumn = {
      title: 'Shop All',
      icon: Package,
      items: [
        { label: 'Browse All Products', href: '/collections' },
        ...categories.map(cat => ({
          label: cat.name,
          href: `/collections?category=${cat.slug}`,
        })),
      ],
    };

    // Columns 2+: each top-level category becomes a column showing its children
    const categoryColumns: MegaMenuColumn[] = categories.map(cat => ({
      title: cat.name,
      icon: cat.icon_url ? undefined : (cat.slug?.includes('stevia') ? Leaf : Grape),
      imageUrl: cat.icon_url,
      items: (cat.children || []).map(child => ({
        label: child.name,
        href: `/collections?category=${child.slug}`,
      })),
    })).filter(col => col.items.length > 0);

    return [shopAllColumn, ...categoryColumns];
  };

  const shopItem = {
    label: 'Shop by Category',
    href: '/collections',
    megaMenu: buildShopMegaMenu(),
  };

  const navLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    shopItem,
    { label: 'Benefits', href: '/benefits' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md py-2 shadow-sm"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <img
                src="/grevia-logo.png"
                alt="Grevia"
                className="h-8 md:h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  (link.dropdown || link.megaMenu) && handleMouseEnter(link.label)
                }
                onMouseLeave={() => (link.dropdown || link.megaMenu) && handleMouseLeave()}
              >
                {(link.dropdown || link.megaMenu) ? (
                  <div className="group">
                    <button
                      className={`flex items-center gap-1.5 text-[15px] font-bold transition-all py-2 tracking-tight ${
                        openDropdown === link.label
                          ? "text-primary scale-105"
                          : "text-foreground/70 hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          openDropdown === link.label ? "rotate-180 text-primary" : "text-foreground/30"
                        }`}
                      />
                    </button>

                    {/* Dropdown/Mega Menu Panel */}
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                          className={`fixed top-[72px] left-1/2 -translate-x-1/2 mt-1 z-50 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100/50 backdrop-blur-xl rounded-[32px] overflow-visible border-border/40 ${
                            link.megaMenu 
                              ? "w-[95vw] max-w-7xl p-10" 
                              : "min-w-[240px] p-2"
                          }`}
                        >
                          {/* Pointer Arrow */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100/50" />

                          {link.megaMenu ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-12 gap-y-16">
                              {link.megaMenu.map((column) => (
                                <div key={column.title} className="space-y-6">
                                  {/* Column Header with Icon */}
                                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                                    <div className="w-8 h-8 flex items-center justify-center text-primary/60">
                                       {column.imageUrl ? (
                                         <img src={column.imageUrl} alt={column.title} className="w-full h-full object-contain" />
                                       ) : (
                                         column.icon && <column.icon className="w-5 h-5" />
                                       )}
                                    </div>
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.15em] text-foreground/90">
                                      {column.title}
                                    </h4>
                                  </div>

                                  <div className="space-y-4">
                                    {column.items.map((item) => (
                                      <Link
                                        key={item.label}
                                        to={item.href}
                                        className="block group transition-all duration-200"
                                      >
                                        <span className="text-[14px] font-medium text-gray-500 group-hover:text-primary transition-colors leading-tight">
                                          {item.label}
                                        </span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col py-1">
                              {link.dropdown?.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.href}
                                  className="block px-6 py-3 text-[14px] font-bold text-gray-500 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className={`text-[15px] font-bold transition-all py-2 tracking-tight ${
                      location.pathname === link.href
                        ? "text-primary scale-105"
                        : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* User / Auth */}
            <Link
              to={user ? "/dashboard/profile" : "/login"}
              className="p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
              aria-label={user ? "My Account" : "Login"}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/60 hover:text-primary hover:bg-primary/5 rounded-full transition-all"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-glow ring-2 ring-white">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Shop Now CTA */}
            <Link
              to="/collections/all"
              className="inline-flex items-center justify-center bg-primary text-white font-black uppercase tracking-widest rounded-full hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-300 h-11 px-8 text-[11px] shadow-[0_10px_20px_-5px_rgba(46,77,49,0.3)]"
            >
              Shop Now
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1">
            <Link
              to="/wishlist"
              className="p-2 text-foreground/70"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            <Link
              to={user ? "/dashboard/profile" : "/login"}
              className="p-2 text-foreground/70"
              aria-label={user ? "My Account" : "Login"}
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/70"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            <button
              className="p-2 text-foreground/70"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 border-2 border-primary/20 rounded-full p-1" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden lg:hidden"
          >
            <div className="p-6 flex flex-col">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {(link.dropdown || link.megaMenu) ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === link.label ? null : link.label
                          )
                        }
                        className="flex items-center justify-between w-full py-4 border-b border-gray-50 group"
                      >
                         <span className={`text-[15px] font-black uppercase tracking-widest transition-colors ${mobileExpanded === link.label ? "text-primary" : "text-foreground/70"}`}>
                           {link.label}
                         </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            mobileExpanded === link.label ? "rotate-180 text-primary" : "text-foreground/20"
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50/50 rounded-2xl my-2 overflow-hidden px-4"
                          >
                            {(link.megaMenu || link.dropdown)?.map((section: any) => (
                              <div key={section.title || section.label} className="py-2">
                                {section.items ? (
                                  <>
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 p-2">
                                      {section.title}
                                    </h5>
                                    {section.items.map((item: any) => (
                                      <Link
                                        key={item.label}
                                        to={item.href}
                                        className="block py-3 pl-2 text-sm font-bold text-foreground/60 active:text-primary transition-colors"
                                      >
                                        {item.label}
                                      </Link>
                                    ))}
                                  </>
                                ) : (
                                  <Link
                                    key={section.label}
                                    to={section.href}
                                    className="block py-3 pl-2 text-sm font-bold text-foreground/60"
                                  >
                                    {section.label}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="block py-4 border-b border-gray-50 text-[15px] font-black uppercase tracking-widest text-foreground/70 active:text-primary transition-colors last:border-0"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="mt-8 flex gap-4">
                {!user && (
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center h-14 border-2 border-primary text-primary rounded-full font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                  >
                    Login
                  </Link>
                )}
                <Link
                  to="/collections/all"
                  className="flex-1 flex items-center justify-center h-14 bg-primary text-white rounded-full font-black uppercase tracking-widest text-xs transition-all active:scale-95 shadow-lg"
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
