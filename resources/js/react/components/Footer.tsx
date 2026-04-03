import { motion } from "framer-motion";
import { Send, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    shop: [
      { label: "All Products", href: "/collections/all" },
      { label: "Stevia", href: "/collections/all?filter=stevia" },
      { label: "Monkfruit", href: "/collections/all?filter=monk-fruit" },
      { label: "Bundles", href: "/collections/all" },
    ],
    company: [
      { label: "About Us", href: "/#benefits" },
      { label: "Our Story", href: "/#benefits" },
      { label: "Sustainability", href: "#" },
      { label: "Press", href: "#" },
    ],
    support: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/contact" },
      { label: "Shipping", href: "#" },
      { label: "Returns", href: "#" },
    ],
  };

  const socials = [
    { label: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#" },
    { label: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#" },
    { label: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#" },
  ];

  return (
    <footer className="bg-primary text-white pt-24 pb-12 overflow-hidden" role="contentinfo">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-16 mb-20">
          
          {/* Brand & Newsletter - Span 3 */}
          <div className="lg:col-span-3">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img 
                src="/grevia-logo.png" 
                alt="Grevia" 
                className="h-10 w-auto brightness-0 invert" 
              />
            </Link>
            <p className="text-white/60 max-w-sm mb-10 leading-relaxed font-medium">
              Experience the pure taste of nature with our premium organic sweeteners. Zero calories, zero guilt, endless flavor.
            </p>
            
            {/* Newsletter Field */}
            <div className="max-w-md">
              <label htmlFor="footer-email" className="block text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-4">Stay Sweet & Updated</label>
              <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl focus-within:border-white/30 transition-colors">
                <input 
                  type="email" 
                  id="footer-email"
                  placeholder="Enter your email" 
                  className="flex-1 bg-transparent px-4 py-2 text-white placeholder:text-white/30 focus:outline-none font-medium"
                />
                <button 
                  className="w-12 h-12 bg-white text-primary rounded-xl flex items-center justify-center hover:bg-cream transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">Shop</h3>
            <ul className="space-y-4">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/70 hover:text-white font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/70 hover:text-white font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40 mb-6">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-white/70 hover:text-white font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-10">
            <p className="text-xs font-bold text-white/30">
              © 2026 GREVIA. ALL RIGHTS RESERVED.
            </p>
            <div className="hidden md:flex gap-6">
              <Link to="#" className="text-xs font-bold text-white/30 hover:text-white transition-colors">PRIVACY POLICY</Link>
              <Link to="#" className="text-xs font-bold text-white/30 hover:text-white transition-colors">TERMS OF SERVICE</Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a 
                key={social.label}
                href={social.href} 
                aria-label={social.label}
                className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
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
