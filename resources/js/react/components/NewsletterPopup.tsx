import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        // Check if already subscribed or dismissed recently
        const isSubscribed = localStorage.getItem('newsletter_subscribed');
        const dismissedAt = localStorage.getItem('newsletter_dismissed_at');
        const now = new Date().getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (isSubscribed) return;
        if (dismissedAt && now - parseInt(dismissedAt) < sevenDays) return;

        const handleScroll = () => {
            if (isOpen) return;

            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const scrollPercentage = (scrollPosition / scrollHeight) * 100;

            if (scrollPercentage >= 60 && scrollPercentage <= 70) {
                // Check session flag to ensure only once per session if not dismissed yet
                if (!sessionStorage.getItem('newsletter_popup_shown')) {
                    setIsOpen(true);
                    sessionStorage.setItem('newsletter_popup_shown', 'true');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen]);

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem('newsletter_dismissed_at', new Date().getTime().toString());
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.subscribe({ email, source: 'popup' });
            localStorage.setItem('newsletter_subscribed', 'true');
            setIsOpen(false);
            toast({
                title: "Success!",
                description: "You've been subscribed to our newsletter.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to subscribe. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-0">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 text-center">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900">Join Our Newsletter</h2>
                            <p className="mb-6 text-gray-600">
                                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                            </p>

                            <form onSubmit={handleSubscribe} className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full"
                                />
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white hover:bg-primary/90"
                                >
                                    {loading ? 'Subscribing...' : 'Subscribe'}
                                </Button>
                            </form>

                            <button
                                onClick={handleDismiss}
                                className="mt-4 text-sm text-gray-500 hover:underline"
                            >
                                No thanks, I'm not interested
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
