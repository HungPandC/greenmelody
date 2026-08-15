import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { mockUser, mockAchievements, mockHistory, mockLeaderboard } from "../../data/mockUser";

type Tab = "overview" | "achievements" | "history";

function Profile() {
    const navigate = useNavigate();
    // Local state đủ dùng vì tab chỉ tồn tại trong page này, không nơi nào khác cần biết.
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
                        <span className={styles.level}>Cấp độ {mockUser.level}</span>
                    </div>
                    <button className={styles.settingsBtn} onClick={() => navigate("/settings")}>⚙️ Cài đặt</button>
                </div>

                <div className={styles.statRow}>
                    <div className={styles.statBox}><span className={styles.statVal}>{mockUser.xp}</span><span className={styles.statLabel}>XP</span></div>
                    <div className={styles.statBox}><span className={styles.statVal}>{mockUser.coins}</span><span className={styles.statLabel}>Xu</span></div>
                    <div className={styles.statBox}><span className={styles.statVal}>{mockUser.gems}</span><span className={styles.statLabel}>Gem</span></div>
                    <div className={styles.statBox}><span className={styles.statVal}>{mockUser.streak} ngày</span><span className={styles.statLabel}>Chuỗi học</span></div>
                </div>

                <div className={styles.tabs}>
                    <div className={`${styles.tab} ${tab === "overview" ? styles.tabActive : ""}`} onClick={() => setTab("overview")}>Tổng quan</div>
                    <div className={`${styles.tab} ${tab === "achievements" ? styles.tabActive : ""}`} onClick={() => setTab("achievements")}>Thành tích</div>
                    <div className={`${styles.tab} ${tab === "history" ? styles.tabActive : ""}`} onClick={() => setTab("history")}>Lịch sử học</div>
                </div>

                {tab === "overview" && (
                    <div className="sideCard">
                        <h3 style={{ marginBottom: 14 }}>Bảng xếp hạng</h3>
                        {mockLeaderboard.map((p) => (
                            <div className={`lbRow ${p.isMe ? "meRow" : ""}`} key={p.rank}>
                                <div className={`lbRank ${p.isMe ? "me" : p.rank === 1 ? "g1" : p.rank === 2 ? "g2" : "g3"}`}>{p.rank}</div>
                                <div className="lbAvatar">{p.avatar}</div>
                                <div className="lbName">{p.name}</div>
                                <div className="lbXp">{p.xp} XP</div>
                            </div>
                        ))}
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
                )}
            </main>
        </div>
    );
}

export default Profile;
