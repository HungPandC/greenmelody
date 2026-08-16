import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import SideRail from "../../components/layout/SideRail";
import { mockUser, mockHistory } from "../../data/mockUser";
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
            <div className="heroTitle">Minor 2 · Quãng 2 thứ</div>
            <div className="heroSub">Bài 1/6 · Quãng</div>
            <div className="progressRow">
              <div className="progressTrack"><div className="progressFill" style={{width:"0%"}}></div></div>
              <span style={{fontSize:13,fontWeight:700}}>0%</span>
            </div>
            <button className="heroBtn" onClick={() => navigate("/ear-training/interval")}>▶ Bắt đầu học</button>
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
                <div className="miniTrack"><div className="miniFill" style={{width:"0%",background:"var(--green)"}}></div></div>
                <span className="pathCount">0/6</span>
              </div>
            </div>
            <span className="chev">›</span>
          </div>
          <div className="pathCard" onClick={()=>navigate("/reading")}>
            <div className="pathIcon iconEye">👁️</div>
            <div className="pathBody">
              <h3>Đọc nhạc</h3>
              <p>Đọc nốt, tiết tấu và bản nhạc</p>
              <div className="pathProgressRow">
                <div className="miniTrack"><div className="miniFill" style={{width:"0%",background:"var(--blue)"}}></div></div>
                <span className="pathCount">0/6</span>
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
                <div className="miniTrack"><div className="miniFill" style={{width:"0%",background:"var(--orange)"}}></div></div>
                <span className="pathCount">0/4</span>
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
        <div className="activityList" style={{ padding: mockHistory.length === 0 ? "24px 16px" : 0, textAlign: mockHistory.length === 0 ? "center" : "left", color: "var(--text-mut)" }}>
          {mockHistory.length === 0 ? (
            "Chưa có hoạt động nào. Học bài đầu tiên để bắt đầu nhé!"
          ) : (
            mockHistory.map((h, i) => (
              <div className="activityItem" key={i}>
                <span className="actIcon">{h.icon}</span>
                <div className="actBody">{h.text}</div>
                <span className="actXp">+{h.xp} XP</span>
                <span className="actTime">{h.time}</span>
                <span className="actCheck">✔</span>
              </div>
            ))
          )}
        </div>
      </main>

      <SideRail extra={
        <>
          <div className="sideCard">
            <h3>Mục tiêu hôm nay</h3>
            <div className="goalRow">
              <div className="goalIcon">🎯</div>
              <div className="goalBody">
                <p>Hoàn thành 3 bài học</p>
                <div className="goalTrack"><div className="goalFill" style={{width:"0%"}}></div></div>
                <span className="goalNum">0/3</span>
              </div>
            </div>
          </div>

          <div className="sideCard">
            <h3 style={{marginBottom:10}}>Lịch học</h3>
            <div className="schedRow">
              <div className="schedIcon">📅</div>
              <div className="schedBody">
                <p>Hôm nay: 0 phút</p>
                <span>Chưa học hôm nay</span>
              </div>
            </div>
          </div>
        </>
      } />
    </div>
  )
}

export default Home
