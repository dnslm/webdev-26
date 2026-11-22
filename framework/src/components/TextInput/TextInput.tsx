import type { ChangeEvent } from "react";

interface TextInputProps {
    id: string;
    type: "text" | "password";
    value: string;
    onChange: (value: string) => void;
}

export function TextInput({ id, type, value, onChange }: TextInputProps) {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return <input id={id} type={type} value={value} onChange={handleInputChange} />;
}
