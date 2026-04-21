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
  items: { label: string; href: string; icon?: any; imageUrl?: string }[];
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
    // Column 1: Shop All + top-level category links
    const shopAllColumn: MegaMenuColumn = {
      title: 'Browse',
      items: [
        { label: 'Shop All Products', href: '/collections', icon: Package },
        ...categories.map(cat => ({
          label: cat.name,
          href: `/collections?category=${cat.slug}`,
          icon: cat.icon_url ? undefined : Leaf,
          imageUrl: cat.icon_url,
        })),
      ],
    };

    // Columns 2+: each top-level category becomes a column showing its children
    const categoryColumns: MegaMenuColumn[] = categories.map(cat => ({
      title: cat.name,
      items: (cat.children || []).map(child => ({
        label: child.name,
        href: `/collections?category=${child.slug}`,
        icon: child.icon_url ? undefined : (cat.slug?.includes('stevia') ? Leaf : Grape),
        imageUrl: child.icon_url,
      })),
    })).filter(col => col.items.length > 0);

    return [shopAllColumn, ...categoryColumns];
  };

  const shopItem = {
    label: 'Shop by Category',
    href: '/collections',
    megaMenu: buildShopMegaMenu(),
  };

  // Rebuild megaMenu when categories load
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
                  <>
                    {/* Nav trigger button */}
                    <button
                      className={`flex items-center gap-1 text-[15px] font-medium transition-colors py-2 ${
                        openDropdown === link.label
                          ? 'text-primary'
                          : 'text-foreground/70 hover:text-primary'
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* ── MEGA-MENU PANEL ── */}
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          /* Full-viewport-width panel, anchored under the header */
                          className="fixed left-0 right-0 z-50 mt-1"
                          style={{ top: scrolled ? '56px' : '68px' }}
                          onMouseEnter={() => {
                            if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
                          }}
                          onMouseLeave={handleMouseLeave}
                        >
                          {/* Backdrop blur hint */}
                          <div className="absolute inset-0 bg-transparent pointer-events-none" />

                          <div className="mx-auto max-w-[1400px] px-6">
                            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden">
                              {link.megaMenu ? (
                                /* ── MEGA MENU with icon-heading + sub-links ── */
                                <div className="p-8">
                                  <div
                                    className="grid gap-x-8 gap-y-6"
                                    style={{
                                      gridTemplateColumns: `repeat(${Math.min(link.megaMenu.length, 5)}, minmax(0,1fr))`,
                                    }}
                                  >
                                    {link.megaMenu.map((column, colIdx) => (
                                      <div key={column.title} className="flex flex-col gap-3">
                                        {/* Column header */}
                                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                          {/* Circular icon badge */}
                                          <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                                              colIdx === 0
                                                ? 'bg-[#2E4D31]/10'
                                                : colIdx === 1
                                                ? 'bg-amber-50'
                                                : colIdx === 2
                                                ? 'bg-emerald-50'
                                                : 'bg-lime-50'
                                            }`}
                                          >
                                            {column.items[0]?.imageUrl ? (
                                              <img
                                                src={column.items[0].imageUrl}
                                                alt=""
                                                className="w-5 h-5 object-contain"
                                              />
                                            ) : (
                                              column.items[0]?.icon && (
                                                <column.items[0].icon
                                                  className={`w-4 h-4 ${
                                                    colIdx === 0
                                                      ? 'text-[#2E4D31]'
                                                      : colIdx === 1
                                                      ? 'text-amber-600'
                                                      : 'text-emerald-600'
                                                  }`}
                                                />
                                              )
                                            )}
                                          </div>

                                          {/* Column title */}
                                          <Link
                                            to={column.items[0]?.href ?? '#'}
                                            className="text-[13px] font-black text-[#2E4D31] uppercase tracking-wide hover:text-primary transition-colors leading-tight"
                                          >
                                            {column.title}
                                          </Link>
                                        </div>

                                        {/* Sub-links list */}
                                        <ul className="space-y-1.5">
                                          {column.items.map((item) => (
                                            <li key={item.label}>
                                              <Link
                                                to={item.href}
                                                className="text-[13px] text-gray-500 hover:text-[#2E4D31] font-medium transition-colors duration-200 block leading-snug hover:underline decoration-[#729855]/40"
                                              >
                                                {item.label}
                                              </Link>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Bottom bar */}
                                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                      Pure Plant-Based Sweeteners
                                    </p>
                                    <Link
                                      to="/collections"
                                      className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#2E4D31] hover:text-[#729855] transition-colors"
                                    >
                                      View All Collections
                                      <span className="text-base leading-none">→</span>
                                    </Link>
                                  </div>
                                </div>
                              ) : (
                                /* Simple dropdown for non-mega links */
                                <div className="py-3 px-2">
                                  {link.dropdown?.map((item) => (
                                    <Link
                                      key={item.label}
                                      to={item.href}
                                      className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-colors"
                                    >
                                      {item.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    to={link.href}
                    className={`text-[15px] font-medium transition-colors py-2 ${
                      location.pathname === link.href
                        ? 'text-primary'
                        : 'text-foreground/70 hover:text-primary'
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
            <Link to="/wishlist" className="p-2 text-foreground/60 hover:text-primary transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to={user ? '/dashboard/profile' : '/login'} className="p-2 text-foreground/60 hover:text-primary transition-colors" aria-label={user ? 'My Account' : 'Login'}>
              <User className="w-5 h-5" />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-foreground/60 hover:text-primary transition-colors" aria-label="Shopping cart">
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            <Link to="/collections" className="inline-flex items-center justify-center bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 h-10 px-6 text-sm shadow-md hover:shadow-lg">
              Shop Now
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-1">
            <Link to="/wishlist" className="p-2 text-foreground/70" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to={user ? '/dashboard/profile' : '/login'} className="p-2 text-foreground/70" aria-label={user ? 'My Account' : 'Login'}>
              <User className="w-5 h-5" />
            </Link>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-foreground/70" aria-label="Cart">
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
            <button className="p-2 text-foreground/70" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE NAVIGATION DRAWER ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-3 right-3 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden lg:hidden"
          >
            <div className="p-5 flex flex-col max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-gray-50 last:border-0">
                  {link.megaMenu || link.dropdown ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === link.label ? null : link.label)}
                        className="flex items-center justify-between w-full text-base font-semibold text-foreground/80 hover:text-primary transition-colors py-3"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${mobileExpanded === link.label ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pb-3"
                          >
                            {link.megaMenu ? (
                              /* Mobile mega-menu: each column as an expandable section */
                              <div className="space-y-4 pl-2">
                                {link.megaMenu.map((column) => (
                                  <div key={column.title}>
                                    <p className="text-[11px] font-black uppercase tracking-widest text-[#2E4D31] mb-2 flex items-center gap-2">
                                      {column.items[0]?.icon && <column.items[0].icon className="w-3.5 h-3.5" />}
                                      {column.title}
                                    </p>
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                      {column.items.map((item) => (
                                        <Link
                                          key={item.label}
                                          to={item.href}
                                          className="text-sm text-gray-500 hover:text-primary py-1 transition-colors"
                                        >
                                          {item.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              /* Simple dropdown */
                              link.dropdown?.map((item) => (
                                <Link
                                  key={item.label}
                                  to={item.href}
                                  className="block pl-4 py-2 text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
                                >
                                  {item.label}
                                </Link>
                              ))
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="block text-base font-semibold text-foreground/80 hover:text-primary transition-colors py-3"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* CTA Row */}
              <div className="pt-4 flex gap-3">
                {!user && (
                  <Link to="/login" className="flex-1 flex items-center justify-center h-12 border border-primary text-primary rounded-xl font-semibold transition-all active:scale-95">
                    Login
                  </Link>
                )}
                <Link to="/collections" className="flex-1 flex items-center justify-center h-12 bg-primary text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md">
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
