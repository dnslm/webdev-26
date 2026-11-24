import styles from "./Ticker.module.css";

interface TickerProps {
    text: string;
}

const COPIES_PER_GROUP = 4;
const GROUPS = [0, 1];
const COPIES = Array.from({ length: COPIES_PER_GROUP }, (_, index) => index);

export function Ticker({ text }: TickerProps) {
    return (
        <div className={styles["ticker"]}>
            {/* скринридер читает фразу один раз, а не восемь */}
            <p className="visually-hidden">{text}</p>

            {/* две одинаковые группы нужны для бесшовной прокрутки:
                анимация сдвигает дорожку ровно на одну группу и начинает заново */}
            <div className={styles["track"]} aria-hidden="true">
                {GROUPS.map((group) => (
                    <div key={group} className={styles["group"]}>
                        {COPIES.map((copy) => (
                            <span key={copy} className={styles["item"]}>
                                {text}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
