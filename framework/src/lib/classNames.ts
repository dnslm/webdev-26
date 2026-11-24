// склеивает имена классов и пропускает пустые значения
// нужна, потому что у CSS Modules значение по ключу может быть undefined
export function classNames(...names: (string | false | null | undefined)[]): string {
    return names
        .filter((name): name is string => typeof name === "string" && name !== "")
        .join(" ");
}
