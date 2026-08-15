import styles from "./Eartraining.module.css";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

type Skill = {
  slug: string;   // khớp key trong data/mockLessons.ts -> dùng để build route
  icon: string;
  title: string;
  desc: string;
  percent: number;
  done: number;
  total: number;
  fill: string;
  artBg: string;
};

type Group = {
  label: string;
  dot: string;
  skills: Skill[];
};

const groups: Group[] = [
  {
    label: "CƠ BẢN",
    dot: "var(--green)",
    skills: [
      { slug: "pitch", icon: "🎼", title: "Cao độ", desc: "Nhận biết và phân biệt độ cao của các nốt nhạc.", percent: 60, done: 12, total: 20, fill: "var(--green)", artBg: "var(--green-light)" },
      { slug: "interval", icon: "📏", title: "Quãng", desc: "Nhận biết khoảng cách giữa hai nốt nhạc.", percent: 45, done: 9, total: 20, fill: "var(--blue)", artBg: "var(--blue-light)" },
      { slug: "chord", icon: "🎹", title: "Hợp âm", desc: "Nhận biết và phân biệt các hợp âm cơ bản.", percent: 30, done: 6, total: 20, fill: "var(--purple)", artBg: "var(--purple-light)" },
    ],
  },
  {
    label: "GIAI ĐIỆU",
    dot: "var(--orange)",
    skills: [
      { slug: "scale", icon: "🪜", title: "Gam âm", desc: "Nhận biết các loại gam và âm giai.", percent: 55, done: 11, total: 20, fill: "var(--green)", artBg: "var(--green-light)" },
      { slug: "melody", icon: "🎶", title: "Melody", desc: "Nhận biết và ghi nhớ đoạn giai điệu.", percent: 25, done: 5, total: 20, fill: "var(--orange)", artBg: "var(--orange-light)" },
      { slug: "bassline", icon: "🎸", title: "Bassline", desc: "Nhận biết và phân tích dòng bass.", percent: 15, done: 3, total: 20, fill: "#e0517a", artBg: "#fdeaf0" },
    ],
  },
];

const totalDone = groups.flatMap(g => g.skills).reduce((s, k) => s + k.done, 0);
const totalAll = groups.flatMap(g => g.skills).reduce((s, k) => s + k.total, 0);
const totalPct = Math.round((totalDone / totalAll) * 100);

const EarTraining = () => {
  const navigate = useNavigate();

  return (
  <div className="layout">
    <Sidebar />

    <main className="main">
      <Topbar title="Cảm âm" subtitle="Luyện nghe và nhận biết âm nhạc qua 6 kỹ năng quan trọng" />

      <div className={styles.pageHead}>
        <div className={styles.pageHeadLeft}>
          <div className={styles.pageIcon}>🎧</div>
          <div className={styles.pageTitle}>
            <h1>Cảm âm</h1>
            <p>Luyện nghe và nhận biết âm nhạc qua 6 kỹ năng quan trọng</p>
          </div>
        </div>
        <div className={styles.totalProgressCard}>
          <div className={styles.totalProgressTop}>
            <span>Tiến độ tổng</span>
            <b>{totalPct}%</b>
          </div>
          <div className={styles.totalProgressTrack}>
            <div className={styles.totalProgressFill} style={{ width: `${totalPct}%` }} />
          </div>
          <div className={styles.totalProgressSub}>{totalDone}/{totalAll} bài đã hoàn thành</div>
        </div>
      </div>

      {groups.map((group) => (
        <div key={group.label}>
          <div className={styles.groupLabel} style={{ ["--dot" as any]: group.dot }}>
            {group.label}
          </div>
          <div className={styles.skillGrid}>
            {group.skills.map((skill) => (
              <div
                className={styles.skillCard}
                key={skill.slug}
                style={{
                  ["--fill" as any]: skill.fill,
                  ["--art-bg" as any]: skill.artBg
                }}
                onClick={() => navigate(`/ear-training/${skill.slug}`)}
              >
                <div className={styles.skillArt}>{skill.icon}</div>
                <h3>{skill.title}</h3>
                <p>{skill.desc}</p>
                <div className={styles.skillFoot}>
                  <div className={styles.skillTrack}>
                    <div className={styles.skillFill} style={{ width: `${skill.percent}%` }} />
                  </div>
                  <span className={styles.skillPct}>{skill.percent}%</span>
                </div>
                <div className={styles.skillMeta}>
                  <span className={styles.skillCount}>{skill.done}/{skill.total} bài</span>
                  <span className={styles.skillGo}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className={styles.hint}>💡 Mẹo: Hãy luyện tập mỗi ngày để cải thiện khả năng cảm âm của bạn!</div>
    </main>

    <aside className="side">
      <div className={`sideCard ${styles.overviewCard}`}>
        <h3>Tổng quan Cảm âm</h3>
        <div className={styles.donutWrap} style={{ ["--pct" as any]: totalPct }}>
          <div className={styles.donutInner}>
            <span className={styles.donutPct}>{totalPct}%</span>
            <div className={styles.donutSub}>{totalDone}/{totalAll} bài đã hoàn thành</div>
          </div>
        </div>
      </div>

      <div className="sideCard">
        <h3>Chuỗi học hiện tại</h3>
        <div className={styles.streakBig}>
          <div className={styles.streakEmoji}>🔥</div>
          <div>
            <div className={styles.streakNum}>5 ngày</div>
            <div className={styles.streakLabel}>Cố lên! Bạn đang làm rất tốt!</div>
          </div>
        </div>
      </div>

      <div className="sideCard">
        <h3 style={{ marginBottom: 10 }}>Mục tiêu hôm nay</h3>
        <div className={styles.todayGoalRow}>
          <div className={styles.todayGoalIcon}>🎯</div>
          <div className={styles.todayGoalBody}>
            <p>Hoàn thành 3 bài học Cảm âm</p>
            <div className={styles.todayGoalTrack}>
              <div className={styles.todayGoalFill} style={{ width: "66%" }} />
            </div>
            <span className={styles.todayGoalNum}>2/3</span>
          </div>
        </div>
      </div>
    </aside>
  </div>
  );
};

export default EarTraining;
