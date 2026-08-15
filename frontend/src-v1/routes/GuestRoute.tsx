import { Navigate, Outlet } from "react-router-dom";
import type { RouteProps } from "../types/TypeAuth";

function GuestRoute({ user, loading }: RouteProps) {
    if (loading) return <div>Loading...</div>;

    return user ? <Navigate to="/home" replace /> : <Outlet />;
}

export default GuestRoute;