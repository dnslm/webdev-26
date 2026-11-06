console.log("script.js подключен");

// ============================================
// ССЫЛКИ НА DOM-ЭЛЕМЕНТЫ
// ============================================
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const loginForm = document.getElementById("login-form");
const formMessage = document.getElementById("form-message");
const signInButton = loginForm.querySelector(".sign-in");


// ============================================
// ВАЛИДАЦИЯ
// ============================================

// именованная функция проверки формата email
function isValidEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}

// именованная функция валидация пароля
// минимум 8 символов, хотя бы одна буква и одна цифра
function isValidPassword(value) {
    const passwordPattern = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
}

// стрелочная функция
// способ показать состояние поля (заменяет два одинаковых обработчика)
const setFieldState = (input, isValid) => {
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

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-message " + type;
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
function saveData(email, password) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({email, password}));
}

function clearData() {
    localStorage.removeItem(STORAGE_KEY);
}

// читает сохранённую пару
// если ничего нет или данные повреждены, вернёт null
function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

// подставляет сохранённые данные в форму при загрузке страницы
const restoreForm = () => {
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
const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Конфетти после успешного входа
function launchConfetti() {
    if (prefersReducedMotion()) return;

    const colors = ["#9a80db", "#f5b942", "#4caf50", "#e05353", "#4aa8ff"];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti";
        piece.setAttribute("aria-hidden", "true");
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = 1.5 + Math.random() * 1.5 + "s";
        piece.style.animationDelay = Math.random() * 0.3 + "s";
        piece.addEventListener("animationend", () => piece.remove());
        document.body.appendChild(piece);
    }
}

// бебра код включает и выключает снегопад
const SECRET_CODE = ["KeyB", "KeyE", "KeyB", "KeyR", "KeyA"];
let secretProgress = 0;
let snowContainer = null;

const toggleSnow = () => {
    // повторный ввод кода выключает снег
    if (snowContainer) {
        snowContainer.remove();
        snowContainer = null;
        return;
    }
    if (prefersReducedMotion()) return;

    snowContainer = document.createElement("div");
    snowContainer.className = "snow";
    snowContainer.setAttribute("aria-hidden", "true");

    for (let i = 0; i < 40; i++) {
        const flake = document.createElement("span");
        flake.className = "snowflake";
        flake.textContent = "❄";
        flake.style.left = Math.random() * 100 + "vw";
        flake.style.fontSize = 10 + Math.random() * 16 + "px";
        flake.style.animationDuration = 6 + Math.random() * 6 + "s";
        flake.style.animationDelay = -Math.random() * 10 + "s";
        snowContainer.appendChild(flake);
    }

    document.body.appendChild(snowContainer);
    showMessage("пасхалко🥶", "success");
};

document.addEventListener("keydown", (event) => {
    // не срабатываем, пока пользователь печатает в поле формы
    if (event.target.matches("input, textarea")) return;

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

// Включает/выключает состояние загрузки на кнопке
const setLoading = (isLoading) => {
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

    showMessage("", "");
    setLoading(true);

    setTimeout(() => {
        setLoading(false);

        if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
            if (rememberInput.checked) {
                saveCredentials(email, password);
            } else {
                clearCredentials();
            }
            showMessage("Вход выполнен!", "success");
            launchConfetti();
        } else {
            showMessage("Неверный email или пароль", "error");
        }
    }, LOGIN_DELAY_MS);
});