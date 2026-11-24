// ============================================
// ТИПЫ ДАННЫХ ПРИЛОЖЕНИЯ
// ============================================

// тип сообщения для пользователя: от него зависит цвет текста
export type MessageType = "error" | "success";

// сообщение под полями формы
export interface Message {
    text: string;
    type: MessageType;
}

// пара логин/пароль: её вводят в форму и сохраняют в localStorage
export interface UserData {
    email: string;
    password: string;
}

// состояние проверки поля формы
export type FieldState = "idle" | "valid" | "invalid";
