// import { useBenefitsPage } from "@/hooks/useBenefitsPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Heart, Zap, Scale, Brain, Sparkles, Droplets, Shield, Check, X, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const iconMap: Record<string, any> = {
  Leaf, Heart, Zap, Scale, Brain, Sparkles, Droplets, Shield
};

const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://localhost:8000/storage';

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const BenefitsPage = () => {
  const { data: pageData, isLoading, error } = useQuery<any>({
    queryKey: ['benefits-page'],
    queryFn: async () => {
      console.log('Fetching benefits page...');
      const data = await api.get('/content/benefits-page');
      console.log('Benefits page data received:', data);
      return data;
    },
  });

  console.log('BenefitsPage render:', { pageData, isLoading, error });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    console.error('Benefits page error:', error);
    return <div className="min-h-screen flex items-center justify-center">Error loading content: {String(error)}</div>;
  }

  if (!pageData || !pageData.hero) {
    console.error('Invalid page data structure:', pageData);
    return <div className="min-h-screen flex items-center justify-center">Invalid content structure.</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* 1. HERO SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-lime/10 to-background relative overflow-hidden">
          {pageData.hero.background_image && (
            <div className="absolute inset-0 z-0 opacity-10">
              <img src={`${STORAGE_URL}/${pageData.hero.background_image}`} alt="Hero bg" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
            {pageData.hero.badge && (
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-4 py-1.5 bg-lime/20 text-foreground text-sm font-medium rounded-full mb-6"
              >
                {pageData.hero.badge}
              </motion.span>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6"
            >
              {pageData.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto whitespace-pre-wrap"
            >
              {pageData.hero.subtitle}
            </motion.p>
          </div>
        </section>

        {/* 2. STORY SECTIONS (Iterate through Sections) */}
        {/* 2. STORY SECTIONS (Iterate through Sections) */}
        {pageData.sections?.map((section, idx) => {
          // if (!section.is_active) return null; // Field not in DB
          const hasImage = !!section.image;
          // alignment 'left' = Image Left, Text Right. 'right' = Text Left, Image Right.
          const isImageLeft = section.alignment === 'left';

          console.log(`Rendering Section ${idx}:`, section); // DEBUG LOG


          return (
            <section key={idx} className={`py-12 md:py-24 ${idx % 2 !== 0 ? 'bg-secondary/30' : ''}`}>
              <div className="container mx-auto px-4 md:px-6">
                {/* Story Content */}
                {/* Mobile: Stacked (Image First naturally). Desktop: Grid. */}
                <div className={`grid gap-8 lg:gap-16 items-center mb-12 lg:mb-16 ${hasImage ? 'lg:grid-cols-2' : ''}`}>

                  {/* Image Column - Always Render First for Mobile Top Placement */}
                  {hasImage && (
                    <motion.div
                      initial={{ opacity: 0, x: isImageLeft ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className={`relative w-full ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}
                    >
                      <div className="aspect-square md:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
                        <img
                          src={`${STORAGE_URL}/${section.image}`}
                          alt={section.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Decorative blob only on desktop/tablet to avoid mobile clutter */}
                      <div className={`absolute -bottom-6 ${isImageLeft ? '-left-6' : '-right-6'} w-32 h-32 ${idx % 2 !== 0 ? 'bg-amber-400/30' : 'bg-lime/30'} rounded-full blur-3xl hidden md:block`} />
                    </motion.div>
                  )}

                  {/* Text Column */}
                  <motion.div
                    initial={{ opacity: 0, x: isImageLeft ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    // If image exists, use order classes. If no image, center the text or full width.
                    className={`relative ${hasImage ? (isImageLeft ? 'lg:order-2' : 'lg:order-1') : 'text-center max-w-4xl mx-auto'}`}
                  >
                    {section.badge && (
                      <span className={`inline-block px-3 py-1 ${idx % 2 !== 0 ? 'bg-amber-400/20' : 'bg-lime/20'} text-foreground text-sm font-medium rounded-full mb-4`}>
                        {section.badge}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-wrap">
                      {section.description}
                    </p>
                  </motion.div>
                </div>

                {/* Nested Features Grid - Responsive Columns */}
                {section.features && section.features.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {section.features.sort((a, b) => a.order - b.order).map((feature, fIdx) => {
                      // if (!feature.is_active) return null; // Field not in DB
                      const IconComponent = iconMap[feature.icon] || Sparkles;

                      return (
                        <motion.div
                          key={fIdx}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: fIdx * 0.1 }}
                          className={`bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 ${idx % 2 !== 0 ? 'hover:border-amber-400/30' : 'hover:border-lime/30'}`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${idx % 2 !== 0 ? 'bg-amber-400/20 text-amber-500' : 'bg-lime/20 text-lime'}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          );
        })}

        {/* 3. COMPARISON SECTION */}
        {pageData.comparison && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {pageData.comparison.title}
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto whitespace-pre-wrap">
                  {pageData.comparison.subtitle}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-3xl overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
                  {pageData.comparison.columns?.map((col, cIdx) => (
                    <div key={cIdx} className={`p-8 text-center ${col.type === 'success' ? 'bg-lime/5' : ''}`}>
                      <h3 className={`text-xl font-semibold mb-4 ${col.type === 'success' ? 'text-lime' : 'text-foreground'}`}>
                        {col.title}
                      </h3>
                      <ul className="space-y-3 text-sm">
                        {col.points?.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-center justify-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6">
                              {point.type === 'danger' && <X className="w-5 h-5 text-red-500" />}
                              {point.type === 'success' && <Check className="w-5 h-5 text-lime" />}
                              {point.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
                            </span>
                            <span className={`${point.type === 'success' ? 'text-foreground' : 'text-muted-foreground'} text-left`}>
                              {point.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* 4. CTA SECTION */}
        {pageData.cta && pageData.cta.title && (
          <section className="py-16 md:py-24 relative overflow-hidden">
            {pageData.cta.background_image && (
              <div className="absolute inset-0 z-0">
                <img
                  src={`${STORAGE_URL}/${pageData.cta.background_image}`}
                  alt="CTA Background"
                  className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background/60" />
              </div>
            )}
            <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
                  {pageData.cta.title}
                </h2>
                {pageData.cta.subtitle && (
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 whitespace-pre-wrap">
                    {pageData.cta.subtitle}
                  </p>
                )}
                {pageData.cta.button_text && pageData.cta.button_link && (
                  <Button
                    asChild
                    size="lg"
                    className="bg-lime hover:bg-lime/90 text-background font-semibold px-8 py-6 text-lg"
                  >
                    <Link to={pageData.cta.button_link}>
                      {pageData.cta.button_text}
                    </Link>
                  </Button>
                )}
              </motion.div>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default BenefitsPage;
