import { useState } from "react";
import styles from "./Settings.module.css";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import { changePassword } from "../../services/profileService";

// Toggle switch nhỏ tái sử dụng cho Sound/Notification/Appearance
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
    return (
        <div className={`${styles.toggle} ${on ? styles.toggleOn : ""}`} onClick={onChange}>
            <div className={styles.toggleKnob} />
        </div>
    );
}

function Settings() {
    // Mock state cho các setting chưa có backend — chỉ cần UI phản hồi được ở prototype này.
    const [sound, setSound] = useState(true);
    const [notification, setNotification] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("vi");

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
        </div>
    );
}

export default Settings;
