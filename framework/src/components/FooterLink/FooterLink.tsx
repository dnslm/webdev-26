import styles from "./FooterLink.module.css";

interface FooterLinkProps {
    href: string;
    icon: string;
    label: string;
    // внешние ссылки открываются в новой вкладке
    external?: boolean;
}

export function FooterLink({ href, icon, label, external = false }: FooterLinkProps) {
    return (
        <a
            className={styles["link"]}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
        >
            {/* иконка декоративная: рядом есть видимый текст, поэтому alt пустой */}
            <img className={styles["icon"]} src={icon} alt="" width={18} height={18} />
            <span className={styles["text"]}>{label}</span>
        </a>
    );
}
