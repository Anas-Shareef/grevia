import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, MapPin, Star, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
        { icon: Package, label: 'Orders', path: '/dashboard/orders' },
        { icon: MapPin, label: 'Addresses', path: '/dashboard/addresses' },
        { icon: Star, label: 'Reviews', path: '/dashboard/reviews' },
        { icon: Heart, label: 'Wishlist', path: '/dashboard/wishlist' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-[#F5F2EA]">
            <Header />
            <div className="container mx-auto px-4 md:px-6 py-12 pt-40 flex-grow">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[32px] shadow-[0_8px_30px_rgba(46,125,50,0.04)] border border-primary/5 p-8"
                        >
                            <div className="mb-10 text-center relative">
                                <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-5 border border-primary/10 relative overflow-hidden group">
                                    <span className="text-3xl font-black text-primary relative z-10">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <h3 className="text-xl font-black text-foreground tracking-tight mb-1">{user?.name}</h3>
                                <p className="text-sm font-medium text-foreground/40">{user?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`group flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                            isActive(item.path)
                                            ? 'bg-primary text-white shadow-[0_10px_20px_-5px_rgba(46,125,50,0.3)]'
                                            : 'text-foreground/60 hover:bg-primary/5 hover:text-primary'
                                        }`}
                                    >
                                        <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive(item.path) ? '' : 'group-hover:scale-110'}`} />
                                        {item.label}
                                    </Link>
                                ))}
                                
                                <div className="pt-8 mt-8 border-t border-primary/5">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-4 h-auto py-4 px-5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                                        onClick={logout}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </Button>
                                </div>
                            </nav>
                        </motion.div>
                    </aside>

                    {/* Content Area */}
                    <main className="flex-1 min-w-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Outlet />
                        </motion.div>
                    </main>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
