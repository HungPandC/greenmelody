import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordService, sendResetOtpService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

// Dùng lại đúng markup/class của Login.tsx (.field, .btn-submit...) để giữ nguyên
// visual style form đăng nhập/đăng ký -> không cần CSS mới.
function ForgotPassword() {
    const navigate = useNavigate();
    const { csrfToken } = useAuth();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) {
            setError("Vui lòng nhập email");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await forgotPasswordService(email, csrfToken);
            const data = await res.json();
            if (data.success === false) {
                setError(data.message || "Email không tồn tại trong hệ thống.");
                setLoading(false);
                return;
            }
            await sendResetOtpService(csrfToken);
            navigate("/reset-password/verify");
        } catch {
            setError("Không kết nối được máy chủ.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="brand">
                <div className="brand-title">
                    Green<span className="accent">Melody</span>
                    <span className="brand-leaf">🍃</span>
                </div>
                <div className="brand-tag">Khôi phục mật khẩu</div>
            </div>

            <div className="form-panel">
                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="ban@email.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    />
                    {error && <p className="field-error">{error}</p>}
                </div>

                <button className="btn-submit" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
                </button>

                <a className="link-back" onClick={() => navigate("/login")}>← Quay lại đăng nhập</a>
            </div>
        </form>
    );
}

export default ForgotPassword;
