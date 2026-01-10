import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/axios";

type User = {
    id: string;
    name: string;
    email: string;
    role: "student" | "instructor";
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (userData: User, token: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: async () => { },
    logout: async () => { },
    loading: true,
});

type Props = { children: ReactNode };

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                // set token for axios default headers
                API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.log("Failed to load user from storage", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        API.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("token", authToken);
    };

    const logout = async () => {
        setUser(null);
        setToken(null);
        API.defaults.headers.common["Authorization"] = "";
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
