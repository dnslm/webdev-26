import logo from "../../assets/logo.png";
import styles from "./Header.module.css";

export function Header() {
    return (
        <header className={styles["header"]}>
            <a href="/" className={styles["logoLink"]} aria-label="На главную">
                <img className={styles["logo"]} src={logo} alt="Логотип" />
            </a>
        </header>
    );
}
