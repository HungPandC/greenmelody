// components/OtpInput.tsx
import { useRef, useState, forwardRef, useImperativeHandle } from "react";

export type OtpInputHandle = {
    reset: () => void;
    focus: () => void;
};

interface OtpInputProps {
    length?: number;
    onChange?: (otp: string) => void; // trả về chuỗi otp mỗi khi thay đổi
}

const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(function OtpInput(
    { length = 6, onChange },
    ref
) {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    function update(next: string[]) {
        setValues(next);
        onChange?.(next.join(""));
    }

    function handleInput(value: string, index: number) {
        const v = value.replace(/\D/g, "");
        const next = [...values];
        next[index] = v;
        update(next);
        if (v && index < length - 1) inputRefs.current[index + 1]?.focus();
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, index: number) {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const next = [...values];
        paste.split("").forEach((char, i) => { next[i] = char; });
        update(next);
        inputRefs.current[Math.min(paste.length, length - 1)]?.focus();
    }

    useImperativeHandle(ref, () => ({
        reset: () => update(Array(length).fill("")),
        focus: () => inputRefs.current[0]?.focus(),
    }));

    return (
        <div className="otp-boxes">
            {values.map((v, i) => (
                <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    className={v ? "filled" : ""}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={(e) => handleInput(e.target.value, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={handlePaste}
                />
            ))}
        </div>
    );
});

export default OtpInput;