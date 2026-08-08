import { useState,useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { verifyRegisterOtp,sendRegisterOtp } from "../services/authService";
import useAuth from "../hooks/useAuth";
function VerifyOTP(){
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const [OtpNotification,setOtpNotification] = useState("")
    const [success, setSuccess] = useState(false);
    const demNguocId = useRef<number | null>(null);
    const [second, setSecond] = useState(60);
    const { csrfToken } = useAuth()
    const navigate = useNavigate();

    const [array, Setarray] = useState<string[]>(["", "", "", "", "", ""]);

    
    async function sendOtp() {
        const res = await sendRegisterOtp(csrfToken)
        const data = await res.json();
        if (!data.success) {
            alert(data.message);
        }
    }
    async function VerifyOtp() {
        const otp = array.join("");
        const res = await verifyRegisterOtp(otp,csrfToken)
        const data = await res.json();
        console.log(data);
        if(data.success){
            navigate("/home")
        }
    }
    function HandleInput(input: string, index: number) {
        const value = input.replace(/\D/g, "");

        const newArray = [...array];
        newArray[index] = value;
        Setarray(newArray);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }
    function HandleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number){
        if(e.key === 'Backspace' && !array[index] && index > 0){
             inputRefs.current[index - 1]?.focus();
        }
    }
    function HandlePaste(e: React.ClipboardEvent<HTMLInputElement>){
        e.preventDefault(); // ngan chan hanh dong cua trinh duyet
        const paste = e.clipboardData.getData('text').replace(/[^0-9]/g,'').slice(0,6);
        const newArray = [...array];

        paste.split("").forEach((char, i)=>{
            newArray[i] = char;
            inputRefs.current[i]!.classList.add("filled");
        });

        Setarray(newArray);
        const next = Math.min(paste.length, 5);
        inputRefs.current[next]?.focus();
    };
    function resetOtpBoxes(){
        Setarray(["","","","","",""]);
        setOtpNotification("")
        inputRefs.current?.[0]?.focus();
    }
    async function xacNhanOtp(){
        const otp = array.join("");

        if (!/^\d{6}$/.test(otp)) {
            setSuccess(false);
            setOtpNotification("OTP phải gồm đúng 6 chữ số.");
            return;
        }
        await VerifyOtp();
        // setSuccess(true);
        // setOtpNotification('Xác minh thành công! (demo giao diện)');
    }
    function batDauDemNguoc() {
        if (demNguocId.current !== null) {
            clearInterval(demNguocId.current);
        }

        setSecond(60);
        linkRef.current?.classList.add("disabled");

        demNguocId.current = window.setInterval(() => {
            setSecond(prev => {
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

    async function guiLaiOtp(){
        if(linkRef.current!.classList.contains('disabled')) return;
        resetOtpBoxes();
        batDauDemNguoc();    
        await sendOtp();
    }
    useEffect(() => {
        sendOtp().catch((err) => {
            console.error(err);
        });
        batDauDemNguoc();
    }, []);
    return(
    <div className="form-panel" id="panel-otp">
        <div className="otp-icon">📩</div>
        <div className="otp-title">Xác minh email</div>
        <div className="otp-sub">Nhập mã 6 số vừa được gửi tới<b id="otp-email-hien">ban@email.com</b></div>

        <div className="otp-boxes">
            {[...Array(6)].map((_, index) => (
                <input
                    ref={(el) => {
                        inputRefs.current[index] = el;
                    }}
                    className={array[index] ? "filled" : ""}
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={array[index]}
                    onChange={(e) => HandleInput(e?.target.value,index)}  
                    onKeyDown={(e)=> HandleKeyDown(e,index)}
                    onPaste={(e) => HandlePaste(e)}
                />
            ))}
        </div>

        <div className = {success ? "otp-success" : "otp-error"} id="otp-notification">{OtpNotification}</div>

        <button className="btn-submit" onClick={xacNhanOtp}>Xác nhận</button>

        <div className="otp-resend">
            Chưa nhận được mã? <a ref={linkRef} onClick={() => guiLaiOtp()}>Gửi lại</a>
            <span>{second > 0 ? `(${second}s)` : ""}</span>
        </div>

        {/* <a className="link-back" onClick={chuyenTab('dangky')}>← Quay lại đăng ký</a> */}
    </div>
    )
}
export default VerifyOTP;