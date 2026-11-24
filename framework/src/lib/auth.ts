// ============================================
// ПРОВЕРКА ДАННЫХ ДЛЯ ВХОДА (хардкод)
// настоящего сервака нет: верная пара зашита в код
// а задержка имитирует сетевой запрос
// ============================================

export const CORRECT_EMAIL = "test@email.com";
export const CORRECT_PASSWORD = "abobaBebra1487";
export const LOGIN_DELAY_MS = 800;

export function checkCredentials(email: string, password: string): boolean {
    return email === CORRECT_EMAIL && password === CORRECT_PASSWORD;
}

// имитация запроса к серверу: ответ приходит с задержкой
// позже эту функцию можно заменить на настоящий fetch к mock API
export function requestLogin(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(checkCredentials(email, password));
        }, LOGIN_DELAY_MS);
    });
}
