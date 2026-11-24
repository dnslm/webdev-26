import { create } from "zustand";
import { persist } from "zustand/middleware";

import { requestLogin } from "../lib/auth";
import type { UserData } from "../types";

// ============================================
// ХРАНИЛИЩЕ АВТОРИЗАЦИИ (Zustand)
// здесь живёт то что нужно сразу нескольким частям приложения:
// статус входа, текущий юзер и сохранённая пара для "Запомнить пароль".
// Значения полей формы остаются локальным состоянием формы
// ============================================

export type AuthStatus = "idle" | "loading" | "success" | "error";

export const AUTH_STORAGE_KEY = "framework-auth";

interface AuthState {
    status: AuthStatus;
    // текущий пользователь: появляется после успешного входа
    user: { email: string } | null;
    // сохранённая пара для "Запомнить пароль" (единственное, что попадает в localStorage)
    remembered: UserData | null;
    login: (credentials: UserData, remember: boolean) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            status: "idle",
            user: null,
            remembered: null,

            login: async ({ email, password }, remember) => {
                set({ status: "loading" });

                const isCorrect = await requestLogin(email, password);

                if (isCorrect) {
                    set({
                        status: "success",
                        user: { email },
                        // чекбокс не отмечен: стираем ранее сохранённую пару
                        remembered: remember ? { email, password } : null,
                    });
                } else {
                    set({ status: "error", user: null });
                }
            },

            logout: () => {
                set({ status: "idle", user: null });
            },
        }),
        {
            name: AUTH_STORAGE_KEY,
            // в localStorage сохраняем только пару, а не status и user
            partialize: (state) => ({ remembered: state.remembered }),
        },
    ),
);
