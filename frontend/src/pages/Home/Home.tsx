import { useEffect } from "react";
import styles from "./Home.module.css";
import { useNavigate} from 'react-router-dom';

function Home(){
  const navigate = useNavigate();
  useEffect( () => {

      fetch("http://localhost:3000/home", {
          credentials: "include",
      })
      .then(async res => {
          console.log("Status:", res.status);

          const text = await res.text();
          console.log(text);
      });
  }, []);
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandIcon}>♪</div>
            <div>
              <div className={styles.brandName}>Green Melody</div>
              <div className={styles.brandSub}>Học nhạc vui mỗi ngày</div>
            </div>
          </div>
          <nav className={styles.nav}>
            <div className={`${styles.navItem} ${styles.active}`}><span className={styles.ic}>🏠</span> Trang chủ</div>
            <div className={styles.navItem}><span className={styles.ic}>🗺️</span> Hành trình</div>
            <div className={styles.navItem}><span className={styles.ic}>🌱</span> Trồng cây</div>
            <div className={styles.navItem}><span className={styles.ic}>🏆</span> Thử thách</div>
            <div className={styles.navItem}><span className={styles.ic}>👤</span> Hồ sơ</div>
          </nav>
          <div className={styles.sidebarBottom}>
            <div className={styles.promoCard}>
              <div className={styles.promoMascot}>🐱</div>
              <div className={styles.promoTitle}>Nâng cấp Premium</div>
              <div className={styles.promoText}>Mở khoá mọi bài học và tính năng đặc biệt!</div>
              <button className={styles.promoBtn}>Nâng cấp ngay</button>
            </div>
            <div className={styles.navItem} style={{marginTop:14}}><span className={styles.ic}>⚙️</span> Cài đặt</div>
            <div className={styles.navItem}><span className={styles.ic}>↪️</span> Đăng xuất</div>
          </div>
      </aside>

      <main className={styles.main}>
          <div className={styles.topbar}>
            <div className={styles.greeting}>
              <h1>Xin chào, Hưng! 👋</h1>
              <p>Cùng nhau chinh phục âm nhạc nhé!</p>
            </div>
            <div className={styles.statPills}>
              <div className={styles.pill}>🔥 <span><span className={styles.pv}>5 ngày</span><span className={styles.pl}>Chuỗi học</span></span></div>
              <div className={styles.pill}>❤️ <span><span className={styles.pv}>3/3</span><span className={styles.pl}>Mạng</span></span></div>
              <div className={styles.pill}>💎 <span><span className={styles.pv}>30</span><span className={styles.pl}>Gem</span></span></div>
              <div className={styles.pill}>🪙 <span><span className={styles.pv}>450</span><span className={styles.pl}>Xu</span></span></div>
              <div className={styles.avatarRound}>H</div>
            </div>
          </div>

          {/* HERO */}
          <div className={styles.hero}>
            <div className={styles.heroLeft}>
              <div className={styles.heroEyebrow}>Bài học tiếp theo của bạn</div>
              <div className={styles.heroTitle}>Nhận biết quãng 5 đúng</div>
              <div className={styles.heroSub}>Bài 8/15 · Quãng</div>
              <div className={styles.progressRow}>
                <div className={styles.progressTrack}><div className={styles.progressFill} style={{width:"53%"}}></div></div>
                <span style={{fontSize:13,fontWeight:700}}>53%</span>
              </div>
              <button className={styles.heroBtn}>▶ Tiếp tục học</button>
            </div>
            <div className={styles.heroRight}>🎹</div>
          </div>

          {/* JOURNEY */}
          <div className={styles.sectionHead}>
            <h2>Hành trình của bạn</h2>
            <a href="#">Xem tất cả</a>
          </div>
          <div className={styles.grid2}>
            <div className={styles.pathCard}>
              <div className={`${styles.pathIcon} ${styles.iconEar}`}>👂</div>
              <div className={styles.pathBody} onClick={()=>navigate("/ear-training")}>
                <h3>Cảm âm</h3>
                <p>Nghe và nhận biết cao độ và giai điệu</p>
                <div className={styles.pathProgressRow}>
                  <div className={styles.miniTrack}><div className={styles.miniFill} style={{width:"54%",background:"var(--green)"}}></div></div>
                  <span className={styles.pathCount}>36/67</span>
                </div>
              </div>
              <span className={styles.chev}>›</span>
            </div>
            <div className={styles.pathCard}>
              <div className={`${styles.pathIcon} ${styles.iconEye}`}>👁️</div>
              <div className={styles.pathBody}>
                <h3>Đọc nhạc</h3>
                <p>Đọc nốt, tiết tấu và bản nhạc</p>
                <div className={styles.pathProgressRow}>
                  <div className={styles.miniTrack}><div className={styles.miniFill} style={{width:"27%",background:"var(--blue)"}}></div></div>
                  <span className={styles.pathCount}>12/45</span>
                </div>
              </div>
              <span className={styles.chev}>›</span>
            </div>
            <div className={styles.pathCard}>
              <div className={`${styles.pathIcon} ${styles.iconPiano}`}>🎹</div>
              <div className={styles.pathBody}>
                <h3>Thực hành</h3>
                <p>Luyện tập và chơi nhạc trên màn hình</p>
                <div className={styles.pathProgressRow}>
                  <div className={styles.miniTrack}><div className={styles.miniFill} style={{width:"20%",background:"var(--orange)"}}></div></div>
                  <span className={styles.pathCount}>8/40</span>
                </div>
              </div>
              <span className={styles.chev}>›</span>
            </div>
            <div className={styles.pathCard}>
              <div className={`${styles.pathIcon} ${styles.iconBook}`}>📖</div>
              <div className={styles.pathBody}>
                <h3>Cốt truyện</h3>
                <p>Học nhạc qua những câu chuyện thú vị</p>
                <div className={styles.storyLink}>Chương 2</div>
              </div>
              <span className={styles.chev}>›</span>
            </div>
          </div>

          <div className={styles.sectionHead}>
            <h2>Thử thách hôm nay</h2>
            <a href="#">Xem tất cả</a>
          </div>
          <div className={styles.grid2}>
            <div className={styles.challengeCard}>
              <div className={styles.challengeTop}>
                <div className={styles.challengeIcon}>🎯</div>
                <div className={styles.challengeTitle}>Hoàn thành 3 bài học</div>
              </div>
              <div className={styles.challengeProgress}>
                <div className={styles.miniTrack}><div className={styles.miniFill} style={{width:"66%",background:"var(--green)"}}></div></div>
                <span className={styles.pathCount}>2/3</span>
                <div className={styles.reward}><span className={styles.xp}>✦ 20</span><span className={styles.coin}>🪙 30</span></div>
              </div>
            </div>
            <div className={styles.challengeCard}>
              <div className={styles.challengeTop}>
                <div className={styles.challengeIcon}>🎤</div>
                <div className={styles.challengeTitle}>Đọc đúng 10 nốt ở khoá Sol</div>
              </div>
              <div className={styles.challengeProgress}>
                <div className={styles.miniTrack}><div className={styles.miniFill} style={{width:"60%",background:"var(--green)"}}></div></div>
                <span className={styles.pathCount}>6/10</span>
                <div className={styles.reward}><span className={styles.xp}>✦ 20</span><span className={styles.coin}>🪙 30</span></div>
              </div>
            </div>
          </div>

          {/* ACTIVITY */}
          <div className={styles.sectionHead}><h2>Hoạt động gần đây</h2></div>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.actIcon}>⭐</span>
              <div className={styles.actBody}>Hoàn thành bài: <b>Nhận biết quãng 4</b></div>
              <span className={styles.actXp}>+20 XP</span>
              <span className={styles.actTime}>2 giờ trước</span>
              <span className={styles.actCheck}>✔</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.actIcon}>🏆</span>
              <div className={styles.actBody}>Hoàn thành thử thách: <b>3 bài học trong ngày</b></div>
              <span className={styles.actXp}>+30 XP</span>
              <span className={styles.actTime}>5 giờ trước</span>
              <span className={styles.actCheck}>✔</span>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.actIcon}>🎵</span>
              <div className={styles.actBody}>Luyện tập bài: <b>Twinkle Twinkle Little Star</b></div>
              <span className={styles.actXp}>+15 XP</span>
              <span className={styles.actTime}>1 ngày trước</span>
              <span className={styles.actCheck}>✔</span>
            </div>
          </div>
      </main>
      <aside className={styles.side}>
          <div className={styles.sideCard}>
            <h3>Mục tiêu hôm nay</h3>
            <div className={styles.goalRow}>
              <div className={styles.goalIcon}>🎯</div>
              <div className={styles.goalBody}>
                <p>Hoàn thành 3 bài học</p>
                <div className={styles.goalTrack}><div className={styles.goalFill} style={{width:"66%"}}></div></div>
                <span className={styles.goalNum}>2/3</span>
              </div>
            </div>
          </div>

          <div className={styles.sideCard}>
            <h3 style={{marginBottom:10}}>Lịch học</h3>
            <div className={styles.schedRow}>
              <div className={styles.schedIcon}>📅</div>
              <div className={styles.schedBody}>
                <p>Hôm nay: 15 phút</p>
                <span>Đã học: 8 phút</span>
              </div>
            </div>
          </div>

          <div className={styles.sideCard}>
            <h3>Thành tích</h3>
            <div className={styles.achRow}>
              <span className={styles.achLabel}>⭐ Chuỗi học dài nhất</span>
              <span className={styles.achVal}>12 ngày</span>
            </div>
            <div className={styles.achRow}>
              <span className={styles.achLabel}>🕐 Tổng thời gian học</span>
              <span className={styles.achVal}>4 giờ 32 phút</span>
            </div>
            <div className={styles.achRow}>
              <span className={styles.achLabel}>📗 Bài học đã hoàn thành</span>
              <span className={styles.achVal}>28 bài</span>
            </div>
          </div>

          <div className={styles.sideCard}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <h3 style={{margin:0}}>Bảng xếp hạng</h3>
              <a href="#" style={{fontSize:12,color:"var(--green-dark)",fontWeight:600,textDecoration:"none"}}>Xem tất cả</a>
            </div>
            <div className={styles.lbRow}>
              <div className={`${styles.lbRank} ${styles.g1}`}>1</div>
              <div className={styles.lbAvatar}>M</div>
              <div className={styles.lbName}>Minh Quân</div>
              <div className={styles.lbXp}>1250 XP</div>
            </div>
            <div className={styles.lbRow}>
              <div className={`${styles.lbRank} ${styles.g2}`}>2</div>
              <div className={styles.lbAvatar}>K</div>
              <div className={styles.lbName}>Khánh Linh</div>
              <div className={styles.lbXp}>980 XP</div>
            </div>
            <div className={styles.lbRow}>
              <div className={`${styles.lbRank} ${styles.g3}`}>3</div>
              <div className={styles.lbAvatar}>T</div>
              <div className={styles.lbName}>Tuấn Anh</div>
              <div className={styles.lbXp}>870 XP</div>
            </div>
            <div className={`${styles.lbRow} ${styles.meRow}`}>
              <div className={`${styles.lbRank} ${styles.me}`}>4</div>
              <div className={styles.lbAvatar}>H</div>
              <div className={styles.lbName}>Hưng (Bạn)</div>
              <div className={styles.lbXp}>250 XP</div>
            </div>
          </div>

          <div className={`${styles.sideCard} ${styles.treeCard}`}>
            <div className={styles.treeIcon}>🌳</div>
            <div className={styles.treeBody}>
              <p>Trồng cây nhận xu</p>
              <span>Học mỗi ngày để cây lớn và nhận phần thưởng!</span>
            </div>
            <div className={styles.treeArrow}>›</div>
          </div>
      </aside>
    </div>
  )
}

export default Home