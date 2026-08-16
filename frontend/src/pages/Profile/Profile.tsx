import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import SideRail from "../../components/layout/SideRail";
import useGameState from "../../hooks/useGameState";
import { mockUser, mockAchievements, mockHistory } from "../../data/mockUser";

type Tab = "overview" | "achievements" | "history";

function Profile() {
    const navigate = useNavigate();
    const { xp, coins, gems, streak } = useGameState();
    const [tab, setTab] = useState<Tab>("overview");

    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Hồ sơ" />

                <div className={styles.headerCard}>
                    <div className={styles.avatar}>{mockUser.avatarLetter}</div>
                    <div className={styles.headerInfo}>
                        <h1>{mockUser.username}</h1>
                        <span className={styles.level}>Cấp độ {mockUser.level} · {mockUser.email}</span>
                    </div>
                    <button className={styles.settingsBtn} onClick={() => navigate("/settings")}>⚙️ Cài đặt</button>
                </div>

                <div className={styles.statRow}>
                    <div className={styles.statBox}><span className={styles.statVal}>{xp}</span><span className={styles.statLabel}>XP</span></div>
                    <div className={styles.statBox}><span className={styles.statVal}>{coins}</span><span className={styles.statLabel}>Xu</span></div>
                    <div className={styles.statBox}><span className={styles.statVal}>{gems}</span><span className={styles.statLabel}>Gem</span></div>
                    <div className={styles.statBox}><span className={styles.statVal}>{streak} ngày</span><span className={styles.statLabel}>Chuỗi học</span></div>
                </div>

                <div className={styles.tabs}>
                    <div className={`${styles.tab} ${tab === "overview" ? styles.tabActive : ""}`} onClick={() => setTab("overview")}>Tổng quan</div>
                    <div className={`${styles.tab} ${tab === "achievements" ? styles.tabActive : ""}`} onClick={() => setTab("achievements")}>Thành tích</div>
                    <div className={`${styles.tab} ${tab === "history" ? styles.tabActive : ""}`} onClick={() => setTab("history")}>Lịch sử học</div>
                </div>

                {tab === "overview" && (
                    <div className="sideCard">
                        <h3 style={{ marginBottom: 14 }}>Thông tin học tập</h3>
                        <div className="achRow">
                            <span className="achLabel">🕐 Tổng thời gian học</span>
                            <span className="achVal">{mockUser.totalStudyTime}</span>
                        </div>
                        <div className="achRow">
                            <span className="achLabel">📗 Bài học đã hoàn thành</span>
                            <span className="achVal">{mockUser.lessonsCompleted} bài</span>
                        </div>
                        <div className="achRow">
                            <span className="achLabel">🔥 Chuỗi học dài nhất</span>
                            <span className="achVal">{mockUser.longestStreak} ngày</span>
                        </div>
                    </div>
                )}

                {tab === "achievements" && (
                    <div className="sideCard">
                        {mockAchievements.map((a) => (
                            <div className="achRow" key={a.label}>
                                <span className="achLabel">{a.icon} {a.label}</span>
                                <span className="achVal">{a.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "history" && (
                    mockHistory.length === 0 ? (
                        <div className="sideCard" style={{ textAlign: "center", color: "var(--text-mut)", padding: "30px 10px" }}>
                            Chưa có hoạt động nào. Hoàn thành bài học đầu tiên để bắt đầu nhé!
                        </div>
                    ) : (
                        <div className="activityList">
                            {mockHistory.map((h, i) => (
                                <div className="activityItem" key={i}>
                                    <span className="actIcon">{h.icon}</span>
                                    <div className="actBody">{h.text}</div>
                                    <span className="actXp">+{h.xp} XP</span>
                                    <span className="actTime">{h.time}</span>
                                    <span className="actCheck">✔</span>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </main>
            <SideRail />
        </div>
    );
}

export default Profile;
