import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { User } from "@/types";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (values: any) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (values: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();
    const location = useLocation();

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const userData = await api.get('/profile');
            setUser(userData);
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (values: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/login', {
                email: values.email,
                password: values.password
            });

            localStorage.setItem('token', response.token);
            setUser(response.user);

            toast({
                title: "Login Successful",
                description: "Welcome back!",
            });
            const origin = (location.state as any)?.from?.pathname || '/';
            navigate(origin);
        } catch (error: any) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "Invalid credentials",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (values: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/register', {
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                password: values.password,
                password_confirmation: values.password, // Assuming frontend validation ensures match
                newsletter: values.newsletter
            });

            localStorage.setItem('token', response.token);
            setUser(response.user);

            toast({
                title: "Registration Successful",
                description: "Your account has been created.",
            });
            navigate('/');
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Registration Failed",
                description: error.message || "Registration failed",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await api.post('/logout', {});
            localStorage.removeItem('token');
            localStorage.removeItem('grevia_cart'); // Clear cart from localStorage
            setUser(null);
            navigate('/login');
            toast({
                title: "Logged Out",
                description: "You have been logged out successfully.",
            });
        } catch (error) {
            console.error("Logout failed", error);
            // Force local cleanup anyway
            localStorage.removeItem('token');
            setUser(null);
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    };


    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const email = result.user.email;
            const displayName = result.user.displayName;

            const payload = {
                token,
                email,
                name: displayName,
                firebase_email: email, // New diagnostic field
                newsletter: true
            };

            console.log("SENDING TO BACKEND /auth/firebase:", payload);

            // Send to backend to verify & create session
            const response = await api.post('/auth/firebase', payload);

            localStorage.setItem('token', response.token);
            setUser(response.user);

            toast({
                title: "Login Successful",
                description: `Welcome, ${response.user.name}!`,
            });
            const origin = (location.state as any)?.from?.pathname || '/';
            navigate(origin);
        } catch (error: any) {
            console.error("Google Login Error", error);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "Failed to sign in with Google",
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkAuth, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

