import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyResetOtpService, sendResetOtpService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

function VerifyResetOTP() {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const demNguocId = useRef<number | null>(null);
    const [second, setSecond] = useState(60);
    const [array, setArray] = useState<string[]>(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const { csrfToken } = useAuth();
    const navigate = useNavigate();

    function handleInput(value: string, index: number) {
        const v = value.replace(/\D/g, "");
        const next = [...array];
        next[index] = v;
        setArray(next);
        if (v && index < 5) inputRefs.current[index + 1]?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !array[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function startCountdown() {
        if (demNguocId.current !== null) clearInterval(demNguocId.current);
        setSecond(60);
        linkRef.current?.classList.add("disabled");
        demNguocId.current = window.setInterval(() => {
            setSecond((prev) => {
                if (prev <= 1) {
                    clearInterval(demNguocId.current!);
                    demNguocId.current = null;
                    linkRef.current?.classList.remove("disabled");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    async function resend() {
        if (linkRef.current?.classList.contains("disabled")) return;
        setArray(["", "", "", "", "", ""]);
        setError("");
        startCountdown();
        await sendResetOtpService(csrfToken);
    }

    async function confirm() {
        const otp = array.join("");
        if (!/^\d{6}$/.test(otp)) {
            setError("OTP phải gồm đúng 6 chữ số.");
            return;
        }
        const res = await verifyResetOtpService(otp, csrfToken);
        const data = await res.json();
        if (data.success) {
            navigate("/reset-password/new");
        } else {
            setError(data.message || "Mã OTP không đúng.");
        }
    }

    useEffect(() => { startCountdown(); }, []);

    return (
        <div className="form-panel">
            <div className="otp-icon">🔑</div>
            <div className="otp-title">Xác minh khôi phục mật khẩu</div>
            <div className="otp-sub">Nhập mã 6 số vừa được gửi tới email của bạn</div>

            <div className="otp-boxes">
                {[...Array(6)].map((_, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        className={array[i] ? "filled" : ""}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={array[i]}
                        onChange={(e) => handleInput(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                    />
                ))}
            </div>

            <div className="otp-error">{error}</div>

            <button className="btn-submit" onClick={confirm}>Xác nhận</button>

            <div className="otp-resend">
                Chưa nhận được mã? <a ref={linkRef} onClick={resend}>Gửi lại</a>
                <span>{second > 0 ? `(${second}s)` : ""}</span>
            </div>
        </div>
    );
}

export default VerifyResetOTP;
