import { AuthForm } from "../AuthForm/AuthForm";
import { SocialLogin } from "../SocialLogin/SocialLogin";
import styles from "./LoginCard.module.css";

export function LoginCard() {
    return (
        <div className={styles["card"]}>
            <SocialLogin />
            <AuthForm />
        </div>
    );
}
