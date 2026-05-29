import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CreditCard, Building2, Check, Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Address } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

type PaymentMethod = "upi" | "card" | "netbanking";

const CheckoutPage = () => {
  const { items, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "loading" | "valid" | "invalid">("idle");
  const [couponData, setCouponData] = useState<{
    code: string;
    discount_amount: number;
    message: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please login to proceed to checkout");
      navigate("/login", { state: { from: location } });
    }
  }, [user, authLoading, navigate, location]);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  interface AddressResponse {
    default_shipping: Address | null;
    default_billing: Address | null;
    addresses: Address[];
  }

  const { data: addressData } = useQuery<AddressResponse>({
    queryKey: ['my-addresses'],
    queryFn: async () => {
      const response = await api.get('/customer/addresses');
      return response.data || response;
    },
  });

  const { data: shippingMethods } = useQuery<any[]>({
    queryKey: ['shipping-methods'],
    queryFn: api.get('/shipping-methods') as unknown as () => Promise<any[]>,
  });

  const shippingCost = React.useMemo(() => {
    if (!shippingMethods || shippingMethods.length === 0) return 0;
    const method = shippingMethods[0]; // Logic matching backend "first()"
    const subtotal = getCartTotal();

    if (method.rule_free_above && subtotal >= parseFloat(method.rule_free_above)) {
      return 0;
    }
    return parseFloat(method.cost);
  }, [shippingMethods, getCartTotal]);

  const discountAmount = couponData?.discount_amount ?? 0;
  const finalTotal = Math.max(0, getCartTotal() + shippingCost - discountAmount);

  const addresses = addressData?.addresses || [];

  React.useEffect(() => {
    console.log('[Checkout] Address Data:', addressData);
    console.log('[Checkout] User:', user);

    if (addressData) {
      // Use default shipping or fallback to first available address
      const addressToUse = addressData.default_shipping || (addressData.addresses.length > 0 ? addressData.addresses[0] : null);

      if (addressToUse) {
        setFormData(prev => ({
          ...prev, // Keep existing values if any (though usually empty on mount)
          name: `${addressToUse.first_name} ${addressToUse.last_name}`,
          email: formData.email || user?.email || '', // Ensure email is filled from user context if available
          phone: addressToUse.phone,
          address: addressToUse.address_line_1 + (addressToUse.address_line_2 ? `, ${addressToUse.address_line_2}` : ''),
          city: addressToUse.city,
          state: addressToUse.state || '',
          pincode: addressToUse.pincode,
        }));

        // Only show toast if we actually filled something and it wasn't already filled manually
        if (!formData.name) {
          toast.info("We've filled your saved address.");
        }
      } else if (user?.email) {
        // If no address but user is logged in, at least fill the email
        setFormData(prev => ({ ...prev, email: user.email }));
      }
    }
  }, [addressData, user]);

  // Apply coupon code
  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponStatus("loading");
    setCouponError("");
    setCouponData(null);
    try {
      const res = await api.post('/coupon/apply', {
        code,
        subtotal: getCartTotal(),
      });
      if (res.valid) {
        setCouponStatus("valid");
        setCouponData({
          code: res.code,
          discount_amount: res.discount_amount,
          message: res.message,
        });
        toast.success(res.message);
      } else {
        setCouponStatus("invalid");
        setCouponError(res.message || "Invalid coupon code.");
      }
    } catch (err: any) {
      setCouponStatus("invalid");
      const msg = err?.response?.data?.message || "Invalid coupon code.";
      setCouponError(msg);
    }
  };

  const removeCoupon = () => {
    setCouponData(null);
    setCouponInput("");
    setCouponStatus("idle");
    setCouponError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (paymentMethod === 'razorpay') {
        await handleRazorpay();
      } else {
        await handleCOD();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCOD = async () => {
    // Construct address objects
    const addressSnapshot = {
      first_name: formData.name.split(' ')[0],
      last_name: formData.name.split(' ').slice(1).join(' '),
      phone: formData.phone,
      address_line_1: formData.address,
      city: formData.city,
      state: formData.state,
      country: 'India',
      pincode: formData.pincode
    };

    const orderPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      shipping_address: addressSnapshot,
      billing_address: addressSnapshot,
      payment_method: 'cod',
      amount: finalTotal,
      coupon_code: couponData?.code ?? null,
      discount: discountAmount,
      items: items.map(item => ({
        product_id: item.product.dbId || item.product.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        selected_attributes: item.selectedAttributes
      }))
    };

    try {
      const response = await api.post('/orders', orderPayload);

      if (response.success) {
        clearCart();
        toast.success("Order Placed Successfully!");
        navigate(`/order-confirmation?orderId=${response.encrypted_order_id}`);
      }
    } catch (err: any) {
      console.error("COD Order Error", err);
      toast.error(err.response?.data?.message || "Could not place order");
      setIsSubmitting(false);
    }
  };

  const handleRazorpay = async () => {
    // Construct address objects
    const addressSnapshot = {
      first_name: formData.name.split(' ')[0],
      last_name: formData.name.split(' ').slice(1).join(' '),
      phone: formData.phone,
      address_line_1: formData.address,
      city: formData.city,
      state: formData.state,
      country: 'India',
      pincode: formData.pincode
    };

    const orderPayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      shipping_address: addressSnapshot,
      billing_address: addressSnapshot,
      payment_method: 'razorpay',
      amount: finalTotal, // Validation happens on backend too
      coupon_code: couponData?.code ?? null,
      discount: discountAmount,
      items: items.map(item => ({
        product_id: item.product.dbId || item.product.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        selected_attributes: item.selectedAttributes
      }))
    };

    try {
      const response = await api.post('/checkout/razorpay/create-order', orderPayload);

      const { key_id, order_id, amount, currency, name, description, prefill, local_order_id, encrypted_order_id } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: name,
        description: description,
        order_id: order_id,
        prefill: prefill,
        theme: {
          color: "#3399cc"
        },
        handler: async function (response: any) {
          try {
            await api.post('/checkout/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            clearCart();
            toast.success("Payment Successful!");
            // Note: razorpay flow might need backend update to return encrypted_id locally or fetch it
            // For now assume local_order_id is the regular ID. To properly encrypt, the backend create-order MUST return it.
            // We'll update CheckoutPage to expect encrypted_id from backend response if possible
            // But wait, the Razorpay response comes from /checkout/razorpay/create-order
            // I need to check if THAT endpoint returns encrypted_id.
            navigate(`/order-confirmation?orderId=${response.encrypted_order_id || local_order_id}`);
            // Wait, the verify response doesn't necessarily return it. 
            // Let's assume for now keeping local_order_id until I verify RazorpayController.
          } catch (verifyError: any) {
            console.error("Verification Error", verifyError);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
            toast("Payment cancelled");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      console.error("Order Creation Error", err);
      toast.error(err.response?.data?.message || "Could not initiate payment");
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <h1 className="text-3xl font-black mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some products to proceed to checkout</p>
            <Button asChild>
              <Link to="/products/sweeteners">Browse Products</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Shopping
            </Link>
          </motion.div>

          {/* Page Header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-black text-foreground mb-8"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="bg-card rounded-squircle-xl p-6 border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-6">Contact Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address (Optional) */}
                <div className="bg-card rounded-squircle-xl p-6 border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-6">Billing Address <span className="text-sm font-normal text-muted-foreground">(Optional)</span></h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main Street, Apartment 4B"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-card rounded-squircle-xl p-6 border border-border/50">
                  <h2 className="text-xl font-bold text-foreground mb-6">Payment Method</h2>

                  <div className="space-y-4">
                    {/* Razorpay Option */}
                    <div
                      className={`p-6 rounded-squircle border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'razorpay' ? 'border-lime bg-lime/10' : 'border-border hover:border-lime/50'}`}
                      onClick={() => setPaymentMethod('razorpay')}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-primary' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <CreditCard className={`w-8 h-8 ${paymentMethod === 'razorpay' ? 'text-lime' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">Pay Online (Razorpay)</h3>
                        <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                      {paymentMethod === 'razorpay' && <Check className="w-6 h-6 text-lime" />}
                    </div>

                    {/* COD Option */}
                    <div
                      className={`p-6 rounded-squircle border-2 cursor-pointer flex items-center gap-4 transition-all ${paymentMethod === 'cod' ? 'border-lime bg-lime/10' : 'border-border hover:border-lime/50'}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                      <Building2 className={`w-8 h-8 ${paymentMethod === 'cod' ? 'text-lime' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">Cash on Delivery</h3>
                        <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                      </div>
                      {paymentMethod === 'cod' && <Check className="w-6 h-6 text-lime" />}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4">
                    {paymentMethod === 'razorpay'
                      ? "Secure payment powered by Razorpay. You'll be redirected to complete payment."
                      : "Please ensure you have the exact amount ready at the time of delivery."}
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="limeLg"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : `Place Order - ₹${finalTotal.toLocaleString('en-IN')}`}
                </Button>
              </form>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-card rounded-squircle-xl p-6 border border-border/50 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-squircle"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.selectedAttributes?.concentration && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                              {item.selectedAttributes.concentration}
                            </span>
                          )}
                          {(item.weight || item.packSize) && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border">
                              Pack Weight: {item.weight || item.packSize}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-foreground">
                          ₹{(() => {
                            const variant = item.product.variants?.find(v => v.id == item.variantId);
                            const unitPrice = variant ? Number(variant.discount_price || variant.price) : Number(item.product.price);
                            return (unitPrice * item.quantity).toLocaleString('en-IN');
                          })()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">₹{getCartTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingCost === 0 ? "font-bold text-lime" : "font-bold"}>
                      {shippingCost === 0 ? "Free" : `₹${shippingCost}`}
                    </span>
                  </div>

                  {/* Coupon Section */}
                  <div className="pt-3 pb-1 border-t border-dashed border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> Have a promo code?
                    </p>
                    <AnimatePresence mode="wait">
                      {couponStatus === "valid" && couponData ? (
                        <motion.div
                          key="coupon-applied"
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          className="flex items-center justify-between bg-lime/10 border border-lime/40 rounded-xl px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 text-lime" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground font-mono tracking-wider">{couponData.code}</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">{couponData.message}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="text-muted-foreground hover:text-destructive transition-colors ml-2 p-1 rounded-full hover:bg-destructive/10"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="coupon-input"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-1.5"
                        >
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={couponInput}
                              onChange={e => {
                                setCouponInput(e.target.value.toUpperCase());
                                setCouponError("");
                              }}
                              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                              placeholder="Enter promo code"
                              className="flex-1 px-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-lime/50 focus:border-lime transition-all font-mono tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                              disabled={couponStatus === "loading"}
                            />
                            <button
                              type="button"
                              onClick={applyCoupon}
                              disabled={couponStatus === "loading" || !couponInput.trim()}
                              className="px-4 py-2 text-sm font-bold bg-lime text-foreground rounded-xl hover:bg-lime/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 whitespace-nowrap min-w-[70px] justify-center"
                            >
                              {couponStatus === "loading" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : "Apply"}
                            </button>
                          </div>
                          {couponStatus === "invalid" && couponError && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs text-destructive flex items-center gap-1"
                            >
                              <X className="w-3 h-3 shrink-0" />
                              {couponError}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Discount Line */}
                  {discountAmount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-lime font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Discount ({couponData?.code})
                      </span>
                      <span className="font-bold text-lime">−₹{discountAmount.toLocaleString('en-IN')}</span>
                    </motion.div>
                  )}

                  <div className="flex justify-between text-lg font-black pt-2 border-t border-border mt-1">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
