import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import SideRail from "../../components/layout/SideRail";
import { skillMeta } from "../../data/mockLessons";
import type { SkillId } from "../../../../shared/skills";
import styles from "./Reading.module.css";

const readingSlugs: SkillId[] = ["note-reading", "rhythm-reading", "symbol-recognition"];

function Reading() {
    // const navigate = useNavigate();

    // return (
    //     <div className="layout">
    //         <Sidebar />
    //         <main className="main">
    //             <Topbar title="Đọc nhạc" subtitle="Đọc nốt, tiết tấu và ký hiệu bản nhạc" />

    //             <div className={styles.grid}>
    //                 {readingSlugs.map((slug) => {
    //                     const meta = skillMeta[slug];
    //                     const lessons = skillLessons[slug] ?? [];
    //                     const done = lessons.filter(l => l.completed).length;
    //                     const percent = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
    //                     return (
    //                         <div className={styles.card} key={slug} onClick={() => navigate(`/reading/${slug}`)}>
    //                             <div className={styles.icon}>{meta.icon}</div>
    //                             <h3>{meta.title}</h3>
    //                             <p>{meta.desc}</p>
    //                             <div className={styles.track}>
    //                                 <div className={styles.fill} style={{ width: `${percent}%` }} />
    //                             </div>
    //                             <span className={styles.count}>{done}/{lessons.length} bài</span>
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //         </main>
    //         <SideRail />
    //     </div>
    // );
    return(<div>day la reading</div>)
}


export default Reading;
