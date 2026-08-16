import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import SideRail from "../../components/layout/SideRail";
import { dailyChallenges } from "../../data/mockChallenge";
import styles from "./Challenges.module.css";

function Challenges() {
    const navigate = useNavigate();
    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Thử thách hôm nay" subtitle="Hoàn thành thử thách để nhận XP và phần thưởng" />

                <div className="grid2">
                    {dailyChallenges.map((c) => (
                        <div className="challengeCard" key={c.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/challenges/${c.id}`)}>
                            <div className="challengeTop">
                                <div className="challengeIcon">{c.icon}</div>
                                <div className="challengeTitle">{c.title}</div>
                            </div>
                            <div className="challengeProgress">
                                <div className="miniTrack"><div className="miniFill" style={{ width: `${(c.current / c.total) * 100}%`, background: "var(--green)" }}></div></div>
                                <span className="pathCount">{c.current}/{c.total}</span>
                                <div className="reward"><span className="xp">✦ {c.xp}</span><span className="coin">🪙 {c.coin}</span></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.targetCard}>
                    <div>
                        <h3>Tự đặt mục tiêu hàng ngày</h3>
                        <p>Tùy chỉnh thời gian luyện tập, số bài tập và sao mỗi ngày</p>
                    </div>
                    <button className={styles.targetBtn} onClick={() => navigate("/challenges/set-target")}>Đặt mục tiêu →</button>
                </div>
            </main>
            <SideRail />
        </div>
    );
}

export default Challenges;
