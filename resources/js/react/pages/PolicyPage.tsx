import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ShieldCheck, FileText, Sparkles } from "lucide-react";

interface PolicyPageProps {
  type: "privacy" | "terms" | "return" | "faq" | "shipping";
}

const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const settings = (window as any).GreviaSettings || {};

  let title = "";
  let content = "";
  let metaTitle = "";
  let metaDescription = "";
  let icon = <FileText className="w-8 h-8 text-white" />;

  switch (type) {
    case "privacy":
      title = "Privacy Policy";
      content = settings.policy_privacy_content || "";
      metaTitle = settings.policy_privacy_meta_title || "Privacy Policy | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_privacy_meta_description || "Read our privacy policy to understand how we collect, use, and protect your personal information.";
      icon = <ShieldCheck className="w-8 h-8 text-white" />;
      break;
    case "terms":
      title = "Terms & Conditions";
      content = settings.policy_terms_content || "";
      metaTitle = settings.policy_terms_meta_title || "Terms & Conditions | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_terms_meta_description || "Review the terms and conditions for using our website and purchasing our premium sweeteners.";
      break;
    case "return":
      title = "Return Policy";
      content = settings.policy_return_content || "";
      metaTitle = settings.policy_return_meta_title || "Return Policy | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_return_meta_description || "Learn about our return, refund, and replacement policies for Grevia sweeteners.";
      break;
    case "faq":
      title = "Frequently Asked Questions (FAQ)";
      content = settings.policy_faq_content || "";
      metaTitle = settings.policy_faq_meta_title || "FAQ | Grevia - Premium Organic Sweeteners";
      metaDescription = settings.policy_faq_meta_description || "Find answers to frequently asked questions about our organic Stevia and Monkfruit products.";
      icon = <Sparkles className="w-8 h-8 text-white" />;
      break;
    case "shipping":
      title = "Shipping Policy (India)";
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
    <div className="min-h-screen flex flex-col bg-[#FDFDF7] font-['Montserrat']">
      <Header />

      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header Card */}
            <div className="bg-[#2E4D31] text-white p-8 md:p-12 rounded-[24px] shadow-lg mb-12 relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[80%] bg-white/5 rounded-full blur-[60px]" />
              <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[60%] bg-[#77cb4d]/10 rounded-full blur-[50px]" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#77cb4d] mb-3 inline-block">
                    Grevia Policies
                  </span>
                  <h1 className="text-3xl md:text-5xl font-black leading-tight">
                    {title}
                  </h1>
                </div>
                <div className="bg-white/10 border border-white/20 p-4 rounded-2xl self-start md:self-auto backdrop-blur-sm">
                  {icon}
                </div>
              </div>
            </div>

            {/* Content Card */}
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-8 md:p-12 shadow-sm">
              {content ? (
                <div 
                  className="prose prose-slate max-w-none prose-headings:text-[#2E4D31] prose-headings:font-black prose-p:text-[#4A4A4A] prose-p:leading-relaxed prose-a:text-[#77cb4d] prose-a:font-semibold"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-[#F0FAE8] rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-8 h-8 text-[#2E4D31]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2E4D31] mb-2">Content Coming Soon</h3>
                  <p className="text-gray-400 font-medium max-w-md mx-auto">
                    We are currently updating this policy page. Please check back shortly for the full updated details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PolicyPage;
