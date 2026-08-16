import { useState } from "react";
import type { ReactNode } from "react";
import GameStateContext from "./GameStateContext";

function GameStateProvider({ children }: { children: ReactNode }) {
    // Tất cả số bắt đầu từ 0 (hoặc tối thiểu) — sau này nối API thật thì
    // load giá trị thật vào đây lúc mount (giống cách AuthProvider load user).
    const [coins, setCoins] = useState(0);
    const [gems, setGems] = useState(0);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lives] = useState(0);
    const [maxLives] = useState(3);
    const [wateringCans, setWateringCans] = useState(0);
    const [plantGrowth, setPlantGrowth] = useState(0);

    function addCoins(amount: number) {
        setCoins((c) => c + amount);
    }
    function addGems(amount: number) {
        setGems((g) => g + amount);
    }
    function addXp(amount: number) {
        setXp((x) => x + amount);
    }
    function spendCoins(amount: number) {
        let ok = false;
        setCoins((c) => {
            if (c >= amount) {
                ok = true;
                return c - amount;
            }
            ok = false;
            return c;
        });
        return ok;
    }
    function addWateringCan() {
        setWateringCans((w) => w + 1);
    }
    function useWateringCan(growthAmount: number) {
        let ok = false;
        setWateringCans((w) => {
            if (w > 0) {
                ok = true;
                return w - 1;
            }
            return w;
        });
        if (ok) {
            setPlantGrowth((g) => Math.min(100, g + growthAmount));
        }
        return ok;
    }

    return (
        <GameStateContext.Provider
            value={{
                coins, gems, xp, streak, lives, maxLives, wateringCans, plantGrowth,
                addCoins, addGems, addXp, spendCoins, addWateringCan, useWateringCan,
            }}
        >
            {children}
        </GameStateContext.Provider>
    );
}

export default GameStateProvider;
