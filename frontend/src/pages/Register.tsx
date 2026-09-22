import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import useAuth from "../hooks/useAuth";
import {
    validateUsername,
    validateEmail,
    validatePassword,
    validatePasswordAgain,
} from "../validations/authValidation";
import FormField from "../components/FormField";

function Register() {
    const { csrfToken } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setUsermail] = useState("");
    const [password, setUserpassword] = useState("");
    const [password_again, setUserpassword_again] = useState("");

    const [username_error, setUsername_error] = useState<string[]>([]);
    const [email_error, setEmail_error] = useState<string[]>([]);
    const [password_error, setPassword_error] = useState<string[]>([]);
    const [password_again_error, setPassword_again_error] = useState<string[]>([]);

    const isFormValid =
        username_error.length === 0 &&
        email_error.length === 0 &&
        password_error.length === 0 &&
        password_again_error.length === 0 &&
        username !== "" &&
        email !== "" &&
        password !== "" &&
        password_again !== "";

    function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername_error(validateUsername(e.target.value));
        setUsername(e.target.value);
    }
    function onEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail_error(validateEmail(e.target.value));
        setUsermail(e.target.value);
    }
    function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword_error(validatePassword(e.target.value));
        setUserpassword(e.target.value);
        // nếu password đổi mà password_again đã nhập rồi thì check lại luôn
        if (password_again !== "") {
            setPassword_again_error(validatePasswordAgain(password_again, e.target.value));
        }
    }
    function onPasswordAgainChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword_again_error(validatePasswordAgain(e.target.value, password));
        setUserpassword_again(e.target.value);
    }

    async function CreateAccount(e: React.FormEvent) {
        e.preventDefault();
        const res = await register({ username, email, password, password_again }, csrfToken);
        const data = await res.json();
        if (data.success) {
            navigate("/verifyOtp");
        } else {
            // TODO: hiển thị data.errors (từ backend) ra form thay vì console.log
            console.log(data);
        }
    }

    return (
        <form id="registerForm" onSubmit={CreateAccount}>
            <div className="brand">
                <div className="brand-title">
                    Green<span className="accent">Melody</span>
                    <span className="brand-leaf">🍃</span>
                </div>
                <div className="brand-tag">Grow your musical ear naturally</div>
            </div>

            <div className="form-panel" id="panel-dangky">
                <FormField
                    label="Tên hiển thị"
                    placeholder="Tên của bạn"
                    className="username"
                    value={username}
                    onChange={onUsernameChange}
                    error={username_error[0]}
                />
                <FormField
                    label="Email"
                    type="email"
                    placeholder="ban@email.com"
                    className="email"
                    value={email}
                    onChange={onEmailChange}
                    error={email_error[0]}
                />
                <FormField
                    label="Mật khẩu"
                    type="password"
                    placeholder="Tạo mật khẩu"
                    className="password"
                    value={password}
                    onChange={onPasswordChange}
                    error={password_error[0]}
                />
                <FormField
                    label="Xác nhận mật khẩu"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={password_again}
                    onChange={onPasswordAgainChange}
                    error={password_again_error[0]}
                />

                <p className="form-error"></p>

                <button type="submit" className="btn-submit" disabled={!isFormValid}>
                    Tạo tài khoản
                </button>
                <div className="terms">
                Bằng việc đăng ký, bạn đồng ý với <a href="#">Điều khoản</a> & <a href="#">Chính sách</a>.
                </div>

                <div className="switch-link">
                    Đã có tài khoản? <a onClick={() => navigate("/login")}>Đăng nhập</a>
                </div>
            </div>
        </form>
    );
}
export default Register;