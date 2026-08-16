import { useContext } from "react";
import GameStateContext from "../context/GameStateContext";

function useGameState() {
    const state = useContext(GameStateContext);
    if (!state) {
        throw new Error("useGameState phải được dùng trong GameStateProvider");
    }
    return state;
}

export default useGameState;
