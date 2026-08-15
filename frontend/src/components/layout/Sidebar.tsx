import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { logout } from "../../services/authService";

// Khai báo nav item 1 lần duy nhất -> mọi page dùng chung Sidebar này
// sẽ tự động có navigation đúng, không cần copy-paste JSX như trước.
const navItems = [
    { icon: "🏠", label: "Trang chủ", path: "/home" },
    { icon: "🗺️", label: "Hành trình", path: "/journey" },
    { icon: "🎧", label: "Cảm âm", path: "/ear-training" },
    { icon: "🎹", label: "Thực hành", path: "/practice" },
    { icon: "🏆", label: "Thử thách", path: "/challenges" },
    { icon: "👤", label: "Hồ sơ", path: "/profile" },
];

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { csrfToken, setUser } = useAuth();

    // active nếu path trùng, hoặc là route con (vd /ear-training/interval)
    const isActive = (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + "/");

    async function handleLogout() {
        await logout(csrfToken);
        setUser(null);
        navigate("/login");
    }

    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brandIcon">♪</div>
                <div>
                    <div className="brandName">Green Melody</div>
                    <div className="brandSub">Học nhạc vui mỗi ngày</div>
                </div>
            </div>

            <nav className="nav">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`navItem ${isActive(item.path) ? "active" : ""}`}
                    >
                        <span className="ic">{item.icon}</span> {item.label}
                    </Link>
                ))}
            </nav>

            <div className="sidebarBottom">
                <div className="promoCard">
                    <div className="promoMascot">🐱</div>
                    <div className="promoTitle">Nâng cấp Premium</div>
                    <div className="promoText">Mở khoá mọi bài học và tính năng đặc biệt!</div>
                    <button className="promoBtn">Nâng cấp ngay</button>
                </div>
                <Link to="/settings" className="navItem" style={{ marginTop: 14 }}>
                    <span className="ic">⚙️</span> Cài đặt
                </Link>
                <div className="navItem" onClick={handleLogout} style={{ cursor: "pointer" }}>
                    <span className="ic">↪️</span> Đăng xuất
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
