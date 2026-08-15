import type { ReactNode } from "react";
import type { User } from "../types/TypeAuth";
import AuthContext from "./AuthContext";
import { useState, useEffect } from "react";
import { getCsrfToken } from "../services/authService";

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [csrfToken, setCsrfToken] = useState("");

    const checkLogin = async () => {
        const res = await fetch("http://localhost:3000/home", {
            credentials: "include",
        });

        if (res.ok) {
            const data = await res.json();
            setUser(data);
        } else {
            setUser(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Lấy CSRF token
                const res = await getCsrfToken();

                if (!res.ok) {
                    throw new Error("Không lấy được CSRF token");
                }

                const data = await res.json();
                setCsrfToken(data.csrfToken);

                // 2. Kiểm tra đăng nhập
                await checkLogin();

            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        init();
    }, []);

    if (loading) return <div>dang load</div>;

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                checkLogin,
                csrfToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;