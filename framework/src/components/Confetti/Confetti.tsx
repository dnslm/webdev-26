import { useEffect, useState } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { toCss } from "../../lib/toCss";
import styles from "./Confetti.module.css";

const COLORS = ["#9a80db", "#f5b942", "#4caf50", "#e05353", "#4aa8ff"];
const PIECE_COUNT = 60;
// самый долгий кусочек падает около 3,2 секунды; после этого убираем всё из страницы
const LIFETIME_MS = 3500;

interface Piece {
    id: number;
    left: number;
    color: string;
    duration: number;
    delay: number;
}

// «случайные» значения выводятся из номера кусочка, а не из Math.random:
// так отрисовка остаётся чистой (одни и те же данные дают один и тот же результат),
// а конфетти всё равно выглядит разбросанным
function createPieces(count: number): Piece[] {
    return Array.from({ length: count }, (_, index) => ({
        id: index,
        left: (index * 37) % 100,
        // ?? нужен из-за noUncheckedIndexedAccess: элемент массива может быть undefined
        color: COLORS[index % COLORS.length] ?? "#9a80db",
        duration: 1.5 + ((index * 13) % 15) / 10,
        delay: ((index * 7) % 4) / 10,
    }));
}

const PIECES = createPieces(PIECE_COUNT);

export function Confetti() {
    const isReducedMotion = useReducedMotion();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timerId = window.setTimeout(() => {
            setIsVisible(false);
        }, LIFETIME_MS);

        return () => {
            window.clearTimeout(timerId);
        };
    }, []);

    if (isReducedMotion || !isVisible) return null;

    return (
        <div className={styles["confetti"]} aria-hidden="true">
            {PIECES.map((piece) => (
                <span
                    key={piece.id}
                    className={styles["piece"]}
                    style={{
                        left: toCss(piece.left, "vw"),
                        backgroundColor: piece.color,
                        animationDuration: toCss(piece.duration, "s"),
                        animationDelay: toCss(piece.delay, "s"),
                    }}
                />
            ))}
        </div>
    );
}
