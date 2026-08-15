import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { mockUser, mockLeaderboard, mockAchievements } from "../../data/mockUser";
import { dailyChallenges } from "../../data/mockChallenge";

function Home(){
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar />

      <main className="main">
        <Topbar title={`Xin chào, ${mockUser.username}! 👋`} subtitle="Cùng nhau chinh phục âm nhạc nhé!" />

        {/* HERO */}
        <div className="hero">
          <div className="heroLeft">
            <div className="heroEyebrow">Bài học tiếp theo của bạn</div>
            <div className="heroTitle">Nhận biết quãng 5 đúng</div>
            <div className="heroSub">Bài 8/15 · Quãng</div>
            <div className="progressRow">
              <div className="progressTrack"><div className="progressFill" style={{width:"53%"}}></div></div>
              <span style={{fontSize:13,fontWeight:700}}>53%</span>
            </div>
            <button className="heroBtn" onClick={() => navigate("/ear-training/interval")}>▶ Tiếp tục học</button>
          </div>
          <div className="heroRight">🎹</div>
        </div>

        {/* JOURNEY */}
        <div className="sectionHead">
          <h2>Hành trình của bạn</h2>
          <a onClick={() => navigate("/journey")} style={{cursor:"pointer"}}>Xem tất cả</a>
        </div>
        <div className="grid2">
          <div className="pathCard" onClick={()=>navigate("/ear-training")}>
            <div className="pathIcon iconEar">👂</div>
            <div className="pathBody">
              <h3>Cảm âm</h3>
              <p>Nghe và nhận biết cao độ và giai điệu</p>
              <div className="pathProgressRow">
                <div className="miniTrack"><div className="miniFill" style={{width:"54%",background:"var(--green)"}}></div></div>
                <span className="pathCount">36/67</span>
              </div>
            </div>
            <span className="chev">›</span>
          </div>
          <div className="pathCard" onClick={()=>navigate("/practice")}>
            <div className="pathIcon iconEye">👁️</div>
            <div className="pathBody">
              <h3>Đọc nhạc</h3>
              <p>Đọc nốt, tiết tấu và bản nhạc</p>
              <div className="pathProgressRow">
                <div className="miniTrack"><div className="miniFill" style={{width:"27%",background:"var(--blue)"}}></div></div>
                <span className="pathCount">12/45</span>
              </div>
            </div>
            <span className="chev">›</span>
          </div>
          <div className="pathCard" onClick={()=>navigate("/practice")}>
            <div className="pathIcon iconPiano">🎹</div>
            <div className="pathBody">
              <h3>Thực hành</h3>
              <p>Luyện tập và chơi nhạc trên màn hình</p>
              <div className="pathProgressRow">
                <div className="miniTrack"><div className="miniFill" style={{width:"20%",background:"var(--orange)"}}></div></div>
                <span className="pathCount">8/40</span>
              </div>
            </div>
            <span className="chev">›</span>
          </div>
          <div className="pathCard" onClick={()=>navigate("/journey")}>
            <div className="pathIcon iconBook">📖</div>
            <div className="pathBody">
              <h3>Cốt truyện</h3>
              <p>Học nhạc qua những câu chuyện thú vị</p>
              <div className="storyLink">Chương 2</div>
            </div>
            <span className="chev">›</span>
          </div>
        </div>

        <div className="sectionHead">
          <h2>Thử thách hôm nay</h2>
          <a onClick={() => navigate("/challenges")} style={{cursor:"pointer"}}>Xem tất cả</a>
        </div>
        <div className="grid2">
          {dailyChallenges.map((c) => (
            <div className="challengeCard" key={c.id} onClick={() => navigate(`/challenges/${c.id}`)} style={{cursor:"pointer"}}>
              <div className="challengeTop">
                <div className="challengeIcon">{c.icon}</div>
                <div className="challengeTitle">{c.title}</div>
              </div>
              <div className="challengeProgress">
                <div className="miniTrack"><div className="miniFill" style={{width:`${(c.current/c.total)*100}%`,background:"var(--green)"}}></div></div>
                <span className="pathCount">{c.current}/{c.total}</span>
                <div className="reward"><span className="xp">✦ {c.xp}</span><span className="coin">🪙 {c.coin}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIVITY */}
        <div className="sectionHead"><h2>Hoạt động gần đây</h2></div>
        <div className="activityList">
          <div className="activityItem">
            <span className="actIcon">⭐</span>
            <div className="actBody">Hoàn thành bài: <b>Nhận biết quãng 4</b></div>
            <span className="actXp">+20 XP</span>
            <span className="actTime">2 giờ trước</span>
            <span className="actCheck">✔</span>
          </div>
          <div className="activityItem">
            <span className="actIcon">🏆</span>
            <div className="actBody">Hoàn thành thử thách: <b>3 bài học trong ngày</b></div>
            <span className="actXp">+30 XP</span>
            <span className="actTime">5 giờ trước</span>
            <span className="actCheck">✔</span>
          </div>
          <div className="activityItem">
            <span className="actIcon">🎵</span>
            <div className="actBody">Luyện tập bài: <b>Twinkle Twinkle Little Star</b></div>
            <span className="actXp">+15 XP</span>
            <span className="actTime">1 ngày trước</span>
            <span className="actCheck">✔</span>
          </div>
        </div>
      </main>

      <aside className="side">
        <div className="sideCard">
          <h3>Mục tiêu hôm nay</h3>
          <div className="goalRow">
            <div className="goalIcon">🎯</div>
            <div className="goalBody">
              <p>Hoàn thành 3 bài học</p>
              <div className="goalTrack"><div className="goalFill" style={{width:"66%"}}></div></div>
              <span className="goalNum">2/3</span>
            </div>
          </div>
        </div>

        <div className="sideCard">
          <h3 style={{marginBottom:10}}>Lịch học</h3>
          <div className="schedRow">
            <div className="schedIcon">📅</div>
            <div className="schedBody">
              <p>Hôm nay: 15 phút</p>
              <span>Đã học: 8 phút</span>
            </div>
          </div>
        </div>

        <div className="sideCard">
          <h3>Thành tích</h3>
          {mockAchievements.slice(0,3).map((a) => (
            <div className="achRow" key={a.label}>
              <span className="achLabel">{a.icon} {a.label}</span>
              <span className="achVal">{a.value}</span>
            </div>
          ))}
        </div>

        <div className="sideCard">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <h3 style={{margin:0}}>Bảng xếp hạng</h3>
            <a style={{fontSize:12,color:"var(--green-dark)",fontWeight:600,textDecoration:"none",cursor:"pointer"}} onClick={() => navigate("/profile")}>Xem tất cả</a>
          </div>
          {mockLeaderboard.map((p) => (
            <div className={`lbRow ${p.isMe ? "meRow" : ""}`} key={p.rank}>
              <div className={`lbRank ${p.isMe ? "me" : p.rank === 1 ? "g1" : p.rank === 2 ? "g2" : "g3"}`}>{p.rank}</div>
              <div className="lbAvatar">{p.avatar}</div>
              <div className="lbName">{p.name}</div>
              <div className="lbXp">{p.xp} XP</div>
            </div>
          ))}
        </div>

        <div className="sideCard treeCard" onClick={() => navigate("/practice")} style={{cursor:"pointer"}}>
          <div className="treeIcon">🌳</div>
          <div className="treeBody">
            <p>Trồng cây nhận xu</p>
            <span>Học mỗi ngày để cây lớn và nhận phần thưởng!</span>
          </div>
          <div className="treeArrow">›</div>
        </div>
      </aside>
    </div>
  )
}

export default Home
