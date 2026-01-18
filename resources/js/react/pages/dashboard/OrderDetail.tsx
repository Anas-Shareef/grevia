import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api, STORAGE_URL } from '@/lib/api';
import { Order, OrderItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, CreditCard, Download, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const DashboardOrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: order, isLoading } = useQuery<Order>({
        queryKey: ['order', id],
        queryFn: async () => {
            const data = await api.get(`/orders/${id}`);
            return data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!order) {
        return <div className="text-center py-12">Order not found</div>;
    }

    const items = order.order_items || order.items || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link to="/dashboard/orders"><ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders</Link>
                </Button>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        Order #{order.id}
                        <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                            {order.status}
                        </Badge>
                    </h2>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <Button variant="outline" onClick={() => window.print()}>
                    <Download className="w-4 h-4 mr-2" /> Download Invoice
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {items.map((item: OrderItem) => (
                                <div key={item.id} className="flex items-start gap-4 py-4 border-b last:border-0">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                        {(item.product?.image || item.product?.image_url) && (
                                            <img
                                                src={item.product.image_url || `${STORAGE_URL}/${item.product.image}`}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.product?.name || 'Product'}</h4>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{item.total.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-gray-500">₹{item.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span>₹{order.shipping?.toLocaleString('en-IN') || '0'}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString('en-IN')}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Details</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600 space-y-2">
                            {/* Note: Order model might store address as string or JSON. Assuming flat fields based on controller store method */}
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">{order.name || 'User'}</p>
                                    <p>{order.address}</p>
                                    <p>{order.city}, {order.pincode}</p>
                                    <p>{order.phone}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                <span className="capitalize">{order.payment_method?.replace('_', ' ')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardOrderDetail;
