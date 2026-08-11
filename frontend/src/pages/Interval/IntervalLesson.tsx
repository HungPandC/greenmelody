import styles from "./IntervalLesson.module.css";
// Các class dùng chung KHÔNG import ở đây (theo yêu cầu) — bạn tự nối vào
// 1 file CSS chung (vd Shared.module.css) rồi đổi className bên dưới lại
// thành shared.xxx khi gộp. Danh sách nguồn:
//  - layout, sidebar, brand, brandIcon, brandName, brandSub, nav, navItem,
//    active, sidebarBottom, promoCard, promoMascot, promoTitle, promoText,
//    promoBtn, main, topbar, greeting, statPills, pill, pv, pl, avatarRound
//    => lấy từ Home.module.css
//  - side, sideCard, overviewCard, donutWrap, donutInner, donutPct, donutSub,
//    streakBig, streakEmoji, streakNum, streakLabel, rewardRow, rewardLabel,
//    rewardVal, todayGoalRow, todayGoalIcon, todayGoalBody, todayGoalTrack,
//    todayGoalFill, todayGoalNum, hint
//    => lấy từ EarTraining.module.css

// Icon khuông nhạc đơn giản (placeholder), tô màu theo prop.
// Không phải notation engine thật (kiểu VexFlow) — chỉ là hình minh hoạ
// 5 dòng kẻ + 2 nốt cho giống mockup, đủ nhẹ để dùng lại nhiều nơi.
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

type IntervalItem = {
  title: string;
  sub: string;
  locked: boolean;
  current?: boolean;
};

const intervals: IntervalItem[] = [
  { title: "Minor 2", sub: "Quãng 2 thứ", locked: false, current: true },
  { title: "Major 2", sub: "Quãng 2 trưởng", locked: true },
  { title: "Minor 3", sub: "Quãng 3 thứ", locked: true },
  { title: "Major 3", sub: "Quãng 3 trưởng", locked: true },
  { title: "Perfect 4", sub: "Quãng 4 đúng", locked: true },
  { title: "Augmented 4", sub: "Quãng 4 tăng", locked: true },
  { title: "Perfect 5", sub: "Quãng 5 đúng", locked: true },
  { title: "Minor 6", sub: "Quãng 6 thứ", locked: true },
  { title: "Major 6", sub: "Quãng 6 trưởng", locked: true },
  { title: "Minor 7", sub: "Quãng 7 thứ", locked: true },
  { title: "Major 7", sub: "Quãng 7 trưởng", locked: true },
  { title: "Octave", sub: "Quãng 8 đúng", locked: true },
];

const doneCount = 36;
const totalCount = 67;
const totalPct = Math.round((doneCount / totalCount) * 100);

function IntervalLesson(){
  return (
    // className="layout" -> dùng lại .layout từ Home.module.css
    <div className="layout">
      {/* ================= SIDEBAR TRÁI ================= */}
      {/* Toàn bộ khối <aside> này giống hệt Home/EarTraining,
          copy nguyên nav + promoCard từ đó, chỉ đổi navItem "Cảm âm" thành active */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">♪</div>
          <div>
            <div className="brandName">Green Melody</div>
            <div className="brandSub">Học nhạc vui mỗi ngày</div>
          </div>
        </div>
        <nav className="nav">
          <div className="navItem"><span className="ic">🏠</span> Trang chủ</div>
          <div className="navItem"><span className="ic">🗺️</span> Hành trình</div>
          <div className="navItem"><span className="ic">🌱</span> Trồng cây</div>
          <div className="navItem"><span className="ic">🏆</span> Thử thách</div>
          <div className="navItem active"><span className="ic">🎧</span> Cảm âm</div>
          <div className="navItem"><span className="ic">🎼</span> Đọc nhạc</div>
          <div className="navItem"><span className="ic">🎹</span> Thực hành</div>
          <div className="navItem"><span className="ic">📖</span> Cốt truyện</div>
          <div className="navItem"><span className="ic">👤</span> Hồ sơ</div>
        </nav>
        <div className="sidebarBottom">
          <div className="promoCard">
            <div className="promoMascot">🐱</div>
            <div className="promoTitle">Nâng cấp Premium</div>
            <div className="promoText">Mở khoá mọi bài học và tính năng đặc biệt!</div>
            <button className="promoBtn">Nâng cấp ngay</button>
          </div>
          <div className="navItem" style={{ marginTop: 14 }}><span className="ic">⚙️</span> Cài đặt</div>
          <div className="navItem"><span className="ic">↪️</span> Đăng xuất</div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="main">
        {/* topbar: giống hệt Home/EarTraining (pill, avatarRound...) */}
        <div className="topbar">
          <div className={styles.breadcrumb}>
            <span className="back">←</span>
            <a>Cảm âm</a>
            <span className="sep">›</span>
            <span className="current">Quãng</span>
          </div>
          <div className="statPills">
            <div className="pill">🔥 <span><span className="pv">5 ngày</span><span className="pl">Chuỗi học</span></span></div>
            <div className="pill">❤️ <span><span className="pv">3/3</span><span className="pl">Mạng</span></span></div>
            <div className="pill">💎 <span><span className="pv">30</span><span className="pl">Gem</span></span></div>
            <div className="pill">🪙 <span><span className="pv">450</span><span className="pl">Xu</span></span></div>
            <div className="avatarRound">H</div>
          </div>
        </div>

        {/* Header trang: icon + tên quãng + mô tả + help pill (riêng trang này) */}
        <div className={styles.pageHeadRow}>
          <div className={styles.pageHeadLeft}>
            <div className={styles.pageIcon}>🎵</div>
            <div className={styles.pageTitle}>
              <h1>Quãng</h1>
              <p>Luyện nghe và nhận biết các loại quãng trong âm nhạc.</p>
            </div>
          </div>
          <div className={styles.helpPill}>
            <span className="q">?</span> {doneCount}/{totalCount}
          </div>
        </div>

        {/* Banner bài tiếp theo (riêng trang này) */}
        <div className={styles.nextCard}>
          <div className={styles.nextLeft}>
            <span className={styles.nextBadge}>BÀI TIẾP THEO</span>
            <div className={styles.nextTitle}>Major 2 · Quãng 2 trưởng</div>
            <div className={styles.nextDesc}>Làm quen với quãng 2 trưởng và cách nhận biết qua âm thanh.</div>
            <div className={styles.nextProgressRow}>
              <div className={styles.nextProgressTrack}>
                <div className={styles.nextProgressFill} style={{ width: "60%" }} />
              </div>
              <span className={styles.nextProgressLabel}>Tiến độ: 60%</span>
            </div>
            <button className={styles.continueBtn}>Tiếp tục học ▶</button>
          </div>
          <div className={styles.nextArt}>
            <StaffArt color="#2e9e5b" size={110} />
          </div>
        </div>

        {/* Header list + sort/view toggle (riêng trang này) */}
        <div className={styles.listHeadRow}>
          <h2>Tất cả quãng</h2>
          <div className={styles.listControls}>
            <span className={styles.sortSelect}>Sắp xếp: Mặc định ▾</span>
            <div className={styles.viewToggle}>
              <span className={`${styles.viewBtn} ${styles.active}`}>▦</span>
              <span className={styles.viewBtn}>☰</span>
            </div>
          </div>
        </div>

        {/* Grid thẻ quãng (riêng trang này) */}
        <div className={styles.intervalGrid}>
          {intervals.map((item) => (
            <div
              key={item.title}
              className={`${styles.intervalCard} ${item.current ? styles.current : ""} ${item.locked ? styles.locked : ""}`}
            >
              <div className={styles.intervalArt}>
                <StaffArt color={item.locked ? "#b7c0ba" : "#2e9e5b"} size={54} />
              </div>
              <div>
                <div className={styles.intervalTitle}>{item.title}</div>
                <div className={styles.intervalSub}>{item.sub}</div>
              </div>
              {item.locked ? (
                <div className={styles.lockRow}>🔒 Chưa mở khoá</div>
              ) : (
                <>
                  <div className={styles.startRow}><span className="dot" /> Bắt đầu!</div>
                  <button className={styles.startBtn}>Bắt đầu học →</button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* .hint -> dùng lại từ EarTraining.module.css */}
        <div className="hint">💡 Mẹo: Nghe kỹ giai điệu và cảm nhận khoảng cách giữa hai nốt nhé!</div>
      </main>

      {/* ================= SIDEBAR PHẢI ================= */}
      {/* Toàn bộ khối này giống EarTraining.tsx (overviewCard, streak, reward, todayGoal),
          chỉ đổi số liệu + tiêu đề "Tổng quan Quãng" */}
      <aside className="side">
        <div className="sideCard overviewCard">
          <h3>Tổng quan Quãng</h3>
          <div className="donutWrap" style={{ ["--pct" as any]: totalPct }}>
            <div className="donutInner">
              <span className="donutPct">{totalPct}%</span>
              <div className="donutSub">{doneCount}/{totalCount} bài đã hoàn thành</div>
            </div>
          </div>
        </div>

        <div className="sideCard">
          <h3>Chuỗi học hiện tại</h3>
          <div className="streakBig">
            <div className="streakEmoji">🔥</div>
            <div>
              <div className="streakNum">5 ngày</div>
              <div className="streakLabel">Cố lên! Bạn đang làm rất tốt!</div>
            </div>
          </div>
        </div>

        <div className="sideCard">
          <h3>Phần thưởng</h3>
          <div className="rewardRow">
            <span className="rewardLabel">⭐ XP tích lũy</span>
            <span className="rewardVal">450 XP</span>
          </div>
          <div className="rewardRow">
            <span className="rewardLabel">💎 Gem</span>
            <span className="rewardVal">30</span>
          </div>
          <div className="rewardRow">
            <span className="rewardLabel">🪙 Xu</span>
            <span className="rewardVal">450</span>
          </div>
        </div>

        <div className="sideCard">
          <h3 style={{ marginBottom: 10 }}>Mục tiêu hôm nay</h3>
          <div className="todayGoalRow">
            <div className="todayGoalIcon">🎯</div>
            <div className="todayGoalBody">
              <p>Hoàn thành 3 bài học Quãng</p>
              <div className="todayGoalTrack">
                <div className="todayGoalFill" style={{ width: "66%" }} />
              </div>
              <span className="todayGoalNum">2/3</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default IntervalLesson;