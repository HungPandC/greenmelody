import { useState } from "react";
import styles from "./Settings.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import SideRail from "../../components/layout/SideRail";
import { changePassword } from "../../services/profileService";
import { mockUser } from "../../data/mockUser";

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
    return (
        <div className={`${styles.toggle} ${on ? styles.toggleOn : ""}`} onClick={onChange}>
            <div className={styles.toggleKnob} />
        </div>
    );
}

function Settings() {
    // ---- Account (tên/email) ----
    // CHƯA có API "update profile" ở backend, nên phần này chỉ update state
    // cục bộ + validate ở frontend (đúng yêu cầu: "bảo mật ở frontend thôi,
    // backend để tôi thêm sau"). Khi có API thật, thay hàm saveAccount()
    // bằng 1 lời gọi service giống changePassword bên dưới.
    const [username, setUsername] = useState(mockUser.username);
    const [email, setEmail] = useState(mockUser.email);
    const [accountError, setAccountError] = useState("");
    const [accountSaved, setAccountSaved] = useState(false);

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

    function saveAccount(e: React.FormEvent) {
        e.preventDefault();
        if (username.trim() === "") {
            setAccountError("Tên hiển thị không được để trống.");
            return;
        }
        if (!emailRegex.test(email)) {
            setAccountError("Email không đúng định dạng.");
            return;
        }
        setAccountError("");
        // TODO: gọi API update profile thật khi backend sẵn sàng
        mockUser.username = username;
        mockUser.email = email;
        setAccountSaved(true);
        setTimeout(() => setAccountSaved(false), 2000);
    }

    // ---- Appearance / Sound / Notification (mock, chưa nối gì cả) ----
    const [sound, setSound] = useState(true);
    const [notification, setNotification] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("vi");

    // ---- Change password (đã nối service thật) ----
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwMessage, setPwMessage] = useState("");
    const [pwLoading, setPwLoading] = useState(false);

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPwMessage("Mật khẩu xác nhận không khớp.");
            return;
        }
        setPwLoading(true);
        setPwMessage("");
        try {
            const res = await changePassword({ oldPassword, newPassword, confirmPassword });
            const data = await res.json();
            if (data.success) {
                setPwMessage("Đổi mật khẩu thành công!");
                setOldPassword(""); setNewPassword(""); setConfirmPassword("");
            } else {
                setPwMessage(data.message || "Đổi mật khẩu thất bại.");
            }
        } catch {
            setPwMessage("Không kết nối được máy chủ.");
        } finally {
            setPwLoading(false);
        }
    }

    return (
        <div className="layout">
            <Sidebar />
            <main className="main">
                <Topbar title="Cài đặt" />

                <div className={styles.section}>
                    <h3>Tài khoản</h3>
                    <form onSubmit={saveAccount} className={styles.pwForm}>
                        <input
                            className={styles.input}
                            type="text"
                            placeholder="Tên hiển thị"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setAccountError(""); }}
                        />
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setAccountError(""); }}
                        />
                        {accountError && <p className={styles.pwMessage} style={{ color: "#e0517a" }}>{accountError}</p>}
                        {accountSaved && <p className={styles.pwMessage}>Đã lưu thay đổi!</p>}
                        <button className={styles.saveBtn} type="submit">Lưu thông tin</button>
                    </form>
                </div>

                <div className={styles.section}>
                    <h3>Giao diện & Âm thanh</h3>
                    <div className={styles.row}>
                        <span>Chế độ tối</span>
                        <Toggle on={darkMode} onChange={() => setDarkMode(v => !v)} />
                    </div>
                    <div className={styles.row}>
                        <span>Âm thanh hiệu ứng</span>
                        <Toggle on={sound} onChange={() => setSound(v => !v)} />
                    </div>
                    <div className={styles.row}>
                        <span>Thông báo nhắc học</span>
                        <Toggle on={notification} onChange={() => setNotification(v => !v)} />
                    </div>
                    <div className={styles.row}>
                        <span>Ngôn ngữ</span>
                        <select className={styles.select} value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3>Đổi mật khẩu</h3>
                    <form onSubmit={handleChangePassword} className={styles.pwForm}>
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Mật khẩu hiện tại"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            className={styles.input}
                            type="password"
                            placeholder="Xác nhận mật khẩu mới"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {pwMessage && <p className={styles.pwMessage}>{pwMessage}</p>}
                        <button className={styles.saveBtn} type="submit" disabled={pwLoading}>
                            {pwLoading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                    </form>
                </div>
            </main>
            <SideRail />
        </div>
    );
}

export default Settings;
