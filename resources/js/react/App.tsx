import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import BenefitsPage from "./pages/BenefitsPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionsIndex from "./pages/CollectionsIndex";
import CartDrawer from "./components/CartDrawer";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardProfile from "@/pages/dashboard/Profile";
import DashboardOrders from "@/pages/dashboard/OrdersPage";
import DashboardOrderDetail from "@/pages/dashboard/OrderDetailPage";
import DashboardAddresses from "@/pages/dashboard/AddressesPage";
import DashboardReviews from "@/pages/dashboard/ReviewsPage";
import NewsletterPopup from "@/components/NewsletterPopup";

import React, { useMemo, useEffect } from "react";

const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  useEffect(() => {
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

    document.querySelectorAll('.product-card, .benefit-card, .review-card, .ingredient-card, .section-header').forEach(el => {
      el.classList.add('reveal-animation');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster />
              <Sonner />
              <CartDrawer />
              <NewsletterPopup />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="/dashboard/profile" replace />} />
                  <Route path="profile" element={<DashboardProfile />} />
                  <Route path="orders" element={<DashboardOrders />} />
                  <Route path="orders/:id" element={<DashboardOrderDetail />} />
                  <Route path="addresses" element={<DashboardAddresses />} />
                  <Route path="reviews" element={<DashboardReviews />} />
                  <Route path="wishlist" element={<WishlistPage isDashboard={true} />} />
                </Route>

                <Route path="/collections" element={<CollectionsIndex />} />
                <Route path="/collections/all" element={<CollectionsPage />} />
                <Route path="/collections/:category" element={<CollectionsPage />} />
                <Route path="/collections/:category/:subcategory" element={<CollectionsPage />} />
                <Route path="/products/sweeteners" element={<Navigate to="/collections" replace />} />
                <Route path="/sweeteners" element={<Navigate to="/collections" replace />} />
                <Route path="/products" element={<Navigate to="/collections" replace />} />
                <Route path="/product/:id" element={<Navigate to="/products/:id" replace />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/benefits" element={<BenefitsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
      </QueryClientProvider>
    );
};

export default App;
