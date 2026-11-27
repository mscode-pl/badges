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

export interface IconOptions {
    ground: string;
    fill?: string;
    spread?: number;
    // Wide marks shrink to this share of the box, so heavy wordmarks such as P24 keep clear of a tile edge.
    wide?: number;
    minimum?: number;
}

// Fits a viewBox into the square box; wide marks may spread past it by `spread` so they stay legible in a tile.
function nest(viewBox: string, content: string, x: number, y: number, size: number, spread: number, wide = 1): string {
    const [, , vw = 1, vh = 1] = viewBox.split(' ').map(Number);
    const aspect = vw / vh;
    const w = Math.min(size * spread, size * Math.max(1, aspect)) * (aspect > 1.3 ? wide : 1);
    const h = Math.min(size, w / aspect);
    return `<svg x="${n(x + (size - w) / 2)}" y="${n(y + (size - h) / 2)}" width="${n(w)}" height="${n(h)}" viewBox="${viewBox}" overflow="visible">${content}</svg>`;
}

export function drawIcon(icon: Icon, x: number, y: number, size: number, options: IconOptions): string {
    const { ground, fill, spread = 1, minimum = 2, wide = 1 } = options;
    if ('body' in icon) {
        const content = fill && icon.mono
            ? `<path fill="${fill}" fill-rule="evenodd" d="${icon.mono}"/>`
            : fill && icon.monoBody ? `<g color="${fill}">${icon.monoBody}</g>` : icon.body;
        return nest(fill && icon.mono ? (icon.monoBox ?? icon.viewBox) : icon.viewBox, content, x, y, size, spread, wide);
    }
    const backing = !fill && icon.backing ? `<rect x="2" y="2" width="20" height="20" fill="${icon.backing}"/>` : '';
    const color = fill ?? (backing ? icon.hex : markColor(icon.hex, ground, minimum));
    const stroke = icon.bold ? ` stroke="${color}" stroke-width="${icon.bold}" stroke-linejoin="round"` : '';
    const content = `${backing}<path fill="${color}"${stroke} d="${icon.path}"/>`;
    const [, , bw = 1, bh = 1] = (icon.box ?? '0 0 24 24').split(' ').map(Number);
    // In a tile, wide marks such as MySQL use their tight box instead of a thin band of the 24 square.
    const viewBox = spread > 1 && icon.box && bw / bh > 1.2 ? icon.box : '0 0 24 24';
    return nest(viewBox, content, x, y, size, spread, wide);
}
