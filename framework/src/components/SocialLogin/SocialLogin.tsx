import appleIcon from "../../assets/apple.svg";
import googleIcon from "../../assets/google.svg";
import { CardHeading } from "../CardHeading/CardHeading";
import { SocialButton } from "../SocialButton/SocialButton";
import styles from "./SocialLogin.module.css";

export function SocialLogin() {
    return (
        <section className={styles["section"]} aria-labelledby="social-login-heading">
            <CardHeading id="social-login-heading">Войти через соцсети</CardHeading>

            <SocialButton icon={googleIcon}>Войти с помощью Google</SocialButton>
            <SocialButton icon={appleIcon}>Войти с помощью Apple</SocialButton>
        </section>
    );
}
