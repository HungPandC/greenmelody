import { useContext } from "react";
import AuthContext from "../context/AuthContext";
function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuth phải được dùng trong AuthProvider");
    }
    return auth;
}
export default useAuth;