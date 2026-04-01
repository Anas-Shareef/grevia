import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const staticReviews = [
  {
    name: "Ananya R.",
    role: "Health Enthusiast",
    text: "Grevia has completely changed my baking game. No bitter aftertaste and my blood sugar stays perfectly level. It's a miracle sweetener!",
    rating: 5,
    avatar: "A"
  },
  {
    name: "Dr. Vikram K.",
    role: "Certified Nutritionist",
    text: "As a nutritionist, I highly recommend Grevia to my patients. It's the cleanest extraction of Stevia I've found on the Indian market.",
    rating: 5,
    avatar: "V"
  },
  {
    name: "Sneha M.",
    role: "Home Baker",
    text: "The 1:10 ratio makes it so easy to replace sugar in my recipes. My family can't even tell the difference. Simply the best!",
    rating: 5,
    avatar: "S"
  }
];

const ReviewsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-[var(--green-primary)] font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-[1.1] mb-6">
            Wall of Love
          </h2>
          <p className="text-[var(--text-muted)] text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Trusted by thousands of happy souls who've made the switch to natural sweetness.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {staticReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-[var(--bg-page)] rounded-[var(--radius-squircle)] p-10 border border-[var(--border-light)] relative group hover:shadow-[var(--shadow-card)] transition-all duration-500"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-[var(--green-primary)]/5 group-hover:scale-110 transition-transform" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[var(--green-accent)] text-[var(--green-accent)]" />
                ))}
              </div>
              
              <p className="text-[var(--text-body)] text-base font-medium leading-relaxed italic mb-8 relative z-10">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4 border-t border-[var(--border-light)] pt-8">
                <div className="w-12 h-12 rounded-2xl bg-[var(--green-primary)] text-white flex items-center justify-center font-black text-lg shadow-lg">
                  {review.avatar}
                </div>
                <div>
                  <div className="text-sm font-[900] uppercase tracking-widest text-[var(--text-heading)]">{review.name}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mt-0.5">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[var(--green-accent)]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-[var(--green-primary)]/5 blur-[100px] rounded-full" />
    </section>
  );
};

export default ReviewsSection;
