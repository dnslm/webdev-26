import { beforeEach, describe, expect, it } from "vitest";

import { useEffectsStore } from "./effectsStore";

const initialState = useEffectsStore.getState();

describe("useEffectsStore", () => {
    beforeEach(() => {
        useEffectsStore.setState(initialState, true);
    });

    it("по умолчанию снег выключен", () => {
        expect(useEffectsStore.getState().isSnowing).toBe(false);
    });

    it("toggleSnow включает и выключает снег", () => {
        useEffectsStore.getState().toggleSnow();
        expect(useEffectsStore.getState().isSnowing).toBe(true);

        useEffectsStore.getState().toggleSnow();
        expect(useEffectsStore.getState().isSnowing).toBe(false);
    });
});
