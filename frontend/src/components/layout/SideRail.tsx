import { Link } from "react-router-dom";
import useGameState from "../../hooks/useGameState";
import { mockLeaderboard } from "../../data/mockUser";

type Props = {
    // Cho phép page nào cần thì chèn thêm nội dung riêng ở đầu panel
    // (vd Garden page chèn thẻ "Bình tưới"), còn lại mọi page dùng mặc định.
    extra?: React.ReactNode;
};

// Panel phải dùng chung cho mọi page có layout 2-sidebar (giống Home/Eartraining
// trước đây). Trước đây mỗi page tự quyết có hiện hay không -> mất cân đối khi
// chuyển trang. Giờ include component này ở mọi page là xong.
function SideRail({ extra }: Props) {
    const { streak, coins, gems } = useGameState();

    return (
        <aside className="side">
            {extra}

            <div className="sideCard">
                <h3>Chuỗi học hiện tại</h3>
                <div className="streakBig">
                    <div className="streakEmoji">🔥</div>
                    <div>
                        <div className="streakNum">{streak} ngày</div>
                        <div className="streakLabel">
                            {streak > 0 ? "Cố lên! Bạn đang làm rất tốt!" : "Học bài đầu tiên để bắt đầu chuỗi!"}
                        </div>
                    </div>
                </div>
            </div>

            <div className="sideCard">
                <h3>Phần thưởng</h3>
                <div className="rewardRow">
                    <span className="rewardLabel">🪙 Xu</span>
                    <span className="rewardVal">{coins}</span>
                </div>
                <div className="rewardRow">
                    <span className="rewardLabel">💎 Gem</span>
                    <span className="rewardVal">{gems}</span>
                </div>
            </div>

            <div className="sideCard">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <h3 style={{ margin: 0 }}>Bảng xếp hạng</h3>
                    <Link to="/profile" style={{ fontSize: 12, color: "var(--green-dark)", fontWeight: 600, textDecoration: "none" }}>Xem tất cả</Link>
                </div>
                {mockLeaderboard.map((p) => (
                    <div className={`lbRow ${p.isMe ? "meRow" : ""}`} key={p.rank}>
                        <div className={`lbRank ${p.isMe ? "me" : p.rank === 1 ? "g1" : p.rank === 2 ? "g2" : "g3"}`}>{p.rank}</div>
                        <div className="lbAvatar">{p.avatar}</div>
                        <div className="lbName">{p.name}</div>
                        <div className="lbXp">{p.xp} XP</div>
                    </div>
                ))}
            </div>

            <Link to="/garden" className="sideCard treeCard" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="treeIcon">🌳</div>
                <div className="treeBody">
                    <p>Trồng cây nhận xu</p>
                    <span>Học mỗi ngày để cây lớn và nhận phần thưởng!</span>
                </div>
                <div className="treeArrow">›</div>
            </Link>
        </aside>
    );
}

export default SideRail;
