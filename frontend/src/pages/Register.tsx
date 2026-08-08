import { useState } from "react";
import { useNavigate } from "react-router-dom";
import profanity from "allprofanity";
import { register } from "../services/authService";
import useAuth from "../hooks/useAuth";
function Register() {
    const emailRegex =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
    const { csrfToken } = useAuth()
    const [username, setUsername] = useState("");
    const [email, setUsermail] = useState("");
    const [password, setUserpassword] = useState("");
    const [password_again, setUserpassword_again] = useState("");
    const [username_error,setUsername_error] = useState<string[]>([]);
    const [email_error,setEmail_error] = useState<string[]>([]);
    const [password_error,setPassword_error] = useState<string[]>([]);
    const [password_again_error,setPassword_again_error] = useState<string[]>([]);

    const isFormValid =
    username_error.length === 0 &&
    email_error.length === 0 &&
    password_error.length === 0 &&
    password_again_error.length === 0 &&
    username !== "" &&
    email !== "" &&
    password !== "" &&
    password_again !== "";

    const navigate = useNavigate();

    async function CreateAccount(e: React.FormEvent) {
        e.preventDefault();
        const res = await register({username,email,password,password_again},csrfToken)

        const data = await res.json();
        console.log(data);
        if (data.success) {
            navigate("/verifyOtp");
        }else{
            console.log(data)
        }
    }
    function validateUsername(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const errors = [];
        const bannedWords = [
            "admin",
            "administrator",
            "root",
            "support",
            "staff",
            "owner",
            "system",
            "api",
        ];
        if(value.trim() === ""){
            errors.push("Không được để trống")
        }
        if(/[^a-zA-Z0-9_\s]/.test(value)){
            errors.push("Ký tự không hợp lệ")
        }
        if(/^_/.test(value)) {
            errors.push("Không được bắt đầu bằng _");
            return;
        }

        if(/_$/.test(value)) {
            errors.push("Không được kết thúc bằng _");
            return;
        }
        if(/_{2,}/.test(value)) {
            errors.push("Không được có nhiều dấu _ liên tiếp");
        }
        if(bannedWords.some(banned => value.toLowerCase().includes(banned) )){
            errors.push("Tên chứa từ cấm");
        }
        if (profanity.check(value)) {
            errors.push("Username chứa từ không phù hợp.");
        }
        setUsername_error(errors);
        setUsername(value);
    }
    function validateEmail(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;
        const CheckEmail = value.trim().toLowerCase();
        const errors: string[] = [];
        if(CheckEmail === ""){
            errors.push("Không được để trống")
        }else {
            if(!emailRegex.test(CheckEmail)){
                errors.push("Sai định dạng email");
            }
            if (/\s/.test(CheckEmail)) {
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
            if (value.length < 8) {
                errors.push("Mật khẩu phải có ít nhất 8 ký tự");
            }

            if (value.length > 64) {
                errors.push("Mật khẩu không được quá 64 ký tự");
            }

            if (!/[a-z]/.test(value)) {
                errors.push("Phải có ít nhất 1 chữ thường");
            }

            if (!/[A-Z]/.test(value)) {
                errors.push("Phải có ít nhất 1 chữ hoa");
            }

            if (!/[0-9]/.test(value)) {
                errors.push("Phải có ít nhất 1 chữ số");
            }

            if (!/[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(value)) {
                errors.push("Phải có ít nhất 1 ký tự đặc biệt");
            }

            if (/\s/.test(value)) {
                errors.push("Mật khẩu không được chứa khoảng trắng");
            }
        }

        setPassword_error(errors);
        setUserpassword(value);
    }
    function validatePassword_again(e: React.ChangeEvent<HTMLInputElement>){
        const value = e.target.value;
        const errors: string[] = [];
        if(value.trim() === ""){
            errors.push("Không được để trống")
        }else {
            if(value !== password){
                errors.push("Mật khẩu không khớp")
            }
        }
        setPassword_again_error(errors);
        setUserpassword_again(value);
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
                <div className="field">
                    <label>Tên hiển thị</label>
                    <input
                        type="text"
                        placeholder="Tên của bạn"
                        className="username"
                        value={username}
                        onChange={validateUsername}
                    />
                    {username_error.length > 0 && <p className="field-error">{username_error[0]}</p>}
                </div>

                <div className="field">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="ban@email.com"
                        className="email"
                        value={email}
                        onChange={validateEmail}
                    />
                    {email_error.length > 0 && <p className="field-error">{email_error[0]}</p>}
                </div>

                <div className="field">
                    <label>Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Tạo mật khẩu"
                        className="password"
                        value={password}
                        onChange={validatePassword}
                    />
                    {password_error.length > 0 && <p className="field-error">{password_error[0]}</p>}
                </div>

                <div className="field">
                    <label>Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={password_again}
                        onChange={validatePassword_again}
                    />
                    {password_again_error.length > 0 && <p className="field-error">{password_again_error[0]}</p>}
                </div>

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