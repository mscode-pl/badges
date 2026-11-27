import type { Icon } from '../icons/types';
import { contrast, ink, luminance, textOn } from './colors';
import { measure, textPath } from './text';

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

export function drawIcon(icon: Icon, x: number, y: number, size: number, ground: string, fill?: string): string {
    if ('monogram' in icon) {
        const fontSize = Math.min(size * 0.5, (size * 0.78) / Math.max(1, measure('display', icon.monogram, 1)));
        const width = measure('display', icon.monogram, fontSize);
        const tx = x + (size - width) / 2;
        const ty = y + size / 2 + fontSize * 0.36;
        const tileFill = fill ?? icon.hex;
        const letters = fill ? ground : textOn(icon.hex);
        return `<rect x="${n(x)}" y="${n(y)}" width="${n(size)}" height="${n(size)}" rx="${n(size * 0.22)}" fill="${tileFill}"/>`
            + `<path fill="${letters}" d="${textPath('display', icon.monogram, fontSize, tx, ty)}"/>`;
    }
    const scale = size / 24;
    return `<path fill="${fill ?? markColor(icon.hex, ground)}" transform="translate(${n(x)} ${n(y)}) scale(${n(scale)})" d="${icon.path}"/>`;
}
