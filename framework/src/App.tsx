import styles from "./App.module.css";
import { Confetti } from "./components/Confetti/Confetti";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { LoginCard } from "./components/LoginCard/LoginCard";
import { Snow } from "./components/Snow/Snow";
import { useSecretCode } from "./hooks/useSecretCode";
import { useAuthStore } from "./store/authStore";
import { useEffectsStore } from "./store/effectsStore";

// секретное слово «bebra»: включает и выключает снегопад
const SECRET_CODE = ["KeyB", "KeyE", "KeyB", "KeyR", "KeyA"];

export function App() {
    const status = useAuthStore((state) => state.status);
    const isSnowing = useEffectsStore((state) => state.isSnowing);
    const toggleSnow = useEffectsStore((state) => state.toggleSnow);

    useSecretCode(SECRET_CODE, toggleSnow);

    return (
        <div className={styles["app"]}>
            <Header />

            <main className={styles["main"]}>
                {/* у страницы должен быть один заголовок первого уровня; визуально он скрыт */}
                <h1 className="visually-hidden">Форма входа</h1>
                <LoginCard />
            </main>

            <Footer />

            {/* конфетти появляется при каждом успешном входе: компонент монтируется заново */}
            {status === "success" && <Confetti />}
            {isSnowing && <Snow />}
        </div>
    );
}
