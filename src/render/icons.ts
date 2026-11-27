import type { Icon } from '../icons/types';
import type { Theme } from './badge';
import { drawIcon, escapeXml } from './svg';

const tile = 256;
const gap = 44;
const mark = 150;

const grounds: Record<Theme, { bg: string; stroke: string; opacity: number; minimum: number }> = {
    dark: { bg: '#0b1728', stroke: '#ffffff', opacity: 0.1, minimum: 3 },
    light: { bg: '#ffffff', stroke: '#0a0a0a', opacity: 0.1, minimum: 2.2 },
};

export function renderIconRow(list: Icon[], theme: Theme, perLine: number): string {
    const ground = grounds[theme];
    const columns = Math.max(1, Math.min(perLine, list.length));
    const rows = Math.ceil(list.length / columns);
    const width = columns * tile + (columns - 1) * gap;
    const height = rows * tile + (rows - 1) * gap;
    const offset = (tile - mark) / 2;

    const body = list.map((icon, i) => {
        const x = (i % columns) * (tile + gap);
        const y = Math.floor(i / columns) * (tile + gap);
        return `<g><title>${escapeXml(icon.title)}</title>`
            + `<rect x="${x + 2}" y="${y + 2}" width="${tile - 4}" height="${tile - 4}" rx="58" fill="${ground.bg}" stroke="${ground.stroke}" stroke-opacity="${ground.opacity}" stroke-width="4"/>`
            + drawIcon(icon, x + offset, y + offset, mark, { ground: ground.bg, spread: 1.45, minimum: ground.minimum })
            + '</g>';
    }).join('');

    const label = escapeXml(list.map((icon) => icon.title).join(', '));
    // Width and height follow skillicons (48px per icon), so existing height="40" markup keeps working.
    const scale = 48 / tile;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(width * scale)}" height="${Math.round(height * scale)}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">${body}</svg>`;
}
