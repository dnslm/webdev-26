// РАЗДЕЛЕНИЕ script.ts НА ЧАСТИ СО СВОЕЙ ЛОГИКОЙ

// ============================================
// ПРОВЕРКА ДАННЫХ ДЛЯ ВХОДА (хардкод)
// настоящей проверки на сервере нет: верная пара зашита в код
// ============================================

export const CORRECT_EMAIL = "test@email.com";
export const CORRECT_PASSWORD = "abobaBebra1487";

export function checkData(email: string, password: string): boolean {
    return email === CORRECT_EMAIL && password === CORRECT_PASSWORD;
}
