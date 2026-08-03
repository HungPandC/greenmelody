import { Navigate, Outlet } from "react-router-dom";
import type { RouteProps } from "../types/TypeAuth";


function ProtectedRoute({ user, loading }: RouteProps) {
    console.log("ProtectedRoute user:", user);
    if (loading) return <div>Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;