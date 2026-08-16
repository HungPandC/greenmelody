import { useNavigate } from "react-router-dom";
import styles from "./Journey.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import SideRail from "../../components/layout/SideRail";

const stages = [
    { icon: "👂", title: "Cảm âm", desc: "Nghe và nhận biết cao độ, quãng, hợp âm", percent: 0, done: 0, total: 18, path: "/ear-training", color: "var(--green)" },
    { icon: "👁️", title: "Đọc nhạc", desc: "Đọc nốt, tiết tấu và bản nhạc", percent: 0, done: 0, total: 6, path: "/reading", color: "var(--blue)" },
    { icon: "🎹", title: "Thực hành", desc: "Luyện tập và chơi nhạc trên màn hình", percent: 0, done: 0, total: 4, path: "/practice", color: "var(--orange)" },
];

function Journey() {
    const navigate = useNavigate();
    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Hành trình của bạn" subtitle="Toàn bộ lộ trình học nhạc, từ cơ bản đến nâng cao" />

                <div className={styles.roadmap}>
                    {stages.map((s, i) => (
                        <div className={styles.stageRow} key={s.title}>
                            <div className={styles.stageDotCol}>
                                <div className={styles.stageDot} style={{ background: s.color }}>{s.icon}</div>
                                {i < stages.length - 1 && <div className={styles.stageLine} />}
                            </div>
                            <div className={styles.stageCard} onClick={() => navigate(s.path)}>
                                <div className={styles.stageHead}>
                                    <h3>{s.title}</h3>
                                    <span className={styles.stagePct}>{s.percent}%</span>
                                </div>
                                <p>{s.desc}</p>
                                <div className={styles.stageTrack}>
                                    <div className={styles.stageFill} style={{ width: `${s.percent}%`, background: s.color }} />
                                </div>
                                <span className={styles.stageCount}>{s.done}/{s.total} bài đã hoàn thành</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <SideRail />
        </div>
    );
}

export default Journey;
