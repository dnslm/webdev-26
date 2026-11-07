import type { UserData, MessageType } from "./types";

console.log("script.js подключен");

// ============================================
// ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
// ============================================

// ищет элемент по id и гарантирует его тип
// если элемента нет или он другого типа, сразу бросает понятную ошибку
function getElement<T extends HTMLElement>(id: string, type: new () => T): T {
    const element = document.getElementById(id);
    if (!(element instanceof type)) {
        throw new Error(`Элемент #${id} не найден или имеет другой тип (ожидался ${type.name})`);
    }
    return element;
}
 
const emailInput = getElement("email", HTMLInputElement);
const passwordInput = getElement("password", HTMLInputElement);
const rememberInput = getElement("remember", HTMLInputElement);
const loginForm = getElement("login-form", HTMLFormElement);
const formMessage = getElement("form-message", HTMLElement);
 
const signInButton = loginForm.querySelector(".sign-in");
if (!(signInButton instanceof HTMLButtonElement)) {
    throw new Error("Кнопка .sign-in не найдена");
}


// ============================================
// ВАЛИДАЦИЯ
// ============================================

// именованная функция проверки формата email
function isValidEmail(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}

// именованная функция валидация пароля
// минимум 8 символов, хотя бы одна буква и одна цифра
function isValidPassword(value: string): boolean {
    const passwordPattern = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
}

// стрелочная функция
// способ показать состояние поля (заменяет два одинаковых обработчика)
const setFieldState = (input: HTMLInputElement, isValid: boolean): void => {
    input.classList.remove("valid", "invalid");
    input.setAttribute("aria-invalid", String(!isValid));

    if (isValid) {
        input.classList.add("valid");
    } else {
        // класс добавляется в следующем кадре, чтобы анимация тряски запускалась заново
        requestAnimationFrame(() => input.classList.add("invalid"));
    }
};

// проверка при уходе с поля
emailInput.addEventListener("blur", () => {
    setFieldState(emailInput, isValidEmail(emailInput.value.trim()));
});

passwordInput.addEventListener("blur", () => {
    setFieldState(passwordInput, isValidPassword(passwordInput.value));
});


// ============================================
// СООБЩЕНИЯ ПОЛЬЗОВАТЕЛЮ
// ============================================

function showMessage(text: string, type: MessageType): void {
    formMessage.textContent = text;
    formMessage.className = "form-message " + type;
}

// убирает сообщение (раньше для этого вызывали showMessage("", ""))
function clearMessage(): void {
    formMessage.textContent = "";
    formMessage.className = "form-message";
}


// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

// срабатывает, когда пользователь покидает поле email (blur)
// причина тряски
emailInput.addEventListener("blur", () => {
    const value = emailInput.value.trim();

    if (isValidEmail(value)) {
        emailInput.classList.remove("invalid");
        emailInput.classList.add("valid");
    } else {
        emailInput.classList.remove("valid");

        // убираем класс, чтобы тряска могла запуститься заново,
        // даже если поле уже было invalid до этого
        emailInput.classList.remove("invalid");

        requestAnimationFrame(() => {
            emailInput.classList.add("invalid");
        });
    }
});

// обработчик неверного пароля, кароч всё то же самое)
passwordInput.addEventListener("blur", () => {
    const value = passwordInput.value;

    if (isValidPassword(value)) {
        passwordInput.classList.remove("invalid");
        passwordInput.classList.add("valid");
    } else {
        passwordInput.classList.remove("valid");
        passwordInput.classList.remove("invalid");

        requestAnimationFrame(() => {
            passwordInput.classList.add("invalid");
        });
    }
});


// ============================================
// ХРАНЕНИЕ ДАННЫХ (localStorage)
// хранить пароль в открытом виде опасненько, но в задании написано про пару логин-пароль
// ирл пароль на клиенте не хранят
// ============================================

const STORAGE_KEY = "loginData";

// сохр логин и пароль
// localStorage хранит только строки, поэтрму JSON
function saveData(email: string, password: string): void {
    const data: UserData = { email, password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearData(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// проверка формы данных: из localStorage может прийти что угодно
// (например, пользователь вручную поправил значение в DevTools)
function isData(value: unknown): value is UserData {
    return (
        typeof value === "object" &&
        value !== null &&
        "email" in value &&
        "password" in value &&
        typeof value.email === "string" &&
        typeof value.password === "string"
    );
}
 
// читает сохранённую пару
// если ничего нет или данные повреждены, вернёт null
function loadData(): UserData | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
 
    try {
        const parsed: unknown = JSON.parse(raw);
        return isData(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

// подставляет сохранённые данные в форму при загрузке страницы
const restoreForm = (): void => {
    const saved = loadData();
    if (!saved) return;

    emailInput.value = saved.email;
    passwordInput.value = saved.password;
    rememberInput.checked = true;
    showMessage("Данные восстановлены", "success");
};

restoreForm();


// ============================================
// ЭФФЕКТЫ
// ============================================
const prefersReducedMotion = (): boolean =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// конфетти после успешного входа
function launchConfetti(): void {
    if (prefersReducedMotion()) return;

    const colors = ["#9a80db", "#f5b942", "#4caf50", "#e05353", "#4aa8ff"];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.setAttribute("aria-hidden", "true");
        piece.style.left = Math.random() * 100 + "vw";
        // ?? нужен из-за noUncheckedIndexedAccess: элемент массива может быть undefined
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)] ?? "#9a80db";
        piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
        piece.style.animationDelay = Math.random() * 0.3 + "s";
        piece.addEventListener("animationend", () => piece.remove());
        document.body.appendChild(piece);
    }
}

// бебра код включает и выключает снегопад
const SECRET_CODE = ["KeyB", "KeyE", "KeyB", "KeyR", "KeyA"];
let secretProgress = 0;
let snowContainer: HTMLDivElement | null = null;

const toggleSnow = (): void => {
    // повторный ввод кода выключает снег
    if (snowContainer) {
        snowContainer.remove();
        snowContainer = null;
        return;
    }
    if (prefersReducedMotion()) return;

    const container = document.createElement("div");
    container.className = "snow";
    container.setAttribute("aria-hidden", "true");
 
    for (let i = 0; i < 40; i++) {
        const flake = document.createElement("span");
        flake.className = "snowflake";
        flake.textContent = "❄";
        flake.style.left = Math.random() * 100 + "vw";
        flake.style.fontSize = 10 + Math.random() * 16 + "px";
        flake.style.animationDuration = 6 + Math.random() * 6 + "s";
        flake.style.animationDelay = -Math.random() * 10 + "s";
        container.appendChild(flake);
    }
 
    document.body.appendChild(container);
    snowContainer = container;
    showMessage("пасхалко🥶", "success");
};

document.addEventListener("keydown", (event) => {
    // не срабатываем, пока пользователь печатает в поле формы
    // event.target может быть null или не элементом, поетому сначала проверяем instanceof
    if (event.target instanceof Element && event.target.matches("input, textarea")) return;

    if (event.code === SECRET_CODE[secretProgress]) {
        secretProgress++;
        if (secretProgress === SECRET_CODE.length) {
            secretProgress = 0;
            toggleSnow();
        }
    } else {
        // если нажата не та клавиша, но это начало кода, считаем её первой
        secretProgress = event.code === SECRET_CODE[0] ? 1 : 0;
    }
});


// ============================================
// ОТПРАВКА ФОРМЫ (хардкод)
// ============================================
const CORRECT_EMAIL = "test@email.com";
const CORRECT_PASSWORD = "abobaBebra1487";
const LOGIN_DELAY_MS = 800; // имитация запроса к серверу

// вкл/выкл состояние загрузки на кнопке
const setLoading = (isLoading: boolean): void => {
    signInButton.classList.toggle("loading", isLoading);
    signInButton.disabled = isLoading;
    signInButton.setAttribute("aria-busy", String(isLoading));
};

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const emailOk = isValidEmail(email);
    const passwordOk = isValidPassword(password);
    setFieldState(emailInput, emailOk);
    setFieldState(passwordInput, passwordOk);

    if (!emailOk || !passwordOk) {
        showMessage("Проверьте формат email и пароля", "error");
        return;
    }

    clearMessage();
    setLoading(true);

    setTimeout(() => {
        setLoading(false);

        if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
            if (rememberInput.checked) {
                saveData(email, password);
            } else {
                clearData();
            }
            showMessage("Вход выполнен!", "success");
            launchConfetti();
        } else {
            showMessage("Неверный email или пароль", "error");
        }
    }, LOGIN_DELAY_MS);
});