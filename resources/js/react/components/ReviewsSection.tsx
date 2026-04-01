import { motion } from "framer-motion";
import { Star } from "lucide-react";

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
    <section className="reviews-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-eyebrow">Wall of Love</span>
          <h2 className="section-title">Trusted by Thousands <br /> of Happy Souls</h2>
          <p className="section-subtitle">
            Don't just take our word for it. Here's what our community has to say about their journey to natural sweetness.
          </p>
        </div>

        {/* Step 14: Reviews Grid */}
        <div className="reviews-grid">
          {staticReviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="review-card"
            >
              <div className="review-stars flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[var(--green-primary)]" />
                ))}
              </div>
              <p className="review-text">"{review.text}"</p>
              <div className="review-author">
                <div className="review-avatar">
                  {review.avatar}
                </div>
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-meta">{review.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
