import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Send } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { label: "All Products", href: "/collections/all" },
      { label: "Stevia", href: "/collections/stevia" },
      { label: "Monkfruit", href: "/collections/monkfruit" },
      { label: "Bundles", href: "/collections/bundles" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/story" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Press", href: "/press" },
    ],
    Support: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  };

  return (
    <footer className="bg-[#1a452e] text-white pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
          
          {/* Brand & Newsletter Section (Span 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <Link to="/" className="text-3xl font-black tracking-tighter text-white">
              grevia
            </Link>
            <p className="text-white/60 text-base font-medium leading-relaxed max-w-sm">
              Experience the pure taste of nature with our premium organic sweeteners. Zero calories, zero guilt, endless flavor.
            </p>
            
            {/* Newsletter Input */}
            <div className="relative max-w-sm mt-4">
              <div className="flex gap-2 p-1.5 bg-white/5 rounded-full border border-white/10 focus-within:border-[#A3E635]/50 transition-all">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 px-4 py-2 w-full text-sm font-medium"
                />
                <button className="bg-[#A3E635] text-[#1a452e] font-bold px-6 py-2 rounded-full text-sm hover:bg-white transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Links Section (Span 7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="flex flex-col gap-6">
                <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.href} 
                        className="text-white/50 hover:text-[#A3E635] transition-colors duration-300 text-[15px] font-medium"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/30 text-sm font-medium">
            © {currentYear} Grevia. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            {[
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Facebook, href: "#" }
            ].map(({ Icon, href }, i) => (
              <a 
                key={i} 
                href={href} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white hover:text-[#1a452e] transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
