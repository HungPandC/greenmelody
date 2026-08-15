import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import useAuth from "../../hooks/useAuth";
import { setDailyChallenge } from "../../services/dailyChallengeService";
import { defaultTarget } from "../../data/mockChallenge";
import styles from "./SetTarget.module.css";

function SetTarget() {
    const navigate = useNavigate();
    const { csrfToken } = useAuth();

    const [practiceTime, setPracticeTime] = useState(defaultTarget.practiceTime);
    const [exercises, setExercises] = useState(defaultTarget.exercises);
    const [stars, setStars] = useState(defaultTarget.stars);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSave() {
        setSaving(true);
        setMessage("");
        try {
            const res = await setDailyChallenge({ practiceTime, exercises, stars }, csrfToken);
            const data = await res.json();
            if (data.success !== false) {
                navigate("/challenges");
            } else {
                setMessage("Không lưu được mục tiêu, thử lại sau.");
            }
        } catch {
            setMessage("Không kết nối được máy chủ.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Đặt mục tiêu hàng ngày" />

                <div className={styles.card}>
                    <div className={styles.field}>
                        <label>⏱ Thời gian luyện tập (phút/ngày)</label>
                        <input
                            type="range" min={5} max={60} step={5}
                            value={practiceTime}
                            onChange={(e) => setPracticeTime(Number(e.target.value))}
                        />
                        <span className={styles.value}>{practiceTime} phút</span>
                    </div>

                    <div className={styles.field}>
                        <label>📗 Số bài tập</label>
                        <input
                            type="range" min={1} max={10}
                            value={exercises}
                            onChange={(e) => setExercises(Number(e.target.value))}
                        />
                        <span className={styles.value}>{exercises} bài</span>
                    </div>

                    <div className={styles.field}>
                        <label>⭐ Số sao mục tiêu</label>
                        <input
                            type="range" min={1} max={30}
                            value={stars}
                            onChange={(e) => setStars(Number(e.target.value))}
                        />
                        <span className={styles.value}>{stars} sao</span>
                    </div>

                    {message && <p className={styles.error}>{message}</p>}

                    <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        {saving ? "Đang lưu..." : "Lưu mục tiêu"}
                    </button>
                </div>
            </main>
        </div>
    );
}

export default SetTarget;
