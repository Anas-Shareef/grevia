import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Step 18: Micro-interactions - Scroll reveal on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('opacity-100');
      e.target.classList.add('translate-y-0');
      e.target.classList.remove('opacity-0');
      e.target.classList.remove('translate-y-5');
    }
  });
}, { threshold: 0.1 });

window.addEventListener('load', () => {
  document.querySelectorAll('.product-card, .benefit-card, .review-card, .ingredient-card, .section-header').forEach(el => {
    el.classList.add('reveal-animation');
    observer.observe(el);
  });
});
