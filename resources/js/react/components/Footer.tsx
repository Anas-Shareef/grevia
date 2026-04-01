import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Shop: [
      { label: "All Products", href: "/collections/all" },
      { label: "Pure Stevia", href: "/collections/stevia" },
      { label: "Monk Fruit", href: "/collections/monk-fruit" },
      { label: "New Arrivals", href: "/collections/new" },
    ],
    Company: [
      { label: "Our Story", href: "/about" },
      { label: "Benefits", href: "/benefits" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Contact", href: "/contact" },
    ],
    Support: [
      { label: "Track Order", href: "/dashboard/orders" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  };

  return (
    <footer className="bg-[var(--green-primary)] text-white pt-24 pb-12 overflow-hidden relative">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-8">
            <Link to="/" className="text-4xl font-[900] tracking-tighter text-white flex items-center gap-0.5">
              GREVIA<span className="text-[var(--green-accent)]">.</span>
            </Link>
            <p className="text-white/60 text-base font-medium leading-relaxed max-w-xs">
              Building a healthier, sweeter world one leaf at a time. Join our mission to enjoy nature's sweetness without sacrifice.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-[var(--green-accent)] hover:text-[var(--green-primary)] hover:-translate-y-1 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Cols */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{title}</h3>
              <ul className="flex flex-col gap-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href} 
                      className="text-sm font-bold text-white/70 hover:text-white flex items-center gap-2 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            © {currentYear} Grevia. All Rights Reserved.
          </p>
          <div className="flex gap-10">
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/5 blur-[150px] -translate-y-1/4 translate-x-1/4 rounded-full" />
    </footer>
  );
};

export default Footer;
