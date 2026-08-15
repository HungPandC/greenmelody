import { Link } from "react-router-dom";
import { mockUser } from "../../data/mockUser";

type TopbarProps = {
    title: string;
    subtitle?: string;
};

// Topbar hiện title/subtitle riêng theo từng page, còn statPills (streak, gem...)
// thì giống nhau ở mọi nơi -> lấy chung từ mockUser thay vì hardcode lại mỗi page.
function Topbar({ title, subtitle }: TopbarProps) {
    return (
        <div className="topbar">
            <div className="greeting">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="statPills">
                <div className="pill">
                    🔥 <span><span className="pv">{mockUser.streak} ngày</span><span className="pl">Chuỗi học</span></span>
                </div>
                <div className="pill">
                    ❤️ <span><span className="pv">{mockUser.lives}/{mockUser.maxLives}</span><span className="pl">Mạng</span></span>
                </div>
                <div className="pill">
                    💎 <span><span className="pv">{mockUser.gems}</span><span className="pl">Gem</span></span>
                </div>
                <div className="pill">
                    🪙 <span><span className="pv">{mockUser.coins}</span><span className="pl">Xu</span></span>
                </div>
                <Link to="/profile" className="avatarRound" style={{ textDecoration: "none" }}>
                    {mockUser.avatarLetter}
                </Link>
            </div>
        </div>
    );
}

export default Topbar;
