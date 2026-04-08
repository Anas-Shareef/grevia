import { Send, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    shop: [
      { label: "All Products", href: "/collections/all" },
      { label: "Stevia", href: "/collections/stevia" },
      { label: "Monkfruit", href: "/collections/monk-fruit" },
      { label: "Bundles", href: "/collections/all" },
    ],
    company: [
      { label: "About Us", href: "/benefits" },
      { label: "Our Story", href: "/benefits" },
      { label: "Sustainability", href: "/benefits" },
      { label: "Press", href: "/contact" },
    ],
    support: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/contact" },
      { label: "Shipping", href: "/contact" },
      { label: "Returns", href: "/contact" },
    ],
  };

  const socials = [
    { label: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { label: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { label: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="bg-primary text-white pt-20 pb-10 overflow-hidden" role="contentinfo">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-3">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img
                src="/grevia-logo.png"
                alt="Grevia"
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/60 max-w-sm mb-8 leading-relaxed text-sm">
              Experience the pure taste of nature with our premium organic
              sweeteners. Zero calories, zero guilt, endless flavor.
            </p>

            {/* Newsletter */}
            <div className="max-w-md">
              <label
                htmlFor="footer-email"
                className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-3"
              >
                Stay Sweet & Updated
              </label>
              <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl focus-within:border-white/30 transition-colors">
                <input
                  type="email"
                  id="footer-email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent px-4 py-2 text-white placeholder:text-white/30 focus:outline-none text-sm"
                />
                <button
                  className="w-11 h-11 bg-white text-primary rounded-xl flex items-center justify-center hover:bg-white/90 transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-xs text-white/30">
              © 2026 Grevia. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                to="#"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
