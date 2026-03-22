import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import greviaLogo from "@/assets/grevia-logo.png";
import { useState } from "react";
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
    queryFn: api.get('/content/footer') as unknown as () => Promise<any[]>,
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
    <footer className="bg-foreground text-primary-foreground py-16 md:py-20" role="contentinfo">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <img
                src={greviaLogo}
                alt="Grevia - Healthy Natural Foods"
                className="h-12 w-auto brightness-0 invert"
              />
            </a>
            <div className="text-primary-foreground/70 max-w-sm mb-6 leading-relaxed space-y-4">
              {textSections.length > 0 ? (
                textSections.map((section, idx) => (
                  <div key={idx}>
                    {section.content?.text ? <div dangerouslySetInnerHTML={{ __html: section.content.text }} /> : null}
                  </div>
                ))
              ) : (
                <div dangerouslySetInnerHTML={{ __html: defaultAbout.content.text }} />
              )}
            </div>
            {/* Newsletter */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-12 bg-primary-foreground/10 rounded-squircle pl-12 pr-4 text-primary-foreground placeholder:text-primary-foreground/50 border border-primary-foreground/20 focus:border-lime focus:outline-none transition-colors"
                  aria-label="Email address for newsletter"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleSubscribe}
                disabled={loading || !email}
                className="h-12 px-6 bg-lime text-foreground font-bold rounded-squircle hover:bg-lime-glow transition-colors disabled:opacity-50"
                aria-label="Subscribe to newsletter"
              >
                {loading ? '...' : 'Subscribe'}
              </button>
            </div>
          </div>

          {/* Links */}
          {linksSections.length > 0 ? (
            linksSections.map((section: any, colIdx: number) => (
              <div key={colIdx}>
                <h3 className="font-bold text-lg mb-4">{section.section_name}</h3>
                <ul className="space-y-3">
                  {(section.content?.links || []).map((link: any, linkIdx: number) => (
                    <li key={linkIdx}>
                      <a
                        href={link.url}
                        className="text-primary-foreground/70 hover:text-lime transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
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
