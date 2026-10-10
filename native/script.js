console.log("script.js подключен");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// функция проверки формата email
function isValidEmail(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}

// функция валидация пароля
// минимум 8 символов, хотя бы одна буква и одна цифра
function isValidPassword(value) {
    const passwordPattern = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

// срабатывает, когда пользователь покидает поле email (blur)
// причина тряски?))
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
// ПРОВЕРКА ЛОГИНА И ПАРОЛЯ (хардкод)
// ============================================
const correctEmail = "test@email.com";
const correctPassword = "aboba6769";

const loginForm = document.getElementById("login-form");
const formMessage = document.getElementById("form-message");

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "form-message" + type;
}

loginform.addEventListener("submit", (event) => {
    event.preventDefaunt(); // не дать перезагрузиться

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!isValidEmail(email) || !isValidPassword(password)) {
        showMessage("Проверьте корректность введённых данных", "error");
    }
    else if (email === correctEmail && password === correctPassword) {
        // сохраняем данные если стоит галочка
        if (rememberInput.checked) {
            saveData(email, password);
        }
        else {
            clearData();
        }
        showMessage("Вход выполнен", "success");
    }
    else {
        showMessage("Неверная почта или пароль. Попробуйте снова", "error")
    }
});

// ============================================
// ХРАНЕНИЕ ДАННЫХ (localStorage)
// хранить пароль в открытом виде опасненько, но в задании написано про пару логин-пароль
// ирл пароль на клиенте не хранят
// ============================================
const storageKey = "loginData";
const rememberInput = document.getElementById("remember");

// сохр логин и пароль
// localStorage хранит только строки, поэтрму JSON
function saveData(email, password) {
    localStorage.setItem(storageKey, JSON.stringify({email, password}));
}

function clearData() {
    localStorage.removeItem(storageKey);
}

// читает сохранённую пару
// если ничего нет или данные повреждены, вернёт null
function loadData() {
    const raw = localStorage.getItem(storageKey);
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