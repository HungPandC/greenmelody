import { useState,useRef} from "react";
import { useNavigate } from "react-router-dom";
import { verifyRegisterOtp,sendRegisterOtp } from "../services/authService";
import useAuth from "../hooks/useAuth";
import useCountdown from "../hooks/useCountdown";
import type { OtpInputHandle } from "../components/OtpInput";
import OtpInput from "../components/OtpInput";
function VerifyRegisterOTP() {
    const navigate = useNavigate();
    const { csrfToken } = useAuth();
    const otpRef = useRef<OtpInputHandle>(null);
    const [otp, setOtp] = useState("");
    const { seconds, restart, disabled } = useCountdown(60);
    const [error, setError] = useState("");

    async function confirm() {
        if (!/^\d{6}$/.test(otp)) return setError("OTP phải gồm đúng 6 chữ số.");
        const res = await verifyRegisterOtp(otp, csrfToken);
        const data = await res.json();
        if (data.success) navigate("/home");
        else setError(data.message);
    }

    async function resend() {
        if (disabled) return;
        otpRef.current?.reset();
        restart();
        await sendRegisterOtp(csrfToken);
    }

    return (
        <div className="form-panel">
            <div className="otp-icon">📩</div>
            <OtpInput ref={otpRef} onChange={setOtp} />
            <div className="otp-error">{error}</div>
            <button className="btn-submit" onClick={confirm}>Xác nhận</button>
            <a onClick={resend} className={disabled ? "disabled" : ""}>
                Gửi lại {disabled && `(${seconds}s)`}
            </a>
        </div>
    );
}
export default VerifyRegisterOTP;