import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, MapPin, Star, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
        { icon: Package, label: 'Orders', path: '/dashboard/orders' },
        { icon: MapPin, label: 'Addresses', path: '/dashboard/addresses' },
        { icon: Star, label: 'Reviews', path: '/dashboard/reviews' },
        { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' }, // Optional integration
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="container mx-auto px-4 py-8 pt-32 flex-grow">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 bg-white rounded-lg shadow-sm h-fit p-4">
                        <div className="mb-6 pb-6 border-b text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-xl font-bold text-primary">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h3 className="font-semibold">{user?.name}</h3>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 mt-4 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={logout}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 bg-white rounded-lg shadow-sm p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
