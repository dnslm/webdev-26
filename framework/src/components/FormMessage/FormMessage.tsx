import { classNames } from "../../lib/classNames";
import type { Message } from "../../types";
import styles from "./FormMessage.module.css";

interface FormMessageProps {
    message: Message | null;
}

// абзац есть всегда: скринридер озвучивает текст, когда он появляется внутри aria-live
export function FormMessage({ message }: FormMessageProps) {
    return (
        <p
            className={classNames(
                styles["message"],
                message?.type === "error" && styles["error"],
                message?.type === "success" && styles["success"],
            )}
            aria-live="polite"
        >
            {message?.text}
        </p>
    );
}
