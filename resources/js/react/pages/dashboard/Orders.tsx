import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardOrders = () => {
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['my-orders'],
        queryFn: async () => {
            console.log('Fetching orders from /api/orders...');
            try {
                const data = await api.get('/orders');
                console.log('Orders received:', data);
                return data;
            } catch (err) {
                console.error('Error fetching orders:', err);
                throw err;
            }
        },
    });

    console.log('Orders component state:', { orders, isLoading, error });

    if (isLoading) {
        return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Orders</h2>

            {orders && orders.length > 0 ? (
                <div className="grid gap-4">
                    {orders.map((order: Order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <CardHeader className="bg-gray-50 py-3 px-4 flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-medium text-gray-600">{order.customer_order_number || order.order_number || order.id}</span>
                                    <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                                    {order.status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                    <p className="font-bold text-lg">₹{order.total.toLocaleString('en-IN')}</p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link to={`/dashboard/orders/${order.id}`}>
                                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
                        <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                        <Button asChild>
                            <Link to="/products/sweeteners">Start Shopping</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DashboardOrders;
