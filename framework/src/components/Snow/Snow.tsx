import { useReducedMotion } from "../../hooks/useReducedMotion";
import { toCss } from "../../lib/toCss";
import styles from "./Snow.module.css";

const FLAKE_COUNT = 40;

interface Flake {
    id: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
}

// значения выводятся из номера снежинки (как у конфетти), поэтому отрисовка остаётся чистой;
// отрицательная задержка нужна, чтобы снег сразу шёл по всему экрану, а не начинал сверху
function createFlakes(count: number): Flake[] {
    return Array.from({ length: count }, (_, index) => ({
        id: index,
        left: (index * 29) % 100,
        size: 10 + ((index * 7) % 17),
        duration: 6 + ((index * 11) % 7),
        delay: -((index * 5) % 10),
    }));
}

const FLAKES = createFlakes(FLAKE_COUNT);

export function Snow() {
    const isReducedMotion = useReducedMotion();

    if (isReducedMotion) return null;

    return (
        <div className={styles["snow"]} aria-hidden="true">
            {FLAKES.map((flake) => (
                <span
                    key={flake.id}
                    className={styles["flake"]}
                    style={{
                        left: toCss(flake.left, "vw"),
                        fontSize: toCss(flake.size, "px"),
                        animationDuration: toCss(flake.duration, "s"),
                        animationDelay: toCss(flake.delay, "s"),
                    }}
                >
                    ❄
                </span>
            ))}
        </div>
    );
}
