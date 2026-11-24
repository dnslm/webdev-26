import { classNames } from "../../lib/classNames";
import styles from "./SubmitButton.module.css";

interface SubmitButtonProps {
    isLoading: boolean;
    children: string;
}

export function SubmitButton({ isLoading, children }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            className={classNames(styles["button"], isLoading && styles["loading"])}
            disabled={isLoading}
            aria-busy={isLoading}
        >
            {children}
        </button>
    );
}
