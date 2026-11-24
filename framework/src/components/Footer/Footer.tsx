import githubIcon from "../../assets/github.svg";
import telegramIcon from "../../assets/telegram.svg";
import yandexIcon from "../../assets/yandex.svg";
import { FooterLink } from "../FooterLink/FooterLink";
import { Ticker } from "../Ticker/Ticker";
import styles from "./Footer.module.css";

export function Footer() {
    return (
        <footer className={styles["footer"]}>
            <Ticker text="Official denchiee © Licensed Product 2026" />

            <nav className={styles["nav"]} aria-label="Контакты">
                <FooterLink
                    href="https://github.com/dnslm"
                    icon={githubIcon}
                    label="GitHub"
                    external
                />
                <FooterLink
                    href="mailto:deazabdrakhmanov@edu.hse.ru"
                    icon={yandexIcon}
                    label="Яндекс Почта"
                />
                <FooterLink
                    href="https://t.me/@toasterrrrrrrrr"
                    icon={telegramIcon}
                    label="Telegram"
                    external
                />
            </nav>
        </footer>
    );
}
