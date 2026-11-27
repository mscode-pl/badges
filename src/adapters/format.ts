export function compactNumber(value: number): string {
    const units: [number, string][] = [
        [1e9, 'B'],
        [1e6, 'M'],
        [1e3, 'k'],
    ];
    for (const [size, suffix] of units) {
        if (value >= size) {
            const scaled = value / size;
            const digits = scaled < 10 ? 1 : 0;
            return `${Number(scaled.toFixed(digits))}${suffix}`;
        }
    }
    return String(Math.round(value));
}

export function version(value: string): string {
    return /^\d/.test(value) ? `v${value}` : value;
}

