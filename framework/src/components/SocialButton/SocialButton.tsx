import styles from "./SocialButton.module.css";

interface SocialButtonProps {
    icon: string;
    children: string;
}

export function SocialButton({ icon, children }: SocialButtonProps) {
    return (
        <button type="button" className={styles["button"]}>
            <img className={styles["icon"]} src={icon} alt="" width={18} height={18} />
            {children}
        </button>
    );
}
