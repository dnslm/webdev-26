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