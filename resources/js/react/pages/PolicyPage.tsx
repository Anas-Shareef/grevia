import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, FileText, Sparkles } from "lucide-react";

interface PolicyPageProps {
  type: "privacy" | "terms" | "refund" | "faq" | "shipping";
}

const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const settings = (window as any).GreviaSettings || {};

  let title = "";
  let content = "";
  let metaTitle = "";
  let metaDescription = "";
  let icon = <FileText className="w-8 h-8 text-[#2D6A4F]" />;

  switch (type) {
    case "privacy":
      title = "Privacy Policy";
      content = settings.policy_privacy_content || "";
      metaTitle = settings.policy_privacy_meta_title || "Privacy Policy | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_privacy_meta_description || "Read our privacy policy to understand how we collect, use, and protect your personal information.";
      icon = <ShieldCheck className="w-8 h-8 text-[#2D6A4F]" />;
      break;
    case "terms":
      title = "Terms & Conditions";
      content = settings.policy_terms_content || "";
      metaTitle = settings.policy_terms_meta_title || "Terms & Conditions | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_terms_meta_description || "Review the terms and conditions for using our website and purchasing our premium sweeteners.";
      break;
    case "refund":
      title = "Refund Policy";
      content = settings.policy_refund_content || settings.policy_return_content || "";
      metaTitle = settings.policy_refund_meta_title || settings.policy_return_meta_title || "Refund Policy | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_refund_meta_description || settings.policy_return_meta_description || "Learn about our refund and cancellation policies for Grevia sweeteners.";
      break;
    case "faq":
      title = "Frequently Asked Questions (FAQ)";
      content = settings.policy_faq_content || "";
      metaTitle = settings.policy_faq_meta_title || "FAQ | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_faq_meta_description || "Find answers to frequently asked questions about our organic Stevia and Monkfruit products.";
      icon = <Sparkles className="w-8 h-8 text-[#2D6A4F]" />;
      break;
    case "shipping":
      title = "Shipping Policy";
      content = settings.policy_shipping_content || "";
      metaTitle = settings.policy_shipping_meta_title || "Shipping Policy (India) | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_shipping_meta_description || "Read about our domestic shipping rates, delivery timelines, and order tracking information.";
      break;
  }

  useEffect(() => {
    document.title = metaTitle;
    
    // Set meta description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement("meta");
      metaDescTag.setAttribute("name", "description");
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute("content", metaDescription);
    
    window.scrollTo(0, 0);
  }, [metaTitle, metaDescription, type]);

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden font-['Montserrat']">
      <Header />

      {/* Decorative Background - Soft circular blurs matching Lykha styling */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/2 rounded-full h-1/2 bg-[#2D6A4F]/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 rounded-full h-1/2 bg-[#74B49B]/5 blur-3xl" />
      </div>

      <main className="flex-grow pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Unified Policy Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-[#E8F2EC] shadow-[0_8px_30px_rgba(45,106,79,0.06)] p-6 sm:p-10 md:p-16">
            
            {/* Header with Centered Styling */}
            <div className="mb-10 text-center">
              <span className="text-[#74B49B] text-[10px] sm:text-xs tracking-[0.3em] uppercase block mb-3 font-bold">
                Grevia Trust & Policy
              </span>
              <h1 className="font-['Montserrat'] font-black text-3xl sm:text-4xl md:text-5xl text-[#1A3C2E] mb-3 uppercase tracking-tight">
                {title}
              </h1>
              <p className="max-w-md mx-auto text-xs sm:text-sm text-gray-400">
                Everything you need to know about our {title.toLowerCase()}
              </p>
            </div>

            {/* Policy Content */}
            <div className="min-h-[200px]">
              {content ? (
                <div 
                  className="prose prose-slate max-w-none font-['Montserrat'] prose-headings:text-[#1A3C2E] prose-headings:font-bold prose-headings:font-['Montserrat'] prose-headings:first:mt-0 prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg md:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[#555555] prose-p:leading-relaxed prose-p:mt-0 prose-p:mb-5 prose-a:text-[#2D6A4F] prose-a:font-semibold prose-a:underline prose-a:hover:text-[#74B49B] prose-a:transition-colors prose-strong:text-[#1A3C2E] prose-strong:font-bold prose-li:text-[#555555] prose-li:my-1.5 prose-li:marker:text-[#74B49B] prose-ul:list-disc prose-ul:mt-0 prose-ul:mb-4 prose-ol:list-decimal prose-ol:mt-0 prose-ol:mb-4 prose-blockquote:border-l-4 prose-blockquote:border-[#74B49B] prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-500"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-[#F0F7F3] rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-[#2D6A4F]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A3C2E] mb-2">Content Coming Soon</h3>
                  <p className="text-gray-400 font-medium max-w-md mx-auto">
                    We are currently updating this policy page. Please check back shortly for the full updated details.
                  </p>
                </div>
              )}
            </div>

            {/* Footer Trust & Navigation */}
            <div className="text-center mt-12 pt-8 border-t border-[#E8F2EC]">
              <p className="text-lg font-['Montserrat'] font-bold text-[#1A3C2E] mb-2">Thank you for choosing Grevia.</p>
              <p className="text-xs text-gray-400 mb-6">Sweetness Without Sacrifice</p>
              <Link
                to="/collections/all"
                className="inline-flex items-center gap-2 bg-[#2D6A4F]/10 hover:bg-[#2D6A4F]/20 text-[#2D6A4F] px-6 py-2.5 rounded-full transition-all duration-300 font-bold text-xs uppercase tracking-wider"
              >
                Back to Shopping
              </Link>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;
