import type { ReactNode } from "react";
import type { User } from "../types/TypeAuth";
import AuthContext from "./AuthContext";
import { useState,useEffect } from "react";


function AuthProvider({ children }: { children: ReactNode }){
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        async function checkLogin() {
            const res = await fetch("http://localhost:3000/home", {
                credentials: "include",
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }

            setLoading(false);
        }

        checkLogin();
    }, []);

    if (loading) return <div>dang load</div>;

  return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
  )
}

export default AuthProvider;