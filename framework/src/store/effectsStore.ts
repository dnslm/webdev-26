import { create } from "zustand";

// состояние, которое нужно двум не связанным друг с другом частям приложения:
// хуку с секретным кодом (включает), компоненту со снегом (показывает)
// и форме (показывает сообщение-пасхалку)
interface EffectsState {
    isSnowing: boolean;
    // сообщение в форме после ввода секретного слова; null, когда его нет
    easterEggMessage: string | null;
    toggleSnow: () => void;
    clearEasterEgg: () => void;
}

export const useEffectsStore = create<EffectsState>()((set) => ({
    isSnowing: false,
    easterEggMessage: null,

    toggleSnow: () => {
        set((state) => ({
            isSnowing: !state.isSnowing,
            // как в native: сообщение появляется при включении снега,
            // при выключении остаётся до следующего действия с формой
            easterEggMessage: state.isSnowing ? state.easterEggMessage : "пасхалко🥶",
        }));
    },

    clearEasterEgg: () => {
        set({ easterEggMessage: null });
    },
}));
