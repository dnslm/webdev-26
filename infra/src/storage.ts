// РАЗДЕЛЕНИЕ script.ts НА ЧАСТИ СО СВОЕЙ ЛОГИКОЙ

import type { UserData } from "./types";

// ============================================
// ХРАНЕНИЕ ДАННЫХ (localStorage)
// хранить пароль в открытом виде опасненько, но в задании написано про пару логин-пароль
// ирл пароль на клиенте не хранят
// ============================================

export const STORAGE_KEY = "loginData";

// сохр логин и пароль
// localStorage хранит только строки, поэтому JSON
export function saveData(email: string, password: string): void {
    const data: UserData = { email, password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData(): void {
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
export function loadData(): UserData | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(raw);
        return isData(parsed) ? parsed : null;
    } catch {
        return null;
    }
}