import styles from "./CardHeading.module.css";

interface CardHeadingProps {
    id?: string;
    children: string;
}

// заголовок раздела внутри карточки
export function CardHeading({ id, children }: CardHeadingProps) {
    return (
        <h2 className={styles["heading"]} id={id}>
            {children}
        </h2>
    );
}
