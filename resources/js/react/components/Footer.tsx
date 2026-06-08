import { Send, Instagram, Twitter, Facebook, Linkedin, Youtube, Link as LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

const Footer = () => {
  const { data: footerSections } = useQuery<any[]>({
    queryKey: ['footer-sections'],
    queryFn: () => api.get('/content/footer'),
  });

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'facebook':
        return <Facebook className="w-5 h-5" />;
      case 'twitter':
      case 'x':
        return <Twitter className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      case 'youtube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  // Fallback defaults
  const defaultLinks = {
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
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
    ],
  };

  const defaultSocials = [
    { label: "Instagram", icon: <Instagram className="w-5 h-5" />, href: (window as any).GreviaSettings?.instagram_url || "#" },
    { label: "Facebook", icon: <Facebook className="w-5 h-5" />, href: (window as any).GreviaSettings?.facebook_url || "#" },
  ];

  // 1. Text description
  const textSection = footerSections?.find(s => s.type === 'text' && !s.section_name.toLowerCase().includes('copyright'));
  const footerText = textSection?.content?.text || "Experience the pure taste of nature with our premium organic sweeteners. Zero calories, zero guilt, endless flavor.";

  // 2. Link Columns
  const linkSections = footerSections?.filter(s => s.type === 'links');
  const hasLinkSections = linkSections && linkSections.length > 0;

  // 3. Social profiles
  const socialSection = footerSections?.find(s => s.type === 'social');
  const socialsList = socialSection?.content?.socials;
  const hasSocials = socialsList && socialsList.length > 0;

  // 4. Copyright
  const copyrightSection = footerSections?.find(s => s.type === 'text' && s.section_name.toLowerCase().includes('copyright'));
  const rawCopyright = copyrightSection?.content?.text;
  const copyrightText = rawCopyright 
    ? rawCopyright.replace(/<[^>]*>/g, '') 
    : "© 2026 Grevia. All rights reserved.";

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
            {textSection?.content?.text ? (
              <div 
                className="text-white/60 max-w-sm mb-8 leading-relaxed text-sm prose prose-invert"
                dangerouslySetInnerHTML={{ __html: textSection.content.text }}
              />
            ) : (
              <p className="text-white/60 max-w-sm mb-8 leading-relaxed text-sm">
                {footerText}
              </p>
            )}

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

          {/* Dynamic or Fallback Columns */}
          {hasLinkSections ? (
            linkSections.map((section: any) => (
              <div key={section.id} className="lg:col-span-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
                  {section.section_name}
                </h3>
                <ul className="space-y-3">
                  {(section.content?.links || []).map((link: any, idx: number) => {
                    const isExternal = link.url.startsWith('http') || link.url.startsWith('//');
                    return (
                      <li key={idx}>
                        {isExternal ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/70 hover:text-white text-sm transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.url}
                            className="text-white/70 hover:text-white text-sm transition-colors"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Shop Column Fallback */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
                  Shop
                </h3>
                <ul className="space-y-3">
                  {defaultLinks.shop.map((link) => (
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

              {/* Company Column Fallback */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
                  Company
                </h3>
                <ul className="space-y-3">
                  {defaultLinks.company.map((link) => (
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

              {/* Support Column Fallback */}
              <div className="lg:col-span-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-5">
                  Support
                </h3>
                <ul className="space-y-3">
                  {defaultLinks.support.map((link) => (
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
            </>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-xs text-white/30">
              {copyrightText}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                to="/privacy-policy"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-conditions"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                to="/refund-policy"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                to="/shipping-policy"
                className="text-xs text-white/30 hover:text-white transition-colors"
              >
                Shipping Policy
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasSocials ? (
              socialsList.map((social: any, idx: number) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))
            ) : (
              defaultSocials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white hover:text-primary transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="text-[10px] text-white/20 mt-6 text-center border-t border-white/5 pt-4">
          Debug - Footer Sections: {footerSections ? JSON.stringify(footerSections) : 'undefined/null'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
