// РАЗДЕЛЕНИЕ script.ts НА ЧАСТИ СО СВОЕЙ ЛОГИКОЙ

// ============================================
// ВАЛИДАЦИЯ
// чистые функции: ничего не знают про DOM, поэтому их легко тестировать
// ============================================

// именованная функция проверки формата email
export function isValidEmail(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
}

// именованная функция валидация пароля
// минимум 8 символов, хотя бы одна буква и одна цифра
export function isValidPassword(value: string): boolean {
    const passwordPattern = /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d).{8,}$/;
    return passwordPattern.test(value);
}
