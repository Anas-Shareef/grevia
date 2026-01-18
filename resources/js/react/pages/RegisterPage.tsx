import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RegisterPage = () => {
    const { register, loginWithGoogle, isLoading, user } = useAuth();
    const navigate = useNavigate();

    // Email State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [newsletter, setNewsletter] = useState(true);
    const [terms, setTerms] = useState(false);

    useEffect(() => {
        if (user && !isLoading) {
            navigate('/');
        }
    }, [user, isLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!terms) {
            alert("Please agree to the Terms & Conditions");
            return;
        }
        try {
            await register({
                firstName,
                lastName,
                email,
                password,
                password_confirmation: passwordConfirmation,
                newsletter
            });
        } catch (error) {
            // Error handled in context
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
            <Header />
            <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[480px] w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Create Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Join Grevia today for exclusive offers
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        required
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">Last Name *</label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        required
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password *</label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    placeholder="Min 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="password-confirm" className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
                                <Input
                                    id="password-confirm"
                                    type="password"
                                    required
                                    placeholder="Confirm password"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="h-11 rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-primary transition-all"
                                />
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="flex items-start cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/25"
                                        checked={newsletter}
                                        onChange={(e) => setNewsletter(e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Subscribe into our newsletter to get updates on our latest offers and promotions.</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/25"
                                        checked={terms}
                                        onChange={(e) => setTerms(e.target.checked)}
                                        required
                                    />
                                    <span className="ml-2 text-sm text-gray-600">I agree to the <a href="#" className="text-primary hover:underline">Terms & Conditions</a></span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                            >
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </Button>
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-400 font-medium">Or sign up with</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={loginWithGoogle}
                            disabled={isLoading}
                            className="w-full h-12 font-semibold text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Sign up with Google
                        </Button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default RegisterPage;
