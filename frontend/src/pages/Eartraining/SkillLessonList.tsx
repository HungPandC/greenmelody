import { useNavigate, useParams } from "react-router-dom";
import styles from "./SkillLessonList.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { skillLessons, skillMeta } from "../../data/mockLessons";

// Icon khuông nhạc đơn giản, tô màu theo prop.
const StaffArt = ({ color = "#2e9e5b", size = 60 }: { color?: string; size?: number }) => (
  <svg width="100%" height={size} viewBox="0 0 160 60" fill="none">
    {[12, 22, 32, 42, 52].map((y) => (
      <line key={y} x1="10" y1={y} x2="150" y2={y} stroke="#dfe3dd" strokeWidth="1.4" />
    ))}
    <text x="12" y="46" fontSize="34" fill={color}>𝄞</text>
    <circle cx="95" cy="32" r="6" fill={color} />
    <circle cx="130" cy="22" r="6" fill={color} />
    <line x1="95" y1="32" x2="130" y2="22" stroke={color} strokeWidth="2" />
  </svg>
);

function SkillLessonList() {
  // useParams đọc phần động của URL. Route khai báo "/ear-training/:skill"
  // thì với URL "/ear-training/interval", useParams() trả về { skill: "interval" }.
  const { skill } = useParams<{ skill: string }>();
  const navigate = useNavigate();

  const lessons = skill ? skillLessons[skill] : undefined;
  const meta = skill ? skillMeta[skill] : undefined;

  // Empty state: skill không tồn tại trong mock data
  if (!lessons || !meta) {
    return (
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Topbar title="Không tìm thấy" />
          <div className={styles.emptyState}>
            <p>Kỹ năng này chưa có dữ liệu.</p>
            <button className={styles.continueBtn} onClick={() => navigate("/ear-training")}>← Quay lại Cảm âm</button>
          </div>
        </main>
      </div>
    );
  }

  const doneCount = lessons.filter(l => l.completed).length;
  const totalCount = lessons.length;
  const totalPct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  const nextLesson = lessons.find(l => l.current) ?? lessons.find(l => !l.locked);

  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        <Topbar title={meta.title} />

        <div className={styles.breadcrumb}>
          <span className={styles.back} onClick={() => navigate("/ear-training")}>←</span>
          <a onClick={() => navigate("/ear-training")} style={{cursor:"pointer"}}>Cảm âm</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{meta.title}</span>
        </div>

        <div className={styles.pageHeadRow}>
          <div className={styles.pageHeadLeft}>
            <div className={styles.pageIcon}>{meta.icon}</div>
            <div className={styles.pageTitle}>
              <h1>{meta.title}</h1>
              <p>{meta.desc}</p>
            </div>
          </div>
          <div className={styles.helpPill}>
            <span className={styles.q}>?</span> {doneCount}/{totalCount}
          </div>
        </div>

        {nextLesson && (
          <div className={styles.nextCard}>
            <div className={styles.nextLeft}>
              <span className={styles.nextBadge}>BÀI TIẾP THEO</span>
              <div className={styles.nextTitle}>{nextLesson.title} · {nextLesson.sub}</div>
              <div className={styles.nextDesc}>Làm quen và luyện nghe qua các bài tập ngắn.</div>
              <button className={styles.continueBtn} onClick={() => navigate(`/ear-training/${skill}/lesson/${nextLesson.id}`)}>
                Tiếp tục học ▶
              </button>
            </div>
            <div className={styles.nextArt}>
              <StaffArt color="#2e9e5b" size={110} />
            </div>
          </div>
        )}

        <div className={styles.listHeadRow}>
          <h2>Tất cả bài học</h2>
        </div>

        <div className={styles.lessonGrid}>
          {lessons.map((item) => (
            <div
              key={item.id}
              className={`${styles.lessonCard} ${item.current ? styles.current : ""} ${item.locked ? styles.locked : ""}`}
            >
              <div className={styles.lessonArt}>
                <StaffArt color={item.locked ? "#b7c0ba" : "#2e9e5b"} size={54} />
              </div>
              <div>
                <div className={styles.lessonTitle}>{item.title}</div>
                <div className={styles.lessonSub}>{item.sub}</div>
              </div>
              {item.locked ? (
                <div className={styles.lockRow}>🔒 Chưa mở khoá</div>
              ) : item.completed ? (
                <div className={styles.doneRow}>✓ Hoàn thành</div>
              ) : (
                <button className={styles.startBtn} onClick={() => navigate(`/ear-training/${skill}/lesson/${item.id}`)}>
                  Bắt đầu học →
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="hint">💡 Mẹo: Nghe kỹ và cảm nhận sự khác biệt giữa các âm nhé!</div>
      </main>
    </div>
  );
}

export default SkillLessonList;
