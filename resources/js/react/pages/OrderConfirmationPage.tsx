import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }
      try {
        const data = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback for missing order ID or error
  const displayOrderNumber = order ? `${order.customer_order_number || order.order_number}` : (orderId ? "Order Details" : "Order Not Found");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center py-16"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-lime/20 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <CheckCircle className="w-12 h-12 text-lime" />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4"
            >
              Order Confirmed!
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Thank you for your order. We've received your request and will process it shortly.
            </motion.p>

            {/* Order Number */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card rounded-squircle-xl p-6 border border-border/50 mb-8"
            >
              <div className="flex items-center justify-center gap-4">
                <Package className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-2xl font-black text-foreground">{displayOrderNumber}</p>
                  {order && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Total: ₹{parseFloat(order.total || order.grand_total).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Info Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mb-8"
            >
              A confirmation email will be sent to your email address with order details and tracking information.
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild variant="limeLg" size="lg">
                <Link to="/">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to={`/dashboard/orders/${order ? order.id : (orderId || '')}`}>View Order Details</Link>
              </Button>
            </motion.div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
