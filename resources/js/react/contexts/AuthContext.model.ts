import { createContext } from "react";
import { User } from "@/types";

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (values: any) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    register: (values: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
