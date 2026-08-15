import styles from "./Eartraining.module.css";
import { useNavigate } from "react-router-dom";

type Skill = {
  icon: string;
  title: string;
  desc: string;
  percent: number;
  done: number;
  total: number;
  fill: string;      // màu thanh progress
  artBg: string;      // nền ô icon
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
      { icon: "🎼", title: "Cao độ", desc: "Nhận biết và phân biệt độ cao của các nốt nhạc.", percent: 60, done: 12, total: 20, fill: "var(--green)", artBg: "var(--green-light)" },
      { icon: "📏", title: "Quãng", desc: "Nhận biết khoảng cách giữa hai nốt nhạc.", percent: 45, done: 9, total: 20, fill: "var(--blue)", artBg: "var(--blue-light)" },
      { icon: "🎹", title: "Hợp âm", desc: "Nhận biết và phân biệt các hợp âm cơ bản.", percent: 30, done: 6, total: 20, fill: "var(--purple)", artBg: "var(--purple-light)" },
    ],
  },
  {
    label: "GIAI ĐIỆU",
    dot: "var(--orange)",
    skills: [
      { icon: "🪜", title: "Gam âm", desc: "Nhận biết các loại gam và âm giai.", percent: 55, done: 11, total: 20, fill: "var(--green)", artBg: "var(--green-light)" },
      { icon: "🎶", title: "Melody", desc: "Nhận biết và ghi nhớ đoạn giai điệu.", percent: 25, done: 5, total: 20, fill: "var(--orange)", artBg: "var(--orange-light)" },
      { icon: "🎸", title: "Bassline", desc: "Nhận biết và phân tích dòng bass.", percent: 15, done: 3, total: 20, fill: "#e0517a", artBg: "#fdeaf0" },
    ],
  },
  {
    label: "HÒA ÂM & ỨNG DỤNG",
    dot: "var(--purple)",
    skills: [
      { icon: "🎛️", title: "Tiến trình hợp âm", desc: "Nhận biết và phân tích chuỗi hợp âm.", percent: 40, done: 8, total: 20, fill: "var(--green)", artBg: "var(--green-light)" },
      { icon: "🎺", title: "Chức năng hòa âm", desc: "Hiểu chức năng của các hợp âm.", percent: 20, done: 4, total: 20, fill: "var(--orange)", artBg: "var(--orange-light)" },
      { icon: "🎧", title: "Nghe trong bài hát", desc: "Nhận biết các thành phần âm nhạc trong bài hát.", percent: 35, done: 7, total: 20, fill: "var(--blue)", artBg: "var(--blue-light)" },
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
    {/* SIDEBAR TRÁI - giữ nguyên như Home, active = Cảm âm */}
    <aside className="sidebar">
      <div className="brand">
        <div className="brandIcon">♪</div>
        <div>
          <div className="brandName">Green Melody</div>
          <div className="brandSub">Học nhạc vui mỗi ngày</div>
        </div>
      </div>

      <nav className="nav">
        <div className="navItem">
          <span className="ic">🏠</span> Trang chủ
        </div>

        <div className="navItem">
          <span className="ic">🗺️</span> Hành trình
        </div>

        <div className="navItem">
          <span className="ic">🌱</span> Trồng cây
        </div>

        <div className="navItem">
          <span className="ic">🏆</span> Thử thách
        </div>

        <div className="navItem active">
          <span className="ic">🎧</span> Cảm âm
        </div>

        <div className="navItem">
          <span className="ic">🎼</span> Đọc nhạc
        </div>

        <div className="navItem">
          <span className="ic">🎹</span> Thực hành
        </div>

        <div className="navItem">
          <span className="ic">📖</span> Cốt truyện
        </div>

        <div className="navItem">
          <span className="ic">👤</span> Hồ sơ
        </div>
      </nav>

      <div className="sidebarBottom">
        <div className="promoCard">
          <div className="promoMascot">🐱</div>
          <div className="promoTitle">Nâng cấp Premium</div>
          <div className="promoText">
            Mở khoá mọi bài học và tính năng đặc biệt!
          </div>
          <button className="promoBtn">Nâng cấp ngay</button>
        </div>

        <div className="navItem" style={{ marginTop: 14 }}>
          <span className="ic">⚙️</span> Cài đặt
        </div>

        <div className="navItem">
          <span className="ic">↪️</span> Đăng xuất
        </div>
      </div>
    </aside>

    {/* MAIN */}
    <main className="main">
      <div className="topbar">
        <div className="greeting">
          <h1>Cảm âm</h1>
          <p>
            Luyện nghe và nhận biết âm nhạc qua 9 kỹ năng quan trọng
          </p>
        </div>

        <div className="statPills">
          <div className="pill">
            🔥
            <span>
              <span className="pv">5 ngày</span>
              <span className="pl">Chuỗi học</span>
            </span>
          </div>

          <div className="pill">
            ❤️
            <span>
              <span className="pv">3/3</span>
              <span className="pl">Mạng</span>
            </span>
          </div>

          <div className="pill">
            💎
            <span>
              <span className="pv">30</span>
              <span className="pl">Gem</span>
            </span>
          </div>

          <div className="pill">
            🪙
            <span>
              <span className="pv">450</span>
              <span className="pl">Xu</span>
            </span>
          </div>

          <div className="avatarRound">H</div>
        </div>
      </div>

        {/* HEADER TRANG + TIẾN ĐỘ TỔNG */}
        <div className={styles.pageHead}>
          <div className={styles.pageHeadLeft}>
            <div className={styles.pageIcon}>🎧</div>
            <div className={styles.pageTitle}>
              <h1>Cảm âm</h1>
              <p>Luyện nghe và nhận biết âm nhạc qua 9 kỹ năng quan trọng</p>
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

        {/* CÁC NHÓM KỸ NĂNG */}
        {groups.map((group) => (
          <div key={group.label}>
            <div className={styles.groupLabel} style={{ ["--dot" as any]: group.dot }}>
              {group.label}
            </div>
            <div className={styles.skillGrid}>
              {group.skills.map((skill) => (
                <div
                  className={styles.skillCard}
                  key={skill.title}
                  style={{
                    ["--fill" as any]: skill.fill,
                    ["--art-bg" as any]: skill.artBg
                  }}
                  onClick={() => {
                    if (skill.title === "Quãng") {
                      navigate("/interval");
                    }
                  }}
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

      {/* SIDEBAR PHẢI */}
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
          <h3>Phần thưởng</h3>
          <div className={styles.rewardRow}>
            <span className={styles.rewardLabel}>⭐ XP tích lũy</span>
            <span className={styles.rewardVal}>450 XP</span>
          </div>
          <div className={styles.rewardRow}>
            <span className={styles.rewardLabel}>💎 Gem</span>
            <span className={styles.rewardVal}>30</span>
          </div>
          <div className={styles.rewardRow}>
            <span className={styles.rewardLabel}>🪙 Xu</span>
            <span className={styles.rewardVal}>450</span>
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