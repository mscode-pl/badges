export const named: Record<string, string> = {
    blue: '#1a5bb5',
    green: '#1a7f45',
    brightgreen: '#1a7f45',
    red: '#c4343a',
    orange: '#c2410c',
    yellow: '#e8b311',
    purple: '#6d3fc0',
    pink: '#c0307a',
    gray: '#5b6474',
    grey: '#5b6474',
    black: '#0a0a0a',
    white: '#ffffff',
    success: '#1a7f45',
    critical: '#c4343a',
    important: '#c2410c',
    informational: '#1a5bb5',
    inactive: '#5b6474',
};

export const defaultColor = named.blue!;

export function parseColor(input: string | null | undefined, fallback = defaultColor): string {
    if (!input) return fallback;
    const value = input.trim().toLowerCase();
    if (named[value]) return named[value]!;
    const hex = value.replace(/^#/, '');
    if (/^[0-9a-f]{6}$/.test(hex)) return `#${hex}`;
    if (/^[0-9a-f]{3}$/.test(hex)) return `#${[...hex].map((c) => c + c).join('')}`;
    return fallback;
}

function channel(hex: string, i: number): number {
    const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
    return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
}

export function contrast(a: string, b: string): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
    return (hi + 0.05) / (lo + 0.05);
}

export const ink = { light: '#ffffff', dark: '#0a0a0a' };

// White reads better on brand colours like Node green or Laravel red even below 4.5:1, so it wins from 3:1 up.
export function textOn(bg: string): string {
    return contrast(bg, ink.light) >= 3 ? ink.light : ink.dark;
}
