// src/components/FormField.tsx
type FormFieldProps = {
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    className?: string;
};

function FormField({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    error,
    className,
}: FormFieldProps) {
    return (
        <div className="field">
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className={className}
                value={value}
                onChange={onChange}
            />
            {error && <p className="field-error">{error}</p>}
        </div>
    );
}

export default FormField;