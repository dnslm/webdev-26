import styles from "./Checkbox.module.css";

interface CheckboxProps {
    id: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
    return (
        // клик по тексту переключает флажок, потому что поле внутри <label>
        <label className={styles["checkbox"]}>
            <input
                id={id}
                name={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => {
                    onChange(event.target.checked);
                }}
            />
            {label}
        </label>
    );
}
