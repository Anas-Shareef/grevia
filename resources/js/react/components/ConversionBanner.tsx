import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ConversionBanner = () => {
  return (
    <section className="cta-strip">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="cta-title">
            Ready to Make the <br /> 
            Sweet Switch?
          </h2>
          <p className="cta-subtitle">
            Join 50k+ health-conscious people who've already discovered the pure taste of natural sweetness. Experience Grevia today.
          </p>
          
          <div className="cta-buttons">
            <Link to="/collections/all">
              <button className="btn-cta-white">
                Shop Collection Now
              </button>
            </Link>
            <Link to="/benefits">
              <button className="btn-cta-outline">
                Learn the Benefits
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ConversionBanner;
