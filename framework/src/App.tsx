import styles from "./App.module.css";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { LoginCard } from "./components/LoginCard/LoginCard";

export function App() {
    return (
        <div className={styles["app"]}>
            <Header />

            <main className={styles["main"]}>
                {/* у страницы должен быть один заголовок первого уровня; визуально он скрыт */}
                <h1 className="visually-hidden">Форма входа</h1>
                <LoginCard />
            </main>

            <Footer />
        </div>
    );
}
