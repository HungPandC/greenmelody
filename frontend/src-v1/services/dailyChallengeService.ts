import { API } from "../config/api";
import type { dailyChallengeTargets } from "../types/TypeDailyChallenge";

export async function setDailyChallenge({practiceTime, exercises, stars}:dailyChallengeTargets, csrfToken: string){
    return fetch(`${API}/set-daily-challenge`,{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
            targets: {
                practiceTime,
                exercises,
                stars
            }
        }),
    })
}