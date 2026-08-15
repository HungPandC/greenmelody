import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { login,googleLoginService } from "../services/authService";
import GoogleLoginButton from "../components/ GoogleLoginButton";
import useAuth from "../hooks/useAuth";

function Login(){

    const { checkLogin, csrfToken } = useAuth()

    const navigate = useNavigate();
    const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
    const [email, setUsermail] = useState("");
    const [password, setUserpassword] = useState("");
    const [email_error, setEmail_error] = useState<string[]>([]);
    const [password_error, setPassword_error] = useState<string[]>([]);
    const isFormValid =
        email_error.length === 0 &&
        password_error.length === 0 &&
        email !== "" &&
        password !== "";
    function validateEmail(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const checkEmail = value.trim().toLowerCase();
        const errors: string[] = [];
        if (checkEmail === "") {
            errors.push("Không được để trống");
        } else {
            if (!emailRegex.test(checkEmail)) {
                errors.push("Sai định dạng email");
            }
            if (/\s/.test(checkEmail)) {
                errors.push("Email không được chứa khoảng trắng");
            }
        }
        setEmail_error(errors);
        setUsermail(value);
    }
    
    function validatePassword(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const errors: string[] = [];
        if (value.trim() === "") {
            errors.push("Không được để trống");
        } else {
            if (value.length > 200) {
                errors.push("Mật khẩu quá dài");
            }
            if (/\s/.test(value)) {
                errors.push("Mật khẩu không được chứa khoảng trắng");
            }
        }
        setPassword_error(errors);
        setUserpassword(value);
    }
    async function signIn(e: React.FormEvent) {
        e.preventDefault();
        const res = await login(email, password,csrfToken);
        const data = await res.json();

        if (data.success) {
            await checkLogin();
            navigate("/home");
        }
    }
    async function handleGoogleLogin(Idtoken: string) {
        const res = await googleLoginService(Idtoken,csrfToken);
        const data = await res.json();

        if (data.success) {
            await checkLogin();
            navigate("/home");
        }
    }
    return (
        <form id="loginForm" onSubmit={signIn}>
            <div className="brand">
                <div className="brand-title">
                    Green<span className="accent">Melody</span>
                    <span className="brand-leaf">🍃</span>
                </div>
                <div className="brand-tag">Practice. Listen. Grow.</div>
            </div>
            <div className="form-panel active" id="panel-dangnhap">
                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="ban@email.com"
                        value={email}
                        onChange={validateEmail}
                    />
                    {email_error.length > 0 &&
                    <p className="field-error">{email_error[0]}</p>}
                </div>
                <div className="field">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={validatePassword}
                    />
                    {password_error.length > 0 &&
                    <p className="field-error">{password_error[0]}</p>}
                </div>
                <p className="form-error"></p>
                <button
                    className="btn-submit"
                    disabled={!isFormValid}
                >
                    Đăng nhập
                </button>
                <div className="divider">HOẶC</div>
                <div className="socials">
                <GoogleLoginButton onSuccess={handleGoogleLogin}/>
                <button className="btn-social">⚫ Facebook</button>
                </div>
                <div className="switch-link">
                    Chưa có tài khoản? <a onClick={() => navigate("/register")}>Đăng ký</a>
                </div>
            </div>
        </form>        
    );
};
export default Login;