import type { Icon } from '../icons/types';
import { contrast, ink } from './colors';
import { drawIcon, escapeXml, n } from './svg';

export type IconTheme = 'dark' | 'light' | 'color';

const tile = 256;
const gap = 44;
const mark = 172;
const radius = 58;

const grounds: Record<'dark' | 'light', { bg: string; stroke: string; minimum: number }> = {
    dark: { bg: '#0b1728', stroke: '#ffffff', minimum: 3 },
    light: { bg: '#ffffff', stroke: '#0a0a0a', minimum: 2.2 },
};

function isFull(icon: Icon): boolean {
    return 'path' in icon ? Boolean(icon.backing) : Boolean(icon.full);
}

// In the colour theme square logos (TS, JS, CSS, LinkedIn) become the tile itself, clipped to its corners.
function fullLogo(icon: Icon, i: number, x: number, y: number): string {
    const content = 'path' in icon
        ? `<rect x="2" y="2" width="20" height="20" fill="${icon.backing}"/><path fill="${icon.hex}" d="${icon.path}"/>`
        : icon.body;
    const viewBox = 'path' in icon ? '0 0 24 24' : icon.viewBox;
    return `<clipPath id="c${i}"><rect x="${x}" y="${y}" width="${tile}" height="${tile}" rx="${radius}"/></clipPath>`
        + `<g clip-path="url(#c${i})"><rect x="${x}" y="${y}" width="${tile}" height="${tile}" fill="${icon.hex}"/>`
        + `<svg x="${x}" y="${y}" width="${tile}" height="${tile}" viewBox="${viewBox}" preserveAspectRatio="none">${content}</svg></g>`;
}

function colorTile(icon: Icon, i: number, x: number, y: number): string {
    const offset = (tile - mark) / 2;
    const stops = ('tile' in icon && icon.tile ? icon.tile : icon.hex).split(',');
    const fill = stops.length > 1 ? `url(#t${i})` : stops[0]!;
    const defs = stops.length > 1
        ? `<linearGradient id="t${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${stops[0]}"/><stop offset="1" stop-color="${stops[1]}"/></linearGradient>`
        : '';
    // White marks like skillicons; dark only on tiles too pale for white, such as yellow.
    const markInk = contrast(stops[0]!, ink.light) >= 2.2 ? ink.light : ink.dark;
    const back = `${defs}<rect x="${x}" y="${y}" width="${tile}" height="${tile}" rx="${radius}" fill="${fill}"/>`;
    if ('tileBody' in icon && icon.tileBody) {
        const size = mark * 0.82;
        const at = (tile - size) / 2;
        return back + `<svg x="${n(x + at)}" y="${n(y + at)}" width="${n(size)}" height="${n(size)}" viewBox="0 0 24 24">${icon.tileBody}</svg>`;
    }
    return back + drawIcon(icon, x + offset, y + offset, mark, { ground: stops[0]!, fill: markInk, wide: 0.88 });
}

export function renderIconRow(list: Icon[], theme: IconTheme, perLine: number): string {
    const columns = Math.max(1, Math.min(perLine, list.length));
    const rows = Math.ceil(list.length / columns);
    const width = columns * tile + (columns - 1) * gap;
    const height = rows * tile + (rows - 1) * gap;
    const offset = (tile - mark) / 2;

    const body = list.map((icon, i) => {
        const x = (i % columns) * (tile + gap);
        const y = Math.floor(i / columns) * (tile + gap);
        let content: string;
        if (theme === 'color') content = isFull(icon) ? fullLogo(icon, i, x, y) : colorTile(icon, i, x, y);
        else {
            const ground = grounds[theme];
            content = `<rect x="${x + 2}" y="${y + 2}" width="${tile - 4}" height="${tile - 4}" rx="${radius}" fill="${ground.bg}" stroke="${ground.stroke}" stroke-opacity="0.1" stroke-width="4"/>`
                + drawIcon(icon, x + offset, y + offset, mark, { ground: ground.bg, minimum: ground.minimum, wide: 0.88 });
        }
        return `<g><title>${escapeXml(icon.title)}</title>${content}</g>`;
    }).join('');

    const label = escapeXml(list.map((icon) => icon.title).join(', '));
    // Width and height follow skillicons (48px per icon), so existing height="40" markup keeps working.
    const scale = 48 / tile;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width * scale)}" height="${Math.round(height * scale)}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${body}</svg>`;
}
