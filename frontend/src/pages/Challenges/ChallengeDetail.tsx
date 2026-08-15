import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { dailyChallenges } from "../../data/mockChallenge";
import styles from "./ChallengeDetail.module.css";

function ChallengeDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const challenge = dailyChallenges.find(c => c.id === id);

    // claimed: đã bấm nhận thưởng chưa (chỉ có ý nghĩa khi progress = 100%)
    const [claimed, setClaimed] = useState(false);

    if (!challenge) {
        return (
            <div className="layout">
                <Sidebar />
                <main className="main">
                    <Topbar title="Không tìm thấy thử thách" />
                    <button className={styles.backBtn} onClick={() => navigate("/challenges")}>← Quay lại</button>
                </main>
            </div>
        );
    }

    const percent = Math.round((challenge.current / challenge.total) * 100);
    const isComplete = challenge.current >= challenge.total;
    const checkpoints = [30, 70, 100];

    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title={challenge.title} />

                <div className={styles.card}>
                    <div className={styles.iconBig}>{challenge.icon}</div>
                    <h2>{challenge.title}</h2>
                    <p className={styles.progressText}>{challenge.current}/{challenge.total} hoàn thành</p>

                    <div className={styles.track}>
                        <div className={styles.fill} style={{ width: `${percent}%` }} />
                        {checkpoints.map((cp) => (
                            <div
                                key={cp}
                                className={`${styles.checkpoint} ${percent >= cp ? styles.checkpointDone : ""}`}
                                style={{ left: `${cp}%` }}
                            >
                                {percent >= cp ? "✓" : ""}
                            </div>
                        ))}
                    </div>

                    <div className={styles.rewardRow}>
                        <span className={styles.rewardItem}>✦ {challenge.xp} XP</span>
                        <span className={styles.rewardItem}>🪙 {challenge.coin} Xu</span>
                    </div>

                    {isComplete ? (
                        claimed ? (
                            <div className={styles.claimedMsg}>🎉 Bạn đã nhận thưởng!</div>
                        ) : (
                            <button className={styles.claimBtn} onClick={() => setClaimed(true)}>
                                Nhận thưởng
                            </button>
                        )
                    ) : (
                        <button className={styles.continueBtn} onClick={() => navigate("/ear-training")}>
                            Tiếp tục luyện tập →
                        </button>
                    )}

                    <button className={styles.backBtn} onClick={() => navigate("/challenges")}>← Quay lại danh sách</button>
                </div>
            </main>
        </div>
    );
}

export default ChallengeDetail;
