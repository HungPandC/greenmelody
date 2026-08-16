import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import useGameState from "../../hooks/useGameState";
import styles from "./Garden.module.css";

const WATERING_CAN_PRICE = 20; // giá cố định, không tính toán gì thêm
const GROWTH_PER_WATER = 10;

// Cây có 5 giai đoạn hiển thị theo % độ lớn — chỉ để minh hoạ, không phải công thức thật
const stages = ["🌱", "🌿", "🪴", "🌳", "🌲"];

function stageEmoji(growth: number) {
    const index = Math.min(stages.length - 1, Math.floor(growth / (100 / stages.length)));
    return stages[index];
}

function Garden() {
    const { coins, wateringCans, plantGrowth, spendCoins, addWateringCan, useWateringCan } = useGameState();

    function buyWateringCan() {
        const ok = spendCoins(WATERING_CAN_PRICE);
        if (ok) addWateringCan();
    }

    function waterPlant() {
        useWateringCan(GROWTH_PER_WATER);
    }

    const isFull = plantGrowth >= 100;

    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Trồng cây" subtitle="Học đều đặn, tưới cây mỗi ngày để cây lớn và nhận thưởng" />

                <div className={styles.plantCard}>
                    <div className={styles.plantArt}>{stageEmoji(plantGrowth)}</div>
                    <div className={styles.plantTrack}>
                        <div className={styles.plantFill} style={{ width: `${plantGrowth}%` }} />
                    </div>
                    <span className={styles.plantPct}>{plantGrowth}% {isFull ? "— Cây đã trưởng thành! 🎉" : ""}</span>
                </div>

                <div className={styles.actionsRow}>
                    <div className={styles.actionCard}>
                        <div className={styles.actionIcon}>💧</div>
                        <div>
                            <h3>Bình tưới</h3>
                            <p>Bạn đang có <b>{wateringCans}</b> bình tưới</p>
                        </div>
                        <button
                            className={styles.actionBtn}
                            disabled={isFull || wateringCans <= 0}
                            onClick={waterPlant}
                        >
                            Tưới cây (+{GROWTH_PER_WATER}%)
                        </button>
                    </div>

                    <div className={styles.actionCard}>
                        <div className={styles.actionIcon}>🪙</div>
                        <div>
                            <h3>Mua bình tưới</h3>
                            <p>Giá: {WATERING_CAN_PRICE} xu · Bạn có {coins} xu</p>
                        </div>
                        <button
                            className={styles.actionBtn}
                            disabled={coins < WATERING_CAN_PRICE}
                            onClick={buyWateringCan}
                        >
                            Mua bình tưới
                        </button>
                    </div>
                </div>

                <div className="hint" style={{ marginTop: 8 }}>
                    💡 Hoàn thành bài học để nhận xu, rồi dùng xu mua bình tưới cho cây lớn nhé!
                </div>
            </main>
        </div>
    );
}

export default Garden;
