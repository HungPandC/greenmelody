import { useState, useRef } from "react";
function useCountdown(initialSeconds: number) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [disabled, setDisabled] = useState(false);
    const intervalId = useRef<number | null>(null);

    function restart() {
        if (intervalId.current !== null) {
            clearInterval(intervalId.current);
        }
        setSeconds(initialSeconds);
        setDisabled(true);
        intervalId.current = window.setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(intervalId.current!);
                    intervalId.current = null;
                    setDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    return { seconds, disabled, restart};
}

export default useCountdown;