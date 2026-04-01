import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: footerData } = useQuery<any[]>({
    queryKey: ['footer-content'],
    queryFn: () => api.get('/content/footer'),
  });

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribe({ email, source: 'footer' });
      toast.success("Success! You've been subscribed to our newsletter.");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message || "Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  const linksSections = footerData?.filter(s => s.type === 'links') || [];
  
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-top">
          {/* Brand Col */}
          <div>
            <Link to="/" className="footer-logo inline-block">
              GREVIA<span className="accent">.</span>
            </Link>
            <p className="footer-desc">
              Experience the pure taste of nature with our premium organic sweeteners. Join our journey towards a healthier, sweeter life without compromise.
            </p>
            {/* Newsletter Minimal */}
            <div className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-white/5 border border-white/10 rounded-[var(--radius-sm)] px-4 py-2 text-sm text-white outline-none focus:border-[#4ade80]/50 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={handleSubscribe}
                disabled={loading || !email}
                className="px-4 py-2 bg-[#4ade80] text-[#111827] font-bold text-xs rounded-[var(--radius-sm)] hover:bg-[#4ade80]/90 transition-all"
              >
                Join
              </button>
            </div>
          </div>

          {/* Dynamic Links from Backend */}
          {linksSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="footer-col-title">{section.section_name}</h3>
              {(section.content?.links || []).map((link: any, i: number) => (
                <Link key={i} to={link.url} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          {/* Fallback Static Col if backend empty */}
          {linksSections.length === 0 && (
            <>
              <div>
                <h3 className="footer-col-title">Shop</h3>
                <Link to="/collections/all" className="footer-link">All Products</Link>
                <Link to="/collections/stevia" className="footer-link">Stevia Range</Link>
                <Link to="/collections/monk-fruit" className="footer-link">Monk Fruit</Link>
              </div>
              <div>
                <h3 className="footer-col-title">Company</h3>
                <Link to="/benefits" className="footer-link">Our Benefits</Link>
                <Link to="/contact" className="footer-link">Contact Us</Link>
                <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              </div>
              <div>
                <h3 className="footer-col-title">Social</h3>
                <a href="#" className="footer-link">Instagram</a>
                <a href="#" className="footer-link">Twitter</a>
                <a href="#" className="footer-link">Facebook</a>
              </div>
            </>
          )}
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Grevia. Designed with love for a healthier world.
          </p>
          <div className="flex gap-4">
            <Instagram className="w-5 h-5 text-[#9ca3af] hover:text-[#4ade80] cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-[#9ca3af] hover:text-[#4ade80] cursor-pointer transition-colors" />
            <Facebook className="w-5 h-5 text-[#9ca3af] hover:text-[#4ade80] cursor-pointer transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
