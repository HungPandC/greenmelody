import { Link } from "react-router-dom";
import { mockUser } from "../../data/mockUser";
import useGameState from "../../hooks/useGameState";

type TopbarProps = {
    title: string;
    subtitle?: string;
};

// statPills (streak, gem, coin...) lấy từ GameStateContext vì đây là số ĐỘNG,
// thay đổi khi user học bài / mua đồ. username/avatar vẫn lấy từ mockUser vì
// đó là thông tin tĩnh (profile identity).
function Topbar({ title, subtitle }: TopbarProps) {
    const { streak, lives, maxLives, gems, coins } = useGameState();

    return (
        <div className="topbar">
            <div className="greeting">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
            <div className="statPills">
                <div className="pill">
                    🔥 <span><span className="pv">{streak} ngày</span><span className="pl">Chuỗi học</span></span>
                </div>
                <div className="pill">
                    ❤️ <span><span className="pv">{lives}/{maxLives}</span><span className="pl">Mạng</span></span>
                </div>
                <div className="pill">
                    💎 <span><span className="pv">{gems}</span><span className="pl">Gem</span></span>
                </div>
                <div className="pill">
                    🪙 <span><span className="pv">{coins}</span><span className="pl">Xu</span></span>
                </div>
                <Link to="/profile" className="avatarRound" style={{ textDecoration: "none" }}>
                    {mockUser.avatarLetter}
                </Link>
            </div>
        </div>
    );
}

export default Topbar;
