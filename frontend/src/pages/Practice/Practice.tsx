import { useNavigate } from "react-router-dom";
import styles from "./Practice.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { skillLessons, skillMeta } from "../../data/mockLessons";

// Practice module reuse chung "engine" bài học với Cảm âm
// (SkillLessonList + LessonExercise) qua slug "piano" / "rhythm"
// nên không cần viết lại luồng câu hỏi/kết quả/reward.
const practiceSlugs = ["piano", "rhythm"];

function Practice() {
    const navigate = useNavigate();

    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Thực hành" subtitle="Luyện tập và chơi nhạc trên màn hình" />

                <div className={styles.grid}>
                    {practiceSlugs.map((slug) => {
                        const meta = skillMeta[slug];
                        const lessons = skillLessons[slug];
                        const done = lessons.filter(l => l.completed).length;
                        const percent = Math.round((done / lessons.length) * 100);
                        return (
                            <div className={styles.card} key={slug} onClick={() => navigate(`/ear-training/${slug}`)}>
                                <div className={styles.icon}>{meta.icon}</div>
                                <h3>{meta.title}</h3>
                                <p>{meta.desc}</p>
                                <div className={styles.track}>
                                    <div className={styles.fill} style={{ width: `${percent}%` }} />
                                </div>
                                <span className={styles.count}>{done}/{lessons.length} bài</span>
                            </div>
                        );
                    })}
                </div>

                <div className="hint" style={{ marginTop: 24 }}>
                    💡 Thêm nhiều bài luyện tập nhạc cụ sẽ được cập nhật sớm!
                </div>
            </main>
        </div>
    );
}

export default Practice;
