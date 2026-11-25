// jsdom не реализует AnimationEvent, а React DOM проверяет его наличие при загрузке
// без полифила обработчик onAnimationEnd вешается на webkitAnimationEnd,
// и fireEvent.animationEnd не срабатывает.
class AnimationEventPolyfill extends Event {
    readonly animationName: string;
    readonly elapsedTime: number;
    readonly pseudoElement: string;

    constructor(type: string, init: AnimationEventInit = {}) {
        super(type, init);
        this.animationName = init.animationName ?? "";
        this.elapsedTime = init.elapsedTime ?? 0;
        this.pseudoElement = init.pseudoElement ?? "";
    }
}

if (typeof window.AnimationEvent === "undefined") {
    Object.defineProperty(window, "AnimationEvent", {
        configurable: true,
        writable: true,
        value: AnimationEventPolyfill,
    });
}
