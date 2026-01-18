import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders');
                setOrders(Array.isArray(response) ? response : response.data || []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Orders</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No orders found.</p>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-gray-500 border-b">
                                        <tr>
                                            <th className="py-3 px-4">Order #</th>
                                            <th className="py-3 px-4">Date</th>
                                            <th className="py-3 px-4">Total</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order: any) => (
                                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4 font-medium">{order.customer_order_number || order.order_number || order.id}</td>
                                                <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="py-3 px-4">₹{order.total}</td>
                                                <td className="py-3 px-4">
                                                    <Badge variant={
                                                        order.status === 'completed' ? 'default' :
                                                            order.status === 'cancelled' ? 'destructive' :
                                                                order.status === 'processing' ? 'secondary' : 'outline'
                                                    }>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <Link to={`/dashboard/orders/${order.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4 mr-1" /> View
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {orders.map((order: any) => (
                                    <div key={order.id} className="border rounded-lg p-4 space-y-3 bg-card">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-sm font-bold">{order.customer_order_number || order.order_number || order.id}</span>
                                                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant={
                                                order.status === 'completed' ? 'default' :
                                                    order.status === 'cancelled' ? 'destructive' :
                                                        order.status === 'processing' ? 'secondary' : 'outline'
                                            }>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </div>

                                        <div className="flex justify-between items-center text-sm pt-2 border-t">
                                            <span className="text-muted-foreground">Total Amount</span>
                                            <span className="font-bold">₹{order.total}</span>
                                        </div>

                                        <Link to={`/dashboard/orders/${order.id}`} className="block">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Eye className="h-4 w-4 mr-2" /> View Details
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OrdersPage;
