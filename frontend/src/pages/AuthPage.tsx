import { Outlet, useLocation } from "react-router-dom";

import night from "../assets/background_img/night.avif";
import day from "../assets/background_img/day.avif";

function AuthPage() {
    const location = useLocation();

    const isLogin =
        location.pathname === "/" ||
        location.pathname === "/login";

    const bg = isLogin ? night : day;

    return (
        <div className="wrapper" style={{ backgroundImage: `url(${bg})` }}>
            <div className={`auth-wrap ${isLogin ? "login" : "register"}`}>
                <div className="card">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
export default AuthPage;