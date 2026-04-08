import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { User, Package, MapPin, Star, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="min-h-screen flex flex-col bg-[#F5F2EA] selection:bg-primary/10 selection:text-primary">
            <Header />
            
            {/* Background Aesthetic Blobs - 'The Lovable Touch' */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <main className="flex-grow container mx-auto px-4 md:px-6 pt-44 pb-32">
                <div className="flex flex-col lg:flex-row gap-20">
                    
                    {/* Floating Pillar Sidebar Architecture */}
                    <aside className="w-full lg:w-72 shrink-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-white/80 backdrop-blur-xl rounded-[64px] shadow-[0_30px_60px_-15px_rgba(46,125,50,0.08)] border border-white/50 p-10 flex flex-col h-fit sticky top-40"
                        >
                            <div className="mb-14 text-center">
                                <div className="w-24 h-24 bg-primary/5 rounded-[40px] flex items-center justify-center mx-auto mb-6 border border-primary/10 shadow-inner group transition-all duration-500 hover:scale-105 active:scale-95">
                                    <span className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-foreground tracking-tight leading-none mb-2">{user?.name}</h3>
                                <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-widest">{user?.email}</p>
                            </div>

                            <nav className="space-y-3">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`group relative flex items-center gap-4 px-6 py-4 rounded-full text-sm font-bold transition-all duration-500 ${
                                            isActive(item.path)
                                            ? 'bg-primary text-white shadow-[0_15px_30px_-5px_rgba(46,125,50,0.4)] scale-105'
                                            : 'text-foreground/50 hover:bg-primary/5 hover:text-primary'
                                        }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                        {isActive(item.path) && (
                                            <motion.div 
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-primary rounded-full -z-10"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </Link>
                                ))}
                                
                                <div className="pt-10 mt-10 border-t border-primary/5">
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-4 h-14 rounded-full text-sm font-black text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                                        onClick={logout}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </Button>
                                </div>
                            </nav>
                        </motion.div>
                    </aside>

                    {/* Content Architecture */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardLayout;
