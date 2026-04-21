import { api } from "@/lib/api";

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

  const shopItem = {
    label: "Shop By Category",
    href: "/collections",
    megaMenu: categories.map(cat => ({
      title: cat.name,
      items: (cat.children || []).map(child => ({
        label: child.name,
        href: `/collections?category=${child.slug}`,
        icon: child.icon_url ? undefined : (cat.slug === 'stevia' ? Leaf : Grape),
        imageUrl: child.icon_url
      }))
    }))
  };

  // If we have no categories yet, use fallback or empty
  const navLinks: NavLink[] = [
    { label: "Home", href: "/" },
    shopItem.megaMenu.length > 0 ? shopItem : {
      label: "Shop By Category",
      href: "/collections",
      megaMenu: [
        { title: "Sweeteners", items: [{ label: "All Collections", href: "/collections" }] }
      ]
    },
    { label: "Benefits", href: "/benefits" },
    { label: "Contact", href: "/contact" },
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
                  link.dropdown && handleMouseEnter(link.label)
                }
                onMouseLeave={() => link.dropdown && handleMouseLeave()}
              >
                {link.dropdown ? (
                  <>
                    <button
                      className={`flex items-center gap-1 text-[15px] font-medium transition-colors py-2 ${
                        openDropdown === link.label
                          ? "text-primary"
                          : "text-foreground/70 hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-[20px] shadow-2xl border border-gray-100 py-6 z-50 ${
                            link.megaMenu ? "min-w-[700px] px-8" : "min-w-[200px] px-2"
                          }`}
                        >
                          {link.megaMenu ? (
                            <div className="grid grid-cols-3 gap-8">
                              {link.megaMenu.map((column) => (
                                <div key={column.title} className="space-y-4">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-50 pb-2">
                                    {column.title}
                                  </h4>
                                  <div className="space-y-1">
                                    {column.items.map((item) => (
                                      <Link
                                        key={item.label}
                                        to={item.href}
                                        className="group flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-primary/5 transition-all duration-300"
                                      >
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden border border-gray-100">
                                          {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.label} className="w-full h-full object-contain p-1" />
                                          ) : (
                                            item.icon && <item.icon className="w-4 h-4 text-gray-400 group-hover:text-primary" />
                                          )}
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold text-gray-600 group-hover:text-primary">
                                            {item.label}
                                          </span>
                                          <span className="text-[10px] font-medium text-gray-400">Pure Plant-Based</span>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            link.dropdown?.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="block px-4 py-2.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors"
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
                    className={`text-[15px] font-medium transition-colors py-2 ${
                      location.pathname === link.href
                        ? "text-primary"
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
              className="p-2 text-foreground/60 hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* User / Auth */}
            <Link
              to={user ? "/dashboard/profile" : "/login"}
              className="p-2 text-foreground/60 hover:text-primary transition-colors"
              aria-label={user ? "My Account" : "Login"}
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-foreground/60 hover:text-primary transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Shop Now CTA */}
            <Link
              to="/collections/all"
              className="inline-flex items-center justify-center bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all duration-300 h-10 px-6 text-sm shadow-md hover:shadow-lg"
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
                <X className="w-6 h-6" />
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden lg:hidden"
          >
            <div className="p-5 flex flex-col">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === link.label ? null : link.label
                          )
                        }
                        className="flex items-center justify-between w-full text-base font-semibold text-foreground/80 hover:text-primary transition-colors py-3 border-b border-gray-50"
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            mobileExpanded === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === link.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.label}
                                to={item.href}
                                className="block pl-4 py-2.5 text-sm font-medium text-foreground/60 hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className="block text-base font-semibold text-foreground/80 hover:text-primary transition-colors py-3 border-b border-gray-50 last:border-0"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-4 flex gap-3">
                {!user && (
                  <Link
                    to="/login"
                    className="flex-1 flex items-center justify-center h-12 border border-primary text-primary rounded-xl font-semibold transition-all active:scale-95"
                  >
                    Login
                  </Link>
                )}
                <Link
                  to="/collections/all"
                  className="flex-1 flex items-center justify-center h-12 bg-primary text-white rounded-xl font-semibold transition-all active:scale-95 shadow-md"
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
