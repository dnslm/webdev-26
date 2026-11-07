// ============================================
// ТИПЫ ДАННЫХ ПРИЛОЖЕНИЯ
// ============================================

// тип сообщения для пользователя
// от него зависит цвет текста (класс .error или .success)
export type MessageType = "error" | "success";

// пара логин/пароль 
// её вводят в форму и сохраняют в localStorage
export interface UserData {
    email: string;
    password: string;
}