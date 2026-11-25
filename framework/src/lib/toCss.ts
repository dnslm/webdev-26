// число + единица измерения -> строка для CSS, например toCss(37.5, "vw") даёт "37.50vw"
// явное преобразование нужно из-за строгих правил линтера: числа нельзя склеивать со строками
export function toCss(value: number, unit: string): string {
    return `${value.toFixed(2)}${unit}`;
}
