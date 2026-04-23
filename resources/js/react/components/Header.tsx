import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, ChevronDown, Heart, User, Leaf, Grape, Gift, Library, Package, Sparkles } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
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
  slug: string;
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
  // Track the trigger button rect so the tooltip arrow aligns to it
  const [triggerRect, setTriggerRect] = useState<{ left: number; width: number } | null>(null);
  const { setIsCartOpen, getCartCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

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

  const handleMouseEnter = useCallback((label: string, e?: React.MouseEvent) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    // Capture trigger button rect so the arrow can point precisely to it
    if (e?.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTriggerRect({ left: rect.left + rect.width / 2, width: rect.width });
    }
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(label);
    }, 150);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 250);
  }, []);

  const buildShopMegaMenu = (): MegaMenuColumn[] => {
    // Each top-level category becomes a column — NO "Shop All" column (moved to navbar)
    return categories.map(cat => ({
      title: cat.name,
      slug: cat.slug,
      icon: cat.icon_url ? undefined : (cat.slug?.includes('stevia') ? Leaf : Grape),
      imageUrl: cat.icon_url,
      items: (cat.children || []).map(child => ({
        label: child.name,
        href: `/collections?category=${child.slug}`,
      })),
    })).filter(col => col.items.length > 0);
  };

  const shopItem = {
    label: 'Shop by Category',
    href: '/collections',
    megaMenu: buildShopMegaMenu(),
  };

  const navLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    // 'Shop All' is now a standalone link — NOT inside the mega-menu dropdown
    { label: 'Shop All', href: '/collections' },
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
            ref={navRef}
            className="hidden lg:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="static"
                onMouseEnter={(e) =>
                  (link.dropdown || link.megaMenu) && handleMouseEnter(link.label, e)
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
                        // POSITIONING WRAPPER: Centers globally relative to viewport
                        <div 
                          className="fixed left-1/2 -translate-x-1/2 z-[9999]"
                          style={{ 
                            top: scrolled ? '56px' : '64px',
                            width: link.megaMenu ? '95vw' : 'auto',
                            maxWidth: link.megaMenu ? '1400px' : 'none'
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                            onMouseEnter={() => {
                              if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                            }}
                            onMouseLeave={handleMouseLeave}
                            className={[
                              'bg-white mt-3', // Solid white background
                              'shadow-[0_20px_50px_rgba(0,0,0,0.1)]', // Soft premium shadow
                              'border border-gray-100/60 rounded-[32px] overflow-visible',
                              link.megaMenu ? 'p-10' : 'p-2 min-w-[240px]',
                            ].join(' ')}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            {/* Tooltip Arrow — Anchored to the navbar button center */}
                            <div
                              className="absolute -top-[7px] w-3.5 h-3.5 bg-white rotate-45 border-l border-t border-gray-100/70"
                              style={{
                                left: triggerRect
                                  ? `calc(50% + (${triggerRect.left}px - 50vw))`
                                  : '50%',
                                transform: 'translateX(-50%) rotate(45deg)',
                              }}
                            />

                            {link.megaMenu ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-10 justify-items-start">
                                {link.megaMenu.map((column) => (
                                  <div key={column.title} className="w-full space-y-6">

                                    {/* Column Header — Montserrat Bold 14px */}
                                    <div className="flex items-center gap-2.5 pb-4 border-b border-[#2E4D31]/10">
                                      <div className="w-[23px] h-[23px] flex-shrink-0 flex items-center justify-center text-[#2E4D31]/70">
                                        {column.imageUrl ? (
                                          <img
                                            src={column.imageUrl}
                                            alt={column.title}
                                            className="w-full h-full object-contain"
                                          />
                                        ) : (
                                          column.icon && <column.icon className="w-[18px] h-[18px]" />
                                        )}
                                      </div>
                                      <Link
                                        to={`/collections?category=${column.slug}`}
                                        className="text-[14px] font-[700] uppercase tracking-[0.1em] text-[#2E4D31] hover:opacity-70 transition-opacity leading-tight"
                                        onClick={() => setOpenDropdown(null)}
                                      >
                                        {column.title.replace(/Sweetenerss/gi, 'Sweeteners')}
                                      </Link>
                                    </div>

                                    {/* Sub-links — Montserrat Medium 13px */}
                                    <div className="space-y-1">
                                      {column.items.map((item) => (
                                        <Link
                                          key={item.label}
                                          to={item.href}
                                          onClick={() => setOpenDropdown(null)}
                                          className="block group py-1.5"
                                        >
                                          <span 
                                            className="text-[13px] font-[500] text-[#4A4A4A] group-hover:text-[#77cb4d] group-hover:pl-[6px] transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] leading-snug inline-block mega-menu-link-shadow"
                                          >
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
                                    className="block px-6 py-3 text-[14px] font-bold text-gray-500 hover:text-[#2E4D31] hover:bg-[#2E4D31]/5 rounded-xl transition-all"
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>
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
                        <span className={`text-[15px] font-black uppercase tracking-widest transition-colors ${
                          mobileExpanded === link.label ? 'text-[#2E4D31]' : 'text-foreground/70'
                        }`}>
                          {link.label}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            mobileExpanded === link.label ? 'rotate-180 text-[#2E4D31]' : 'text-foreground/20'
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-[#F9F9EB]/60 rounded-2xl my-2 overflow-hidden"
                          >
                            {link.megaMenu?.map((column: MegaMenuColumn) => (
                              <div key={column.title} className="border-b border-[#2E4D31]/5 last:border-0">
                                {/* Clickable parent header in mobile drawer */}
                                <Link
                                  to={`/collections?category=${column.slug}`}
                                  className="flex items-center gap-2 px-4 pt-4 pb-2"
                                >
                                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-[#2E4D31]/60">
                                    {column.imageUrl ? (
                                      <img src={column.imageUrl} alt={column.title} className="w-full h-full object-contain" />
                                    ) : (
                                      column.icon && <column.icon className="w-4 h-4" />
                                    )}
                                  </div>
                                  <span className="text-[11px] font-black uppercase tracking-[0.15em] text-[#2E4D31]">
                                    {column.title}
                                  </span>
                                </Link>
                                {/* Sub-category links */}
                                <div className="px-4 pb-3 space-y-0.5">
                                  {column.items.map((item) => (
                                    <Link
                                      key={item.label}
                                      to={item.href}
                                      className="block py-2 pl-7 text-[13px] font-medium text-gray-400 active:text-[#2E4D31] transition-colors"
                                    >
                                      {item.label}
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
                      to={link.href}
                      className={`block py-4 border-b border-gray-50 text-[15px] font-black uppercase tracking-widest transition-colors last:border-0 ${
                        link.href === '/collections'
                          ? 'text-[#2E4D31]'
                          : 'text-foreground/70 active:text-[#2E4D31]'
                      }`}
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
