import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CheckCircle, XCircle, ShoppingCart, Trash2 } from 'lucide-react';
import { Order, OrderItem } from '@/types';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<Order | any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                setOrder(response.data || response);
            } catch (error) {
                console.error("Failed to fetch order", error);
                toast.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleReorder = async () => {
        setActionLoading(true);
        try {
            const response = await api.post(`/orders/${order.id}/reorder`);
            if (response.data?.success) {
                toast.success(response.data.message || "Items added to cart successfully");
                // Force reload to sync cart context from server
                window.location.href = '/cart';
            }
        } catch (error) {
            console.error("Reorder failed", error);
            toast.error("Failed to reorder items");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        setActionLoading(true);
        try {
            const response = await api.post(`/orders/${order.id}/cancel`);
            toast.success("Your order has been cancelled successfully");

            // Update local state
            setOrder((prev: any) => ({
                ...prev,
                status: 'cancelled',
                cancelled_at: new Date().toISOString()
            }));
        } catch (error: any) {
            console.error("Cancel failed", error);
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const steps = ['pending', 'processing', 'shipped', 'delivered', 'completed'];
    const currentStepIndex = steps.indexOf(order.status);
    const isCancelled = order.status === 'cancelled';
    const isRefunded = order.status === 'refunded';

    // Button Logic
    const showCancel = ['pending', 'processing'].includes(order.status);
    const showReorder = ['delivered', 'completed', 'cancelled', 'shipped'].includes(order.status);

    const getStatusIcon = (step: string, index: number) => {
        if (isCancelled || isRefunded) return <XCircle className="h-5 w-5 text-gray-400" />;
        if (index <= currentStepIndex) return <CheckCircle className="h-5 w-5 text-green-600" />;
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    };

    // Helper to compare addresses safely
    const areAddressesSame = (addr1: any, addr2: any) => {
        if (!addr1 || !addr2) return false;
        return addr1.address === addr2.address &&
            addr1.city === addr2.city &&
            addr1.pincode === addr2.pincode &&
            addr1.state === addr2.state;
    };

    const isBillingSame = areAddressesSame(order.shipping_address, order.billing_address);

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link to="/dashboard/orders">
                        <Button variant="ghost" size="icon" className="-ml-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                            Order #{order.customer_order_number || order.order_number || order.id}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={isCancelled ? 'destructive' : 'secondary'} className="h-8 px-3 py-1 uppercase tracking-wide font-semibold">
                        {order.status}
                    </Badge>

                    {/* Action Buttons */}
                    {showReorder && (
                        <Button
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary/5 gap-2"
                            onClick={handleReorder}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
                            Reorder
                        </Button>
                    )}

                    {showCancel && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Cancel Order
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to cancel this order? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleCancelOrder} className="bg-red-600 hover:bg-red-700">
                                        Yes, Cancel Order
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            {/* 1. Order Activity Timeline */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-lg font-medium text-gray-900">Order Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="relative py-2">
                        {/* Desktop Steps */}
                        <div className="hidden sm:flex justify-between items-center relative z-0">
                            <div className="absolute top-[14px] left-0 w-full h-0.5 bg-gray-100 -z-10" />
                            {steps.map((step, index) => (
                                <div key={step} className="flex flex-col items-center flex-1">
                                    <div className={`bg-white p-1 z-10 ${index <= currentStepIndex && !isCancelled ? 'text-green-600' : 'text-gray-300'}`}>
                                        {getStatusIcon(step, index)}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium uppercase tracking-wider ${index <= currentStepIndex && !isCancelled ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* Mobile Steps */}
                        <div className="sm:hidden space-y-6">
                            {steps.map((step, index) => (
                                <div key={step} className="flex gap-4">
                                    <div className="relative flex flex-col items-center">
                                        <div className="bg-white z-10">{getStatusIcon(step, index)}</div>
                                        {index !== steps.length - 1 && <div className="absolute top-5 h-full w-0.5 bg-gray-100" />}
                                    </div>
                                    <span className={`text-sm font-medium uppercase ${index <= currentStepIndex && !isCancelled ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">

                    {/* 2. Items Section (NEW) */}
                    <Card className="shadow-sm border-gray-200 overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg font-medium text-gray-900">Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {order.order_items?.map((item: OrderItem) => (
                                <div key={item.id} className="flex gap-4 p-4 sm:p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                                    {/* Image */}
                                    <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img
                                            src={item.product?.image_url || 'https://placehold.co/100'}
                                            alt={item.product?.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                        <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                                            {item.product?.name || item.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            SKU: {item.product?.slug || 'N/A'}
                                        </p>
                                        <div className="mt-2 flex items-center text-sm text-gray-500">
                                            <span>Qty: {item.quantity}</span>
                                            <span className="mx-2">•</span>
                                            <span>₹{parseFloat(item.price as unknown as string).toLocaleString()} per unit</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right flex flex-col justify-center">
                                        <span className="font-semibold text-gray-900">
                                            ₹{parseFloat(item.total as unknown as string).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Shipments */}
                    {order.shipments && order.shipments.length > 0 && (
                        <Card className="shadow-sm border-gray-200">
                            <CardHeader><CardTitle className="text-lg font-medium">Shipment Tracking</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {order.shipments.map((shipment: any) => (
                                    <div key={shipment.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div>
                                            <p className="font-semibold text-gray-900">{shipment.courier_name}</p>
                                            <p className="text-sm text-gray-500">Tracking: {shipment.tracking_number}</p>
                                        </div>
                                        {shipment.tracking_url && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={shipment.tracking_url} target="_blank" rel="noopener noreferrer">Track</a>
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                </div>

                {/* Right Column: Summary & Details */}
                <div className="space-y-6">

                    {/* 3. Order Summary */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg font-medium text-gray-900">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{parseFloat(order.subtotal).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span>{parseFloat(order.shipping) > 0 ? `₹${parseFloat(order.shipping).toLocaleString()}` : 'Free'}</span>
                            </div>
                            {parseFloat(order.discount) > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{parseFloat(order.discount).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="font-bold text-xl text-gray-900">₹{parseFloat(order.total).toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Payment Details */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg font-medium text-gray-900">Payment Details</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Method</p>
                                <p className="text-sm font-medium text-gray-900 mt-1">
                                    {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment (Razorpay)'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Status</p>
                                <div className="mt-1">
                                    <Badge variant={order.payment_status === 'paid' ? 'default' : 'outline'} className={order.payment_status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' : 'text-yellow-600 bg-yellow-50 border-yellow-200'}>
                                        {order.payment_status?.toUpperCase() || 'PENDING'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Razorpay Specifics */}
                            {order.payment_method !== 'cod' && order.transactions && order.transactions.length > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction Reference</p>
                                    <p className="text-sm font-mono text-gray-600 mt-1 break-all">
                                        {order.transactions[0].transaction_id || order.payment_settings?.payment_id || 'N/A'}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 5. Address Details */}
                    <Card className="shadow-sm border-gray-200">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-lg font-medium text-gray-900">Billing & Shipping</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Shipping Address</p>
                                {order.shipping_address ? (
                                    <div className="text-sm text-gray-600 leading-relaxed">
                                        <p className="font-medium text-gray-900">{order.name}</p>
                                        <p>{order.shipping_address.address}</p>
                                        <p>{order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}</p>
                                        <p className="mt-1 text-gray-900">{order.phone}</p>
                                    </div>
                                ) : <span className="text-sm text-gray-500">No details available</span>}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Billing Address</p>
                                {isBillingSame ? (
                                    <p className="text-sm text-gray-500 italic">Same as shipping address</p>
                                ) : (
                                    order.billing_address ? (
                                        <div className="text-sm text-gray-600 leading-relaxed">
                                            <p className="font-medium text-gray-900">{order.name}</p>
                                            <p>{order.billing_address.address}</p>
                                            <p>{order.billing_address.city}, {order.billing_address.state} - {order.billing_address.pincode}</p>
                                        </div>
                                    ) : <span className="text-sm text-gray-500">Same as shipping address</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
