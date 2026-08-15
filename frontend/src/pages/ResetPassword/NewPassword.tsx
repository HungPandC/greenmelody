import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPasswordService } from "../../services/authService";
import useAuth from "../../hooks/useAuth";

function NewPassword() {
    const navigate = useNavigate();
    const { csrfToken } = useAuth();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password.length < 8) {
            setError("Mật khẩu phải có ít nhất 8 ký tự.");
            return;
        }
        if (password !== confirm) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await resetPasswordService(password, confirm, csrfToken);
            const data = await res.json();
            if (data.success) {
                navigate("/login");
            } else {
                setError(data.message || "Đặt lại mật khẩu thất bại.");
            }
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
                <div className="brand-tag">Đặt mật khẩu mới</div>
            </div>

            <div className="form-panel">
                <div className="field">
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    />
                </div>
                <div className="field">
                    <label>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirm}
                        onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                    />
                    {error && <p className="field-error">{error}</p>}
                </div>

                <button className="btn-submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Đặt lại mật khẩu"}
                </button>
            </div>
        </form>
    );
}

export default NewPassword;
