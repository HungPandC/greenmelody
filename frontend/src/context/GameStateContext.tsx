import { createContext } from "react";

// State "tiền bạc" của toàn app: coins, gems, xp, streak, lives, và đồ vật của
// vườn cây (bình tưới, độ lớn cây). Đặt ở Context để Sidebar/Topbar/Garden/
// Profile... đều đọc chung 1 nguồn, sửa 1 chỗ thì mọi nơi tự cập nhật.
//
// Nguyên tắc: KHÔNG tự tính công thức phức tạp ở đây. Component nào muốn
// cộng/trừ thì tự quyết định số (vd LessonExercise tự tính đúng bao nhiêu câu
// rồi gọi addCoins(20)) — Context chỉ giữ state + hàm cộng/trừ thuần túy.
export type GameState = {
    coins: number;
    gems: number;
    xp: number;
    streak: number;
    lives: number;
    maxLives: number;
    wateringCans: number;
    plantGrowth: number; // 0 - 100

    addCoins: (amount: number) => void;
    addGems: (amount: number) => void;
    addXp: (amount: number) => void;
    spendCoins: (amount: number) => boolean; // false nếu không đủ tiền
    addWateringCan: () => void;
    useWateringCan: (growthAmount: number) => boolean; // false nếu hết bình tưới
};

const GameStateContext = createContext<GameState | null>(null);

export default GameStateContext;
