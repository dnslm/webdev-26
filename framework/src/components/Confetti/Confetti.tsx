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

// диапазоны те же, что в native-версии: положение и цвет выбираются случайно,
// длительность падения — от 1,5 до 3 секунд, задержка — до 0,3 секунды
function createPieces(count: number): Piece[] {
    return Array.from({ length: count }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        // ?? нужен из-за noUncheckedIndexedAccess: элемент массива может быть undefined
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#9a80db",
        duration: 1.5 + Math.random() * 1.5,
        delay: Math.random() * 0.3,
    }));
}

export function Confetti() {
    const isReducedMotion = useReducedMotion();
    // кусочки создаются один раз при каждом показе конфетти, как в native-версии
    const [pieces] = useState(() => createPieces(PIECE_COUNT));
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
            {pieces.map((piece) => (
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
