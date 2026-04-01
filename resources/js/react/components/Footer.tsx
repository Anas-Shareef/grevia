import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import greviaLogo from "@/assets/grevia-logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [data, setData] = useState<any[]>([]);

  // useQuery to fetch footer content
  const { data: footerData } = useQuery<any[]>({
    queryKey: ['footer-content'],
    queryFn: () => api.get('/content/footer'),
  });

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribe({ email, source: 'footer' });
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to subscribe.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Safe wrapper for all data items
  const activeSections = footerData || [];

  // Group sections by type
  const textSections = activeSections.filter(s => s.type === 'text');
  const linksSections = activeSections.filter(s => s.type === 'links');
  const socialSection = activeSections.find(s => s.type === 'social');
  
  // Fallbacks if backend is completely empty
  const defaultAbout = {
    section_name: 'About Us',
    content: { text: "Experience the pure taste of nature with our premium organic sweeteners." }
  };
  
  const defaultSocials = [
    { platform: "Instagram", url: "#" },
    { platform: "Twitter", url: "#" },
    { platform: "Facebook", url: "#" },
  ];

  const getIcon = (platform: string) => {
    switch (platform?.toLowerCase() || '') {
      case 'instagram': return Instagram;
      case 'twitter': return Twitter;
      case 'facebook': return Facebook;
      default: return Mail;
    }
  };

  return (
    <footer className="bg-primary text-white py-16 md:py-24 border-t border-primary/10" role="contentinfo">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-16 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <img
                src={greviaLogo}
                alt="Grevia - Healthy Natural Foods"
                className="h-10 w-auto brightness-0 invert opacity-90"
              />
            </Link>
            <div className="text-secondary-foreground/60 max-w-sm mb-8 leading-relaxed space-y-4 font-medium italic">
              {textSections.length > 0 ? (
                textSections.map((section, idx) => (
                  <div key={idx}>
                    {section.content?.text ? <div dangerouslySetInnerHTML={{ __html: section.content.text }} className="opacity-80" /> : null}
                  </div>
                ))
              ) : (
                <div dangerouslySetInnerHTML={{ __html: defaultAbout.content.text }} className="opacity-80" />
              )}
            </div>
            {/* Newsletter */}
            <div className="flex gap-2 max-w-md">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-accent-green/20 transition-all outline-none text-white"
                  aria-label="Email address for newsletter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleSubscribe}
                disabled={loading || !email}
                className="px-6 bg-accent-green text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-accent-green/90 transition-all active:scale-95 disabled:opacity-50"
                aria-label="Subscribe to newsletter"
              >
                {loading ? '...' : 'Join'}
              </button>
            </div>
          </div>

          {/* Links */}
          {linksSections.length > 0 ? (
            linksSections.map((section: any, colIdx: number) => (
              <div key={colIdx}>
                <h3 className="font-bold text-lg mb-4">{section.section_name}</h3>
                <ul className="space-y-3">
                  {(section.content?.links || []).map((link: any, linkIdx: number) => {
                    const isExternal = link.url.startsWith('http');
                    if (isExternal) {
                      return (
                        <li key={linkIdx}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-foreground/70 hover:text-lime transition-colors"
                          >
                            {link.label}
                          </a>
                        </li>
                      );
                    }
                    return (
                      <li key={linkIdx}>
                        <Link
                          to={link.url}
                          className="text-primary-foreground/70 hover:text-lime transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            // Default Layout if empty
            <>
              <div>
                <h3 className="font-bold text-lg mb-4">Shop</h3>
                <ul className="space-y-3">
                  <li><a href="/products" className="text-primary-foreground/70 hover:text-lime">All Products</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#about" className="text-primary-foreground/70 hover:text-lime">About Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-3">
                  <li><a href="/contact" className="text-primary-foreground/70 hover:text-lime">Contact</a></li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {currentYear} Grevia. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {(socialSection?.content?.socials || defaultSocials).map((social: any, idx: number) => {
              const Icon = getIcon(social.platform);
              return (
                <a
                  key={idx}
                  href={social.url}
                  aria-label={social.platform}
                  className="w-10 h-10 bg-primary-foreground/10 rounded-squircle flex items-center justify-center hover:bg-lime hover:text-foreground transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
