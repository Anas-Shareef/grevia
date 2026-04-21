import { useState } from "react";
import { X, ChevronUp, Droplets, Utensils, Feather } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export const QuickCompareBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[80] pointer-events-none flex justify-center">
      <div className="pointer-events-auto w-full max-w-4xl bg-background border-t border-border/50 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.1)] rounded-t-3xl overflow-hidden transition-all duration-500">
        
        {/* Toggle Bar */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-14 flex items-center justify-between px-6 md:px-10 bg-forest text-cream hover:bg-forest-light transition-colors"
        >
          <div className="flex items-center gap-3">
            <Feather className="w-5 h-5 text-lime" />
            <span className="font-display font-medium text-lg">Compare Our Sweeteners</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold opacity-80 hidden md:block">Which origin is right for you?</span>
            <ChevronUp className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 py-8 md:px-10 bg-background"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                
                {/* Visual Divider on Desktop */}
                <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-border/60 -translate-x-1/2"></div>

                {/* Stevia Col */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center border border-lime/20">
                      <span className="text-xl">🌿</span>
                    </div>
                    <h4 className="text-2xl font-display font-black text-foreground">Grevia Stevia</h4>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-4">
                      <Droplets className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <strong className="block text-foreground mb-1">Sweetness Level</strong>
                        <span className="text-muted-foreground leading-snug block">High Profile. Extracts range from 200-300x sweeter than sugar. Perfect for micro-dosing.</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Utensils className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <strong className="block text-foreground mb-1">Best For</strong>
                        <span className="text-muted-foreground leading-snug block">Hot beverages, coffee, teas, and cold liquid infusions (drops).</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monk Fruit Col */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <span className="text-xl">🍈</span>
                    </div>
                    <h4 className="text-2xl font-display font-black text-foreground">Monkfruit Blend</h4>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex gap-4">
                      <Droplets className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <strong className="block text-foreground mb-1">Sweetness Level</strong>
                        <span className="text-muted-foreground leading-snug block">Smooth Profile. Often blended 1:1 with Erythritol for exact sugar volume replacement.</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Utensils className="w-5 h-5 text-amber-600 shrink-0" />
                      <div>
                        <strong className="block text-foreground mb-1">Best For</strong>
                        <span className="text-muted-foreground leading-snug block">Baking, heavy cooking, and textured desserts where volume is required.</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="mt-8 flex justify-center border-t border-border/50 pt-4 relative">
                <button 
                  onClick={() => setIsDismissed(true)}
                  className="absolute right-0 top-4 text-sm font-semibold text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  Dismiss <X className="w-4 h-4"/>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
