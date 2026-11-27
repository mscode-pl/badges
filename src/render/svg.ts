import type { Icon } from '../icons/types';
import { contrast, ink, luminance } from './colors';

export function escapeXml(value: string): string {
    return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function n(value: number): string {
    return String(Math.round(value * 100) / 100);
}

function chroma(hex: string): number {
    const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    return Math.max(...channels) - Math.min(...channels);
}

function mix(hex: string, toward: string, amount: number): string {
    const a = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const b = [1, 3, 5].map((i) => parseInt(toward.slice(i, i + 2), 16));
    return `#${a.map((v, i) => Math.round(v + (b[i]! - v) * amount).toString(16).padStart(2, '0')).join('')}`;
}

// Near-grey marks flip to the ground's ink; coloured marks shift toward it just enough to stay visible.
export function markColor(mark: string, ground: string, minimum = 2): string {
    if (contrast(mark, ground) >= minimum) return mark;
    const target = luminance(ground) > 0.5 ? ink.dark : ink.light;
    if (chroma(mark) < 0.2) return target;
    for (let step = 0.1; step <= 0.6; step += 0.1) {
        const shifted = mix(mark, target, step);
        if (contrast(shifted, ground) >= minimum) return shifted;
    }
    return target;
}

// Wide logos such as Przelewy24 may spread past the square box by `spread`, so they stay legible in a tile.
export function drawIcon(icon: Icon, x: number, y: number, size: number, ground: string, fill?: string, spread = 1): string {
    if ('body' in icon) {
        const [, , vw = 1, vh = 1] = icon.viewBox.split(' ').map(Number);
        const aspect = vw / vh;
        const w = Math.min(size * spread, size * Math.max(1, aspect));
        const h = Math.min(size, w / aspect);
        return `<svg x="${n(x + (size - w) / 2)}" y="${n(y + (size - h) / 2)}" width="${n(w)}" height="${n(h)}" viewBox="${icon.viewBox}" overflow="visible">${icon.body}</svg>`;
    }
    const scale = size / 24;
    return `<path fill="${fill ?? markColor(icon.hex, ground)}" transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})" d="${icon.path}"/>`;
}
